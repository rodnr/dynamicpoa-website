#!/usr/bin/env python3
"""
Gera e publica um post novo no blog da Dynamic Soluções, uma vez por dia.

Este blog usa uma estrutura bem diferente dos blogs da Implementarian e da
psibasvieira: é um site Gatsby onde cada post é um arquivo Markdown solto em
`posts/<AAAA-MM-DD>-<slug>.md` (front matter title/description/date[/thumbnail]),
descoberto automaticamente pelo Gatsby (`gatsby-source-filesystem` +
`gatsby-transformer-remark`, ver `gatsby-node.js`) — não existe posts.json nem
template HTML gerado pelo script. Além disso, os posts deste blog são
bilíngues (artigo completo em português seguido da tradução completa em
inglês, no mesmo arquivo) e usam **negrito** em vez de headings Markdown como
pseudo-subtítulo, seguindo a convenção já usada nos ~80 posts existentes.

O que o script faz, em ordem:
  1. Lê scripts/GUIDELINES.md (contexto do site, regras editoriais e a lista
     "Posts já publicados" — preenchida retroativamente com os ~80 posts
     manuais que já existiam antes da automação, e atualizada pelo próprio
     script a cada execução daqui em diante).
  2. Manda tudo para a Claude API pedindo um post novo em formato
     estruturado (JSON).
  3. Garante que o nome do arquivo (AAAA-MM-DD-slug.md) é único.
  4. Cria posts/<AAAA-MM-DD>-<slug>.md com o front matter no mesmo formato
     dos posts existentes (title/description/date) — sem `thumbnail`: o site
     já cai para uma imagem padrão quando esse campo está ausente (ver
     src/components/PostItem/index.js), e a automação não tem como gerar uma
     imagem real.
  5. Atualiza a seção "Posts já publicados" em scripts/GUIDELINES.md.
  6. Faz commit e push na branch `master`. A Netlify deste site faz
     build/deploy automático a cada push em `master`, então não há etapa
     extra de deploy aqui (mesmo padrão do site da Implementarian).

Uso:
    python scripts/generate_blog_post.py

Agendamento: via GitHub Actions em .github/workflows/daily-blog-post.yml
  (roda todo dia, e também pode ser disparado manualmente pela aba Actions do
  GitHub — "Run workflow"). O workflow usa o secret ANTHROPIC_API_KEY do
  repositório.

Pré-requisitos para rodar localmente (fora do GitHub Actions):
  - `pip install -r scripts/requirements.txt`
  - Variável de ambiente ANTHROPIC_API_KEY definida.
  - `git` configurado com permissão de push no repositório.
"""

from __future__ import annotations

import datetime
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

import anthropic

MODEL = "claude-opus-4-8"

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "posts"
GUIDELINES_PATH = REPO_ROOT / "scripts" / "GUIDELINES.md"

GITHUB_BRANCH = "master"

POST_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": (
                "Título do post em português, até ~70 caracteres, com a "
                "palavra-chave principal do tema."
            ),
        },
        "slug": {
            "type": "string",
            "description": (
                "Slug em minúsculas, com hifens, sem acentos, refletindo o "
                "tema central. Não inclua a data — ela é adicionada "
                "automaticamente pelo script."
            ),
        },
        "description": {
            "type": "string",
            "description": (
                "Meta description em português, 140 a 160 caracteres. Não "
                "comece sempre com a mesma estrutura de frase — varie a "
                "abertura a cada post, comparando com os posts recentes "
                "listados abaixo."
            ),
        },
        "keywords": {
            "type": "array",
            "items": {"type": "string"},
            "description": "5 a 8 palavras-chave de SEO para o post, em português.",
        },
        "body_markdown_pt": {
            "type": "string",
            "description": (
                "Corpo do post em português, em Markdown. Use **negrito** "
                "como pseudo-subtítulo entre parágrafos (nunca use "
                "'#'/'##'/'###' de Markdown) e listas com '*' ou '1.' quando "
                "fizer sentido. Não inclua o título como heading, não "
                "inclua imagens, não inclua front matter — só o conteúdo do "
                "artigo em português."
            ),
        },
        "body_markdown_en": {
            "type": "string",
            "description": (
                "Tradução completa e natural (não literal/robótica) do "
                "corpo do post para o inglês, com a mesma estrutura de "
                "parágrafos e **negrito** como pseudo-subtítulo, cobrindo "
                "exatamente o mesmo conteúdo técnico de body_markdown_pt."
            ),
        },
        "log_summary": {
            "type": "string",
            "description": (
                "Um resumo de uma frase do post (eixo temático + tema "
                "específico + o que o post mostra), para a lista de "
                "\"Posts já publicados\" em GUIDELINES.md."
            ),
        },
    },
    "required": [
        "title",
        "slug",
        "description",
        "keywords",
        "body_markdown_pt",
        "body_markdown_en",
        "log_summary",
    ],
    "additionalProperties": False,
}


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    text = re.sub(r"-{2,}", "-", text)
    return text or "post"


