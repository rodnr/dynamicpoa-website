import React, { useState } from 'react';
import checkImage from '../../images/check.svg';
import seta from '../../images/seta.svg';
import '../../css/app.css';
import Button from './../Button';
import { FaRegClock } from 'react-icons/fa';

import * as S from './styled';

const PrecosSection = () => {
  const [tipoPlano, setTipoPlano] = useState('Anual');
  const [dataTable] = useState([
    {
      id: 1,
      name: 'Horas disponíveis/mês',
      simples: '30h',
      padrao: '60h',
      completo: '90h',
      father: -1
    },
    {
      id: 2,
      name: 'Treinamentos online/in-company inclusos',
      simples: '-',
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 3,
      name: 'Suporte e configuração do Administrador do Microsoft 365',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 4,
      name: 'Suporte e resolução de dúvidas em geral sobre licenciamento',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 5,
      name: 'Análise de possibilidades de automação e melhorias',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 6,
      name: 'Contato com o Suporte do Microsoft Office para resolução de problemas',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 7,
      name: 'Instalação e implementação das ferramentas do Microsoft 365 e Plataforma Power',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    { id: 8, name: 'Suporte em Microsoft Excel', simples: 1, padrao: 1, completo: 1, father: 0 },
    {
      id: 9,
      name: 'Criação de planilhas/templates personalizados',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 8
    },
    {
      id: 10,
      name: 'Edição de planilhas (fórmulas, layout, correções, configurações, VBA, etc.)',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 8
    },
    {
      id: 11,
      name: 'Criação de gráficos e dashboards',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 8
    },
    {
      id: 12,
      name: 'Correção de erros em planilhas/códigos VBA',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 8
    },
    { id: 13, name: 'Digitação', simples: 1, padrao: 1, completo: 1, father: 8 },
    {
      id: 15,
      name: 'Conexão com dados externos/APIs e tratamento de fontes de dados via Power Query',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 8
    },
    {
      id: 16,
      name: 'Suporte em Microsoft PowerPoint',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 17,
      name: 'Criação de apresentações/templates personalizados',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 16
    },
    {
      id: 18,
      name: 'Edição de apresentações (animações, layout, design, configurações, etc.)',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 16
    },
    { id: 19, name: 'Criação de gráficos', simples: 1, padrao: 1, completo: 1, father: 16 },
    { id: 20, name: 'Revisão de apresentações', simples: 1, padrao: 1, completo: 1, father: 16 },
    { id: 21, name: 'Suporte em Microsoft Word', simples: 1, padrao: 1, completo: 1, father: 0 },
    {
      id: 22,
      name: 'Criação de documentos/templates personalizados',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 21
    },
    {
      id: 23,
      name: 'Edição de documentos (formatação, design, configurações, etc.)',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 21
    },
    { id: 24, name: 'Criação de gráficos', simples: 1, padrao: 1, completo: 1, father: 21 },
    { id: 25, name: 'Digitação', simples: 1, padrao: 1, completo: 1, father: 21 },
    {
      id: 26,
      name: 'Suporte em Microsoft Forms',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 27,
      name: 'Criação de formulários/templates personalizados',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 26
    },
    {
      id: 28,
      name: 'Suporte em Microsoft OneDrive',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 29,
      name: 'Instalação e configuração do OneDrive como ambiente compartilhado entre os usuários',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 28
    },
    {
      id: 30,
      name: 'Estruturação das permissões em arquivos compartilhados',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 28
    },
    {
      id: 31,
      name:
        'Criação de planilhas do Excel Online como base de dados em nuvem simples para outras ferramentas',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 28
    },
    {
      id: 32,
      name: 'Automatização de criação, cópia e edição de arquivos',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 28
    },
    {
      id: 33,
      name: 'Suporte em Microsoft Outlook',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 34,
      name: 'Instalação e configuração do Outlook',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 33
    },
    {
      id: 35,
      name: 'Criação de regras e personalizações',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 33
    },
    {
      id: 36,
      name: 'Estruturação dos contatos e reuniões/eventos',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 33
    },
    {
      id: 37,
      name: 'Automatização de criação de contatos',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 33
    },
    {
      id: 38,
      name: 'Automatização de criação de eventos/reuniões',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 33
    },
    {
      id: 39,
      name: 'Automatização de envio, cópia e encaminhamento de e-mails',
      simples: '-',
      padrao: 1,
      completo: 1,
      father: 33
    },
    {
      id: 40,
      name: 'Suporte em Microsoft Teams',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 41,
      name: 'Configurações de equipes e canais',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 40
    },
    {
      id: 42,
      name: 'Configurações de membros/convidados/acessos externos',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 40
    },
    {
      id: 43,
      name: 'Suporte em Microsoft SharePoint',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 44,
      name: 'Criação de sites personalizados',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 43
    },
    {
      id: 45,
      name: 'Automatização de criação, cópia e edição de arquivos e listas',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 43
    },
    {
      id: 46,
      name: 'Suporte em Microsoft Power BI',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    { id: 47, name: 'Criação de novos relatórios', simples: 1, padrao: 1, completo: 1, father: 46 },
    { id: 48, name: 'Criação de painéis', simples: 1, padrao: 1, completo: 1, father: 46 },
    {
      id: 49,
      name: 'Edição de relatórios (consultas, medidas, layout, design, configurações, etc.)',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 46
    },
    {
      id: 50,
      name: 'Conexão com planilhas de Excel',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 46
    },
    {
      id: 51,
      name: 'Configurações de alertas/atualizações agendadas',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 46
    },
    {
      id: 52,
      name: 'Conexão com banco de dados SQL',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 46
    },
    {
      id: 53,
      name: 'Configurações de funções/RLS',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 46
    },
    { id: 54, name: 'Configurações de gateway', simples: '-', padrao: 1, completo: 1, father: 46 },
    {
      id: 55,
      name: 'Configurações de pacote de conteúdo organizacional/aplicativos',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 46
    },
    {
      id: 56,
      name: 'Conexão com APIs ou outras fontes',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 46
    },
    {
      id: 57,
      name: 'Suporte em Microsoft Power Apps',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 58,
      name: 'Criação de aplicativos de tela',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 57
    },
    { id: 59, name: 'Criação de portais', simples: '-', padrao: '-', completo: 1, father: 57 },
    {
      id: 60,
      name: 'Criação de CDS (Common Data Service)',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 57
    },
    {
      id: 61,
      name: 'Suporte em Microsoft Power Automate',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 0
    },
    {
      id: 62,
      name: 'Criação de fluxos de automação entre ferramentas do Microsoft 365',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 61
    },
    {
      id: 63,
      name: 'Conexão com banco de dados/gateways',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 61
    },
    {
      id: 64,
      name: 'Criação de fluxos de automação entre ferramentas externas',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: 61
    },
    {
      id: 65,
      name: 'Suporte em Microsoft Power Virtual Agents',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 66,
      name: 'Suporte em Microsoft Publisher',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 67,
      name: 'Suporte em Microsoft Stream',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 68,
      name: 'Suporte em Microsoft Delve',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 69,
      name: 'Suporte em Microsoft Yammer',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 70,
      name: 'Suporte em Microsoft Visio',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 71,
      name: 'Suporte em Microsoft Planner',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    },
    {
      id: 74,
      name: 'Suporte em Microsoft Sway',
      simples: 1,
      padrao: 1,
      completo: 1,
      father: -1
    }
  ]);

  const [sonActives, setSonActives] = useState([]);

  function handleClick(e, pai) {
    e.preventDefault();
    const index = sonActives.indexOf(pai);
    if (index > -1) {
      const newSonActives = sonActives.filter(function(value, index, arr) {
        return value != pai;
      });
      setSonActives([...newSonActives]);
    } else {
      setSonActives([...sonActives, pai]);
    }
  }

  return (
    <>
      <section id="planos" className="my-0 pb-0 ">
        <div
          className="px-4 lg:px-16  mx-auto text-center"
          style={{
            background: 'linear-gradient(to bottom, #3B5F9E 0%,  #5B87B5 70%, #fff 70%, #fff 100%)'
          }}
        >
          <h2 className="text-white text-4xl lg:text-6xl text-center font-bold pt-24 mx-4 md:mx-0">
            Planos de Consultoria
          </h2>

          <p className="mb-5 text-white text-xl font-thin mx-4 md:mx-0">
            {' '}
            Tenha especialistas nas ferramentas da Microsoft à disposição da sua empresa{' '}
          </p>

          <div className="stv-radio-buttons-wrapper div-payment-types pb-4">
            <ul className="payment-types">
              <li className="payment-type">
                <input
                  name="radioButtonTest"
                  checked={tipoPlano === 'Mensal'}
                  value="Mensal"
                  onClick={() => setTipoPlano('Mensal')}
                  type="radio"
                  id="pay-m"
                  className="stv-radio-button"
                />
                <label htmlFor="pay-m" className="p-1">
                  Contrato Trimestral
                </label>
              </li>
              <li className="payment-type" style={{ position: 'relative' }}>
                <input
                  name="radioButtonTest"
                  checked={tipoPlano === 'Anual'}
                  value="Anual"
                  onClick={() => setTipoPlano('Anual')}
                  type="radio"
                  id="pay-y"
                  className="stv-radio-button"
                />
                <label htmlFor="pay-y" className="p-1">
                  Contrato Anual
                </label>
                <S.DiscountLabel>- 20%</S.DiscountLabel>
              </li>
            </ul>
          </div>

          <div
            style={{ color: '#595959', maxWidth: '100vw', justifyContent: 'center' }}
            className="flex flex-col items-center md:flex-row md:-mx-3 mt-12"
          >
            <div className="lg:px-3 lg:m-6 md:m-2 mb-6">
              <S.Plan
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20consultoria"
              >
                <p className="mb-2 font-black text-xl title">Básico</p>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">163</span>
                    <span className="plan_month">/hora</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">146</span>
                    <span className="plan_month">/hora</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? '90 horas disponíveis' : '360 horas disponíveis'}
                  <a
                    target="_blank"
                    href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20consultoria"
                  ></a>
                </p>
                <span className="hire_button">Contratar</span>
              </S.Plan>
            </div>
            <div className="lg:px-3 lg:m-6 md:m-2 mb-6">
              <S.Plan
                className="standard"
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20consultoria"
              >
                <p className="mb-2 font-black text-xl title">Padrão</p>
                <div className="plan_recommended_tag">RECOMENDADO</div>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">150</span>
                    <span className="plan_month">/hora</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">128</span>
                    <span className="plan_month">/hora</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? '180 horas disponíveis' : '720 horas disponíveis'}
                </p>
                <span className="hire_button">Contratar</span>
              </S.Plan>
            </div>
            <div className="lg:px-3 lg:m-6 md:m-2 mb-6">
              <S.Plan
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20consultoria"
              >
                <p className="mb-2 font-black text-xl title">Completo</p>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">143</span>
                    <span className="plan_month">/hora</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">121</span>
                    <span className="plan_month">/hora</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? '270 horas disponíveis' : '1080 horas disponíveis'}
                </p>
                <span className="hire_button">Contratar</span>
              </S.Plan>
            </div>
            <div className="lg:px-3 lg:m-6 md:m-2 mb-6">
              <S.Plan
                className="personalized"
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20consultoria"
              >
                <p className="mb-2 font-black text-xl title">Personalizado</p>

                <div>Para planos com disponibilidade mensal ou períodos maiores</div>
                <span className="hire_button">Contato</span>
              </S.Plan>
            </div>
          </div>
        </div>

        <div className="table-planos">
          <h2 className="text-black text-4xl lg:text-6xl text-center font-bold mb-4 md:mx-0">
            Quais são os benefícios?
          </h2>

          <p className="mt-4 text-black text-xl font-thin mx-4 md:mx-0 text-center">
            Suporte e desenvolvimento de ferramentas nas plataformas:
          </p>

          <div className="text-center mt-16">
            <img className="w-3/5 sm:w-4/5 my-0 mx-auto" src="/assets/img/AppsMicrosoft.png" />
          </div>

          <table className="table-auto" style={{ marginTop: '60px' }}>
            <thead>
              <tr>
                <th className="lg:px-4 lg:py-2" />
                <th className="lg:px-4 lg:py-2">Básico</th>
                <th className="lg:px-4 lg:py-2">Padrão</th>
                <th className="lg:px-4 lg:py-2">Completo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td colSpan="4" className="border px-4 py-2">
                  Serviços inclusos
                </td>
              </tr>
              {dataTable.map((data, index) => {
                return (
                  <>
                    {data.father > 0 ? (
                      sonActives.indexOf(data.father) > -1 && (
                        <tr data-father={data.father}>
                          <td
                            className={
                              data.father < 1 ? 'border lg:px-4 lg:py-2' : 'border lg:px-12 lg:py-2'
                            }
                          >
                            {data.name}
                          </td>
                          <td className="border lg:px-4 lg:py-2">
                            {data.simples === 1 ? (
                              <img
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  width: '10px'
                                }}
                                src={checkImage}
                                alt="Logo"
                              />
                            ) : (
                              <label
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  width: '10px'
                                }}
                              >
                                {data.simples}
                              </label>
                            )}
                          </td>
                          <td className="border lg:px-4 lg:py-2">
                            {data.padrao === 1 ? (
                              <img
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  width: '10px'
                                }}
                                src={checkImage}
                                alt="Logo"
                              />
                            ) : (
                              <label
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  width: '10px'
                                }}
                              >
                                {data.padrao}
                              </label>
                            )}
                          </td>
                          <td className="border lg:px-4 lg:py-2">
                            {data.completo === 1 ? (
                              <img
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  width: '10px'
                                }}
                                src={checkImage}
                                alt="Logo"
                              />
                            ) : (
                              <label
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  width: '10px'
                                }}
                              >
                                {data.completo}
                              </label>
                            )}
                          </td>
                        </tr>
                      )
                    ) : (
                      <tr data-father={data.father}>
                        <td
                          className={
                            data.father < 1 ? 'border lg:px-4 lg:py-2' : 'border lg:px-12 lg:py-2'
                          }
                        >
                          {data.father == 0 ? (
                            <button onClick={e => handleClick(e, data.id)}>
                              <img
                                data-id={data.id}
                                style={{
                                  display: 'block',
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  width: '10px'
                                }}
                                src={seta}
                                alt="Logo"
                              />
                            </button>
                          ) : (
                            ''
                          )}

                          {data.name}
                        </td>
                        <td className="border lg:px-4 lg:py-2">
                          {data.simples === 1 ? (
                            <img
                              style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '10px'
                              }}
                              src={checkImage}
                              alt="Logo"
                            />
                          ) : (
                            <label
                              style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '10px'
                              }}
                            >
                              {data.simples}
                            </label>
                          )}
                        </td>
                        <td className="border lg:px-4 lg:py-2">
                          {data.padrao === 1 ? (
                            <img
                              style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '10px'
                              }}
                              src={checkImage}
                              alt="Logo"
                            />
                          ) : (
                            <label
                              style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '10px'
                              }}
                            >
                              {data.padrao}
                            </label>
                          )}
                        </td>
                        <td className="border lg:px-4 lg:py-2">
                          {data.completo === 1 ? (
                            <img
                              style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '10px'
                              }}
                              src={checkImage}
                              alt="Logo"
                            />
                          ) : (
                            <label
                              style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '10px'
                              }}
                            >
                              {data.completo}
                            </label>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="container mx-auto my-20 py-24 bg-gray-200 rounded-lg text-center">
        <h3 className="text-5xl font-semibold">Quer contratar um plano?</h3>
        <p className="mx-4 md:mx-auto mt-8 mb-12 text-lg font-light">
          Clique no botão para realizar a contratação e começar a utilizar os nossos serviços hoje
          mesmo.
        </p>
        <p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1,%20gostaria%20de%20contratar%20um%20plano%20de%20consultoria"
          >
            <Button size="lg">Entre em contato</Button>
          </a>
        </p>
      </section>
    </>
  );
};

export default PrecosSection;
