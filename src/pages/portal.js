import React from 'react';
import SEO from '../components/seo';
import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import Card from '../components/Card';

const PORTAL_URL = 'https://dynamicpoa.powerappsportals.com/';
const WHATSAPP_PORTAL =
  'https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20o%20portal%20self-service%20da%20Dynamic.';
const ADS_CONVERSION = 'AW-11059828868/INSERIR_LABEL_AQUI';

function trackCta(label) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'portal_landing',
      event_label: label,
      send_to: ADS_CONVERSION
    });
  }
}

const CtaButton = ({ label, size, className, children }) => (
  <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackCta(label)}>
    <Button size={size} className={className}>
      {children}
    </Button>
  </a>
);

const features = [
  {
    icon: '🛠️',
    title: 'Chamados de Desenvolvimento',
    description:
      'Registre solicitações diretamente no portal. O Agente de Análise avalia o contexto técnico e retorna uma estimativa de horas com proposta de abordagem — documentada e rastreada no Dataverse antes de qualquer intervenção da equipe.',
    cta: 'Abrir um chamado',
    ctaLabel: 'cta_feature_consultoria'
  },
  {
    icon: '📋',
    title: 'Gestão de Licenças',
    description:
      'Solicite licenças Microsoft (Microsoft 365, Power Apps, Power Pages, Power BI, Dynamics 365) com rastreamento completo no Dataverse. Histórico de emissões, status de renovação e solicitações pendentes — tudo centralizado, sem trocas de e-mail.',
    cta: 'Solicitar licença',
    ctaLabel: 'cta_feature_licencas'
  },
  {
    icon: '⏱️',
    title: 'Contratos de Horas',
    description:
      'Visualize saldo disponível, horas consumidas por tarefa e histórico de registros vinculados ao seu contrato — dados consultados em tempo real, sem planilhas manuais e sem defasagem de informação.',
    cta: 'Ver meu contrato',
    ctaLabel: 'cta_feature_contrato'
  },
  {
    icon: '⚙️',
    title: 'Pipeline CI/CD com Agentes de IA',
    description:
      'Cada chamado percorre um pipeline estruturado: análise técnica → precificação → desenvolvimento → revisão → deploy em produção. Em cada etapa, um agente Claude AI executa a ação correspondente e registra o resultado no portal — com ALM aplicado em todo o ciclo.',
    cta: 'Conhecer o pipeline',
    ctaLabel: 'cta_feature_ia'
  }
];

const steps = [
  {
    number: '01',
    title: 'Registro no portal Power Pages',
    description: 'Autenticação Microsoft, provisionamento da conta e vinculação ao ambiente Power Platform da sua empresa.'
  },
  {
    number: '02',
    title: 'Chamado registrado e encaminhado',
    description: 'A solicitação é gravada no Dataverse e entra automaticamente no pipeline de desenvolvimento — sem etapas manuais de triagem.'
  },
  {
    number: '03',
    title: 'Agente de Análise em execução',
    description: 'O agente Claude AI avalia o contexto técnico, retorna estimativa de horas e proposta de abordagem — visível no portal em tempo real.'
  },
  {
    number: '04',
    title: 'Desenvolvimento, revisão e deploy',
    description: 'O pipeline CI/CD conduz cada etapa com ALM aplicado: implementação, revisão de código, testes, validação e deploy em produção — rastreável no portal.'
  }
];

const stats = [
  { value: '1.500+', label: 'projetos Power Platform entregues' },
  { value: '< 24h', label: 'do chamado à estimativa técnica' },
  { value: '4 agentes', label: 'Claude AI no pipeline de desenvolvimento' },
  { value: '100%', label: 'rastreabilidade do ciclo de desenvolvimento' }
];

