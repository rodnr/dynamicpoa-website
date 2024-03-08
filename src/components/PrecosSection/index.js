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
{ id: 1, name: 'Implementação do Microsoft 365 e Plataforma Power', simples: 1, padrao: 1, completo: 1},
{ id: 2, name: 'Gerenciamento de usuários, licenciamentos e armazenamento', simples: 1, padrao: 1, completo: 1},
{ id: 3, name: 'Configurações de acessos', simples: 1, padrao: 1, completo: 1},
{ id: 4, name: 'Suporte e resolução de dúvidas em geral sobre ferramentas', simples: 1, padrao: 1, completo: 1},
{ id: 5, name: 'Contato com o Suporte Técnico da Microsoft', simples: 1, padrao: 1, completo: 1},
{ id: 6, name: 'Portal de chamados com SLA - PRODUTO EXCLUSIVO DYNAMIC', simples: 1, padrao: 1, completo: 1},
{ id: 7, name: 'Acúmulo de saldo de horas não utilizadas', simples: 1, padrao: 1, completo: 1},
{ id: 8, name: 'Mapeamento de processos detalhado', simples: 1, padrao: 1, completo: 1},
{ id: 9, name: 'Painel de Controle de fluxos do Power Automate - PRODUTO EXCLUSIVO DYNAMIC', simples: 1, padrao: 1, completo: 1},
{ id: 10, name: 'Painel de Controle de logs do Power Apps - PRODUTO EXCLUSIVO DYNAMIC', simples: 1, padrao: 1, completo: 1},
{ id: 11, name: 'Painel de Controle de atualizações do Power BI - PRODUTO EXCLUSIVO DYNAMIC', simples: 1, padrao: 1, completo: 1},
{ id: 12, name: 'Relatório ROI - PRODUTO EXCLUSIVO DYNAMIC', simples: 1, padrao: 1, completo: 1},
{ id: 13, name: 'Documentação técnica de soluções criadas', simples: 1, padrao: 1, completo: 1},
{ id: 14, name: 'Gerenciamento de ambientes de DEV, HMA e PRD da Plataforma Power', simples: -1, padrao: 1, completo: 1},
{ id: 15, name: 'Implementação de setores de QA e ALM (Application Lifecycle Management)', simples: -1, padrao: -1, completo: 1},
{ id: 16, name: 'Programas de treinamento e qualificação dos colaboradores em Plataforma Power', simples: -1, padrao: -1, completo: 1},
{ id: 17, name: 'Criação de biblioteca de componentes para desenvolvedores da Plataforma Power', simples: -1, padrao: -1, completo: 1},
{ id: 18, name: 'Gestão de Conformidade e Segurança - LGPD', simples: -1, padrao: -1, completo: 1},
{ id: 19, name: 'Categorização de rótulos de confidencialidade e políticas de segurança interna', simples: -1, padrao: -1, completo: 1},
{ id: 20, name: 'Suporte no Microsoft OneDrive', simples: 1, padrao: 1, completo: 1},
{ id: 21, name: 'Suporte no Microsoft Teams', simples: 1, padrao: 1, completo: 1},
{ id: 22, name: 'Suporte no Microsoft Outlook', simples: 1, padrao: 1, completo: 1},
{ id: 23, name: 'Suporte no Microsoft Stream', simples: 1, padrao: 1, completo: 1},
{ id: 24, name: 'Suporte no Microsoft Planner', simples: 1, padrao: 1, completo: 1},
{ id: 25, name: 'Suporte no Microsoft Sway', simples: 1, padrao: 1, completo: 1},
{ id: 26, name: 'Suporte no Microsoft Yammer', simples: 1, padrao: 1, completo: 1},
{ id: 27, name: 'Suporte no Microsoft Visio', simples: 1, padrao: 1, completo: 1},
{ id: 28, name: 'Suporte no Microsoft Delve', simples: 1, padrao: 1, completo: 1},
{ id: 29, name: 'Suporte no Microsoft Copilot', simples: 1, padrao: 1, completo: 1},
{ id: 30, name: 'Suporte no Microsoft PowerPoint', simples: 1, padrao: 1, completo: 1},
{ id: 31, name: 'Suporte no Microsoft Project', simples: 1, padrao: 1, completo: 1},
{ id: 32, name: 'Microsoft Excel', simples: 1, padrao: 1, completo: 1},
{ id: 33, name: 'Criação de planilhas/templates personalizados', simples: 1, padrao: 1, completo: 1, father:32},
{ id: 34, name: 'Suporte para análise de dados', simples: 1, padrao: 1, completo: 1, father:32},
{ id: 35, name: 'Suporte técnico para criação de fórmulas, gráficos e outros recursos', simples: 1, padrao: 1, completo: 1, father:32},
{ id: 36, name: 'Manutenção em códigos VBA', simples: 1, padrao: 1, completo: 1, father:32},
{ id: 37, name: 'Automação de planilhas', simples: -1, padrao: 1, completo: 1, father:32},
{ id: 38, name: 'Microsoft Word', simples: 1, padrao: 1, completo: 1},
{ id: 39, name: 'Criação de documentos/templates personalizados', simples: 1, padrao: 1, completo: 1, father:38},
{ id: 40, name: 'Suporte técnico para criação de gráficos e outros recursos', simples: 1, padrao: 1, completo: 1, father:38},
{ id: 41, name: 'Manutenção em códigos VBA', simples: 1, padrao: 1, completo: 1, father:38},
{ id: 42, name: 'Automação de documentos', simples: -1, padrao: 1, completo: 1, father:38},
{ id: 43, name: 'Microsoft Forms', simples: 1, padrao: 1, completo: 1},
{ id: 44, name: 'Criação de formulários', simples: 1, padrao: 1, completo: 1, father:43},
{ id: 45, name: 'Automação de formulários', simples: -1, padrao: 1, completo: 1, father:43},
{ id: 46, name: 'Microsoft SharePoint', simples: 1, padrao: 1, completo: 1},
{ id: 47, name: 'Gestão de acessos, documentos e demais configurações', simples: 1, padrao: 1, completo: 1, father:46},
{ id: 48, name: 'Criação de sites e implementação de Intranet', simples: 1, padrao: 1, completo: 1, father:46},
{ id: 49, name: 'Microsoft Power BI', simples: 1, padrao: 1, completo: 1},
{ id: 50, name: 'Manutenção em queries e conexões de dados', simples: 1, padrao: 1, completo: 1, father:49},
{ id: 51, name: 'Suporte, ajustes e resolução de problemas/bugs em Relatórios', simples: 1, padrao: 1, completo: 1, father:49},
{ id: 52, name: 'Gerenciamento de atualizações, acessos e filtro RLS', simples: 1, padrao: 1, completo: 1, father:49},
{ id: 53, name: 'Configurações de gateway', simples: 1, padrao: 1, completo: 1, father:49},
{ id: 54, name: 'Criação de Painéis, Alertas e Scorecards', simples: 1, padrao: 1, completo: 1, father:49},
{ id: 55, name: 'Gerenciamento de Power BI Embedded', simples: -1, padrao: 1, completo: 1, father:49},
{ id: 56, name: 'Criação e desenvolvimento de novos Relatórios', simples: -1, padrao: 1, completo: 1, father:49},
{ id: 57, name: 'Automação de relatórios com Power BI Report Builder', simples: -1, padrao: 1, completo: 1, father:49},
{ id: 58, name: 'Microsoft Power Apps', simples: 1, padrao: 1, completo: 1},
{ id: 59, name: 'Suporte, ajustes e resolução de problemas/bugs em aplicativos', simples: 1, padrao: 1, completo: 1, father:58},
{ id: 60, name: 'Manutenção em Fluxo de Dados do Power Query', simples: 1, padrao: 1, completo: 1, father:58},
{ id: 61, name: 'Manutenção no Dataverse', simples: 1, padrao: 1, completo: 1, father:58},
{ id: 62, name: 'Criação de novos Fluxos de Dados do Power Query', simples: -1, padrao: 1, completo: 1, father:58},
{ id: 63, name: 'Criação de novos Aplicativos de tela (Canva)', simples: -1, padrao: 1, completo: 1, father:58},
{ id: 64, name: 'Microsoft Power Automate', simples: 1, padrao: 1, completo: 1},
{ id: 65, name: 'Suporte, ajustes e resolução de problemas/bugs em fluxos', simples: 1, padrao: 1, completo: 1, father:64},
{ id: 66, name: 'Criação de RPAs (Power Automate Desktop)', simples: -1, padrao: 1, completo: 1, father:64},
{ id: 67, name: 'Criação de novos fluxos em nuvem', simples: -1, padrao: 1, completo: 1, father:64},
{ id: 68, name: 'Microsoft Power Pages', simples: 1, padrao: 1, completo: 1},
{ id: 69, name: 'Suporte, ajustes e resolução de problemas/bugs em portais', simples: 1, padrao: 1, completo: 1, father:68},
{ id: 70, name: 'Criação de novos portais', simples: -1, padrao: 1, completo: 1, father:68},
{ id: 71, name: 'Microsoft Power Virtual Agents', simples: 1, padrao: 1, completo: 1},
{ id: 72, name: 'Suporte, ajustes e resolução de problemas/bugs em chatbots', simples: 1, padrao: 1, completo: 1, father:71},
{ id: 73, name: 'Criação de novos chatbots', simples: -1, padrao: 1, completo: 1, father:71}
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
                  Contrato Mensal
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
                <p className="mb-2 font-black text-xl title">Suporte</p>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">590</span>
                    <span className="plan_month">/mês</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">472</span>
                    <span className="plan_month">/mês</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? 'A partir de 5h/mês' : 'A partir de 5h/mês'}
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
                <p className="mb-2 font-black text-xl title">Desenvolvimento</p>
                <div className="plan_recommended_tag">RECOMENDADO</div>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">4470</span>
                    <span className="plan_month">/mês</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">3576</span>
                    <span className="plan_month">/mês</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? 'A partir de 30h/mês' : 'A partir de 30h/mês'}
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
                    <span className="plan_price">8690</span>
                    <span className="plan_month">/mês</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">6952</span>
                    <span className="plan_month">/mês</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? 'A partir de 45h/mês' : 'A partir de 45h/mês'}
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

                <div>Para planos personalizados</div>
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
            Soluções para todas as plataformas:
          </p>

          <div className="text-center mt-16">
            <img className="w-3/5 sm:w-4/5 my-0 mx-auto" src="/assets/img/AppsMicrosoft.png" />
          </div>

          <table className="table-auto" style={{ marginTop: '60px' }}>
            <thead>
              <tr>
                <th className="lg:px-4 lg:py-2" />
                <th className="lg:px-4 lg:py-2">Suporte</th>
                <th className="lg:px-4 lg:py-2">Desenvolvimento</th>
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