def existing_filenames() -> set[str]:
    return {p.stem for p in POSTS_DIR.glob("*.md")}


def unique_filename_slug(date_str: str, base_slug: str) -> str:
    taken = existing_filenames()
    slug = base_slug
    n = 2
    while f"{date_str}-{slug}" in taken:
        slug = f"{base_slug}-{n}"
        n += 1
    return slug


def generate_post(guidelines_text: str) -> dict:
    client = anthropic.Anthropic()

    system_prompt = (
        "Você é redator(a) técnico(a) sênior do blog da Dynamic Soluções, "
        "uma consultoria brasileira especializada em Microsoft 365, Power "
        "Platform e Dynamics 365. Siga rigorosamente as orientações abaixo "
        "— elas têm prioridade sobre qualquer prática genérica de marketing "
        "de conteúdo. Preste atenção especial à seção sobre o formato "
        "bilíngue do post (português completo seguido da tradução completa "
        "em inglês, no mesmo corpo) e ao uso de **negrito** como "
        "pseudo-subtítulo em vez de headings Markdown — essa é a convenção "
        "usada em todos os posts já publicados neste blog. IMPORTANTE sobre "
        "variedade: antes de escrever, compare com a lista de posts já "
        "publicados nas orientações abaixo e evite repetir o mesmo eixo "
        "temático, tema específico ou abertura de frase. Gere exatamente um "
        "post novo, com um tema técnico ainda não coberto pelos posts "
        "recentes, e responda só com os campos pedidos no formato "
        "estruturado.\n\n"
        f"{guidelines_text}"
    )

    user_prompt = (
        "Gere o próximo post do blog seguindo as orientações acima. Escolha "
        "um eixo temático e um tema técnico específico dentro dele que "
        "ainda não tenham sido cobertos pelos posts recentes."
    )

    response = client.messages.create(
        model=MODEL,
        max_tokens=12000,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
        output_config={"format": {"type": "json_schema", "schema": POST_SCHEMA}},
    )

    if response.stop_reason == "refusal":
        raise RuntimeError("A API recusou a geração do post (stop_reason=refusal).")

    text = next(block.text for block in response.content if block.type == "text")
    return json.loads(text)


def render_post_markdown(post: dict, date_display: str) -> str:
    # title/description entram entre aspas (via json.dumps) para que o YAML
    # do front matter não quebre caso o texto gerado contenha ":", aspas ou
    # outros caracteres especiais.
    title_yaml = json.dumps(post["title"], ensure_ascii=False)
    description_yaml = json.dumps(post["description"], ensure_ascii=False)
    body = f"{post['body_markdown_pt'].strip()}\n\n\n\n{post['body_markdown_en'].strip()}\n"
    return (
        "---\n"
        f"title: {title_yaml}\n"
        f"description: {description_yaml}\n"
        f"date: '{date_display}'\n"
        "---\n"
        f"{body}"
    )


def update_guidelines_log(post: dict, filename_slug: str, date_str: str) -> None:
    text = GUIDELINES_PATH.read_text(encoding="utf-8")
    new_line = f"- **{date_str}** — `{filename_slug}` — \"{post['title']}\": {post['log_summary']}"
    marker = "<!-- POSTS_LOG_START -->\n"
    text = text.replace(marker, marker + new_line + "\n")
    GUIDELINES_PATH.write_text(text, encoding="utf-8")


def git_commit_and_push(filename_slug: str) -> None:
    def run(*args: str) -> None:
        subprocess.run(args, cwd=REPO_ROOT, check=True)

    run("git", "add", "posts", "scripts/GUIDELINES.md")
    run(
        "git",
        "commit",
        "-m",
        f"Novo post do blog: {filename_slug}\n\nGerado automaticamente via scripts/generate_blog_post.py.",
    )
    run("git", "push", "origin", GITHUB_BRANCH)


def main() -> int:
    POSTS_DIR.mkdir(parents=True, exist_ok=True)

    guidelines_text = GUIDELINES_PATH.read_text(encoding="utf-8")

    now = datetime.datetime.now()
    date_only = now.strftime("%Y-%m-%d")
    date_display = now.strftime("%Y-%m-%d %H:%M:%S")

    print("Gerando post com a Claude API...")
    post = generate_post(guidelines_text)

    filename_slug = unique_filename_slug(date_only, slugify(post["slug"]))
    full_slug = f"{date_only}-{filename_slug}"

    markdown = render_post_markdown(post, date_display)
    (POSTS_DIR / f"{full_slug}.md").write_text(markdown, encoding="utf-8")

    update_guidelines_log(post, full_slug, date_only)

    print(f"Post gerado: posts/{full_slug}.md")
    print("Publicando (git commit + push)...")
    git_commit_and_push(full_slug)
    print(f"Publicado. A Netlify vai fazer o deploy automaticamente a partir do push em {GITHUB_BRANCH}.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # pragma: no cover - script de automação
        print(f"Falha ao gerar/publicar o post: {exc}", file=sys.stderr)
        sys.exit(1)