const PortalPage = () => (
  <Layout>
    <SEO
      title="Portal Self-Service Dynamic | Pipeline de Desenvolvimento Power Platform com IA"
      description="Portal desenvolvido em Power Pages com pipeline CI/CD, agentes Claude AI e rastreabilidade total no Dataverse. Gerencie chamados, licenças e contratos de Power Platform em tempo real."
    />

    {/* HERO */}
    <section className="pt-20 pb-16" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-left p-4 lg:pr-16 lg:w-1/2">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(32,42,69,0.08)', color: '#202A45' }}
          >
            Power Pages · Dataverse · CI/CD
          </span>
          <h1 className="hero-title">
            Gestão técnica de Power Platform com rastreabilidade total — do chamado ao deploy em produção
          </h1>
          <p className="hero-description">
            Um portal desenvolvido em Power Pages, com Dataverse como backbone e um pipeline de CI/CD orientado a agentes Claude AI — operando em cada etapa do ciclo de desenvolvimento: análise técnica, estimativa, implementação e revisão de código.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <CtaButton label="cta_hero_criar_conta" size="lg">
              Acessar o portal
            </CtaButton>
            <a
              href={WHATSAPP_PORTAL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackCta('cta_hero_whatsapp')}
              className="inline-flex items-center justify-center py-4 px-8 rounded border-2 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              💬 Falar com a equipe técnica
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">Exclusivo para clientes Dynamic · Provisionamento imediato</p>
        </div>

        <div className="mt-12 lg:mt-0 lg:w-1/2">
          <div
            className="rounded-2xl p-8 text-white"
            style={{ background: 'linear-gradient(135deg, #202A45 0%, #3B5F9E 100%)' }}
          >
            <p className="text-xs uppercase tracking-widest opacity-70 mb-4">Portal Dynamic Self-Service</p>
            <div className="space-y-3">
              {[
                { icon: '✅', text: 'Análise técnica de chamados por agente Claude AI com estimativa de horas' },
                { icon: '✅', text: 'Estimativa e proposta de abordagem registradas automaticamente no Dataverse' },
                { icon: '✅', text: 'Pipeline CI/CD com ALM — versionamento, revisão e deploy gerenciados' },
                { icon: '✅', text: 'Licenças Microsoft (M365, Power Platform, Dynamics) com histórico centralizado' },
                { icon: '✅', text: 'Saldo e consumo de contratos de horas consultados em tempo real' },
                { icon: '✅', text: 'Log de auditoria completo de todas as operações do portal' }
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="text-lg leading-tight">{item.icon}</span>
                  <span className="text-sm leading-snug opacity-90">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white border-opacity-20">
              <CtaButton label="cta_hero_card_acesso" className="w-full text-center justify-center">
                Acessar o Portal agora →
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* STATS */}
    <section style={{ background: 'linear-gradient(29deg, #202A45, #202A45 70%)' }} className="py-12">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-sm mt-1 text-blue-200 opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FEATURES */}
    <section id="recursos" className="py-20">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#202A45' }}>
            Uma plataforma construída sobre Power Platform
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
            Chamados de desenvolvimento, licenciamento e gestão de contratos — integrados ao Dataverse e a um pipeline de CI/CD com agentes de IA operando em cada etapa.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f) => (
            <Card key={f.title} className="p-8">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="text-xl font-bold mt-4 mb-3" style={{ color: '#202A45' }}>
                {f.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">{f.description}</p>
              <a
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta(f.ctaLabel)}
                className="font-semibold text-sm hover:underline"
                style={{ color: '#3B5F9E' }}
              >
                {f.cta} →
              </a>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <CtaButton label="cta_features_acessar_portal" size="lg">
            Acessar todos os recursos
          </CtaButton>
        </div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section
      id="como-funciona"
      className="py-20"
      style={{ background: '#f8f7f5' }}
    >
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#202A45' }}>
            Do chamado ao deploy em produção
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Um ciclo de desenvolvimento estruturado, rastreável e auditável — com visibilidade em cada etapa.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-0.5 -translate-x-4"
                  style={{ background: 'linear-gradient(90deg, #3B5F9E, transparent)' }}
                />
              )}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4"
                style={{ background: 'linear-gradient(135deg, #202A45, #3B5F9E)' }}
              >
                {step.number}
              </div>
              <h4 className="font-bold text-lg mb-2" style={{ color: '#202A45' }}>
                {step.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <CtaButton label="cta_como_funciona_comecar" size="lg">
            Registrar no portal
          </CtaButton>
        </div>
      </div>
    </section>

    {/* AI HIGHLIGHT */}
    <section className="py-20">
      <div className="container mx-auto px-8 lg:flex items-center gap-16">
        <div className="lg:w-1/2">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(59,95,158,0.1)', color: '#3B5F9E' }}
          >
            ALM · CI/CD · Agentes Claude AI
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: '#202A45' }}>
            Um pipeline de desenvolvimento orquestrado por agentes de IA
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ao registrar um chamado no portal, o Agente de Análise lê o contexto, consulta a base de código do seu ambiente Power Platform e retorna uma estimativa técnica de horas com proposta de abordagem — documentada e rastreada no Dataverse.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            O Agente de Desenvolvimento implementa a solução em ambiente controlado, com versionamento, revisão de código e deploy gerenciado. Se houver reprovação na revisão, o Agente de Revisão aplica os ajustes no mesmo ciclo — tudo visível e auditável no portal, etapa por etapa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <CtaButton label="cta_ia_section_criar_conta">
              Acessar o portal
            </CtaButton>
            <a
              href={WHATSAPP_PORTAL}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackCta('cta_ia_section_whatsapp')}
              className="inline-flex items-center justify-center py-3 px-8 rounded border-2 font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Falar com a equipe técnica
            </a>
          </div>
        </div>
        <div className="mt-12 lg:mt-0 lg:w-1/2">
          <div className="space-y-4">
            {[
              { agent: 'Agente de Análise', action: 'Estimativa técnica: 4h · abordagem documentada no chamado', status: '✅ Concluído', color: '#28a745' },
              { agent: 'Agente de Precificação', action: 'Proposta elaborada: R$ 580,00 · aguardando validação', status: '✅ Concluído', color: '#28a745' },
              { agent: 'Agente de Desenvolvimento', action: 'Solução implementada · revisão de código em andamento', status: '🔄 Em andamento', color: '#3B5F9E' },
              { agent: 'Agente de Revisão', action: 'Aguardando validação do cliente no portal', status: '⏳ Aguardando', color: '#f0a500' }
            ].map((item) => (
              <div
                key={item.agent}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#202A45' }}>{item.agent}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.action}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ color: item.color, background: `${item.color}18` }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* TESTIMONIAL / SOCIAL PROOF */}
    <section className="py-16" style={{ background: 'linear-gradient(29deg, #202A45, #3B5F9E 70%)' }}>
      <div className="container mx-auto px-8 text-center text-white">
        <p className="text-2xl lg:text-3xl font-light italic max-w-3xl mx-auto leading-relaxed">
          "Com o portal, tenho visibilidade completa do ciclo de desenvolvimento — sei exatamente em que etapa está cada chamado, as horas estimadas pelo agente de IA e o que já foi implementado. Acabaram as trocas de e-mail para saber o status do projeto."
        </p>
        <p className="mt-6 font-semibold opacity-80">— Cliente Dynamic Soluções</p>
        <div className="mt-10">
          <CtaButton label="cta_testimonial_criar_conta" size="lg">
            Registrar no portal
          </CtaButton>
        </div>
      </div>
    </section>

    {/* FOR WHOM */}
    <section className="py-20">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#202A45' }}>
            Para quem é o portal?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🏢',
              title: 'Times de Power Platform',
              description: 'Empresas com ambiente Power Platform ativo que demandam desenvolvimento, sustentação e evolução de soluções em Power Apps, Power Automate, Power Pages ou Power BI — com ALM estruturado e rastreabilidade de ponta a ponta.'
            },
            {
              icon: '🪪',
              title: 'Gestores de Licenciamento',
              description: 'Empresas que centralizam a aquisição e gestão de licenças Microsoft (Microsoft 365, Dynamics 365, Power Platform e Azure) e precisam de histórico, status e controle em um único ambiente.'
            },
            {
              icon: '⚡',
              title: 'Projetos e Demandas Pontuais',
              description: 'Empresas que contratam projetos específicos em Power Platform e precisam de visibilidade do progresso — estimativas, etapas de desenvolvimento e validações — sem overhead de reuniões de status.'
            }
          ].map((item) => (
            <Card key={item.title} className="p-8 text-center">
              <span className="text-5xl block mb-4">{item.icon}</span>
              <h4 className="font-bold text-lg mb-3" style={{ color: '#202A45' }}>{item.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* BOTTOM CTA */}
    <section className="container mx-auto my-20 py-24 bg-gray-100 rounded-2xl text-center px-8">
      <h3 className="text-4xl lg:text-5xl font-bold" style={{ color: '#202A45' }}>
        Transparência total sobre o ciclo de desenvolvimento Power Platform
      </h3>
      <p className="mx-auto mt-8 mb-12 text-lg text-gray-600 max-w-2xl">
        Do chamado ao deploy em produção, cada etapa é registrada no portal, executada por agentes de IA e rastreada no Dataverse. Sem caixas-pretas, sem surpresas no orçamento.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CtaButton label="cta_bottom_criar_conta" size="xl">
          Acessar o portal
        </CtaButton>
        <a
          href={WHATSAPP_PORTAL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackCta('cta_bottom_whatsapp')}
          className="inline-flex items-center justify-center py-5 px-16 rounded border-2 border-gray-400 font-semibold text-gray-700 hover:bg-gray-200 transition-colors text-lg"
        >
          💬 Falar com a equipe técnica
        </a>
      </div>
      <p className="mt-6 text-sm text-gray-400">Exclusivo para clientes Dynamic · Equipe técnica disponível para onboarding</p>
    </section>
  </Layout>
);

export default PortalPage;
