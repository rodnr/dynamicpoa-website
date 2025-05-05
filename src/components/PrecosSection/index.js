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
{ id: 1, name: '24/7 Power Platform and Microsoft 365 support AI agent trained with our own knowledge database', simples: 1, padrao: 1, completo: 1, father: -1},
{ id: 2, name: 'Open support tickets for remote access with human especialists*', simples: '*paid by hour', padrao: 'free', completo: 'free', father: -1},
{ id: 3, name: 'Users and licensing management', simples: '-', padrao: 1, completo: 1, father: -1},
{ id: 4, name: 'Microsoft 365 cybersecurity and DLP policies management', simples: '-', padrao: 1, completo: 1, father: -1},
{ id: 5, name: 'Open Power Platform & Dynamics 365 development tickets*', simples: '*paid by hour', padrao: '*paid by hour', completo: 'free', father: -1},
{ id: 6, name: 'Custom Power Automate flow error-detector control panel', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 7, name: 'Custom Power Apps access logs control panel', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 8, name: 'Custom Power BI refresh errors control panel', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 9, name: 'Techical documentation and architecture for Power Platform Solutions', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 10, name: 'Power Platform Environment implementation and management', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 11, name: 'Application Lifecycle Management (ALM)', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 12, name: 'Custom Power Platform qualification programs for employees', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 12, name: 'Azure DevOps Pipelines implementation for deployment proccess', simples: '-', padrao: '-', completo: 1, father: -1},
{ id: 14, name: 'Automated Power Platform development with AI agent', simples: '-', padrao: '-', completo: 'coming soon', father: -1}
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
            background: 'linear-gradient(to bottom, #3B5F9E 0%,  #202A45 70%, #fff 70%, #fff 100%)'
          }}
        >
          <h2 className="text-white text-4xl lg:text-6xl text-center font-bold pt-24 mx-4 md:mx-0">
            Support Plans pricing
          </h2>

          <p className="mb-5 text-white text-xl font-thin mx-4 md:mx-0">
            {' '}
            Custom plans for managing your Microsoft 365 environment{' '}
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
                  Small business
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
                  Large business
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
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20suporte"
              >
                <p className="mb-2 font-black text-xl title">Basic Support</p>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">89</span>
                    <span className="plan_month">/user</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">69</span>
                    <span className="plan_month">/user</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? 'per month' : 'per month'}
                  <a
                    target="_blank"
                    href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20suporte"
                  ></a>
                </p>
                <span className="hire_button">Contact us</span>
              </S.Plan>
            </div>
            <div className="lg:px-3 lg:m-6 md:m-2 mb-6">
              <S.Plan
                className="standard"
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20consultoria"
              >
                <p className="mb-2 font-black text-xl title">Standard Support</p>
                <div className="plan_recommended_tag">RECOMMENDED</div>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">329</span>
                    <span className="plan_month">/user</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">269</span>
                    <span className="plan_month">/user</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? 'per month' : 'per month'}
                </p>
                <span className="hire_button">Contact us</span>
              </S.Plan>
            </div>
            <div className="lg:px-3 lg:m-6 md:m-2 mb-6">
              <S.Plan
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20de%20gerenciamento"
              >
                <p className="mb-2 font-black text-xl title">Administration</p>
                {tipoPlano == 'Mensal' ? (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">Consulte</span>
                    <span className="plan_month">/user</span>
                  </div>
                ) : (
                  <div className="plan_price_wrapper">
                    <span className="plan_currency">R$</span>
                    <span className="plan_price">Consulte</span>
                    <span className="plan_month">/user</span>
                  </div>
                )}
                <p className="plan_hours">
                  <FaRegClock />
                  {tipoPlano == 'Mensal' ? 'per month' : 'per month'}
                </p>
                <span className="hire_button">Contratar</span>
              </S.Plan>
            </div>
            <div className="lg:px-3 lg:m-6 md:m-2 mb-6">
              <S.Plan
                className="personalized"
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20plano%20personalizado"
              >
                <p className="mb-2 font-black text-xl title">Custom</p>

                <div>For more options</div>
                <span className="hire_button">Contact us</span>
              </S.Plan>
            </div>
          </div>
        </div>

        <div className="table-planos">
          <h2 className="text-black text-4xl lg:text-6xl text-center font-bold mb-4 md:mx-0">
            What is included in each plan?
          </h2>

          <p className="mt-4 text-black text-xl font-thin mx-4 md:mx-0 text-center">
            Technical support for all Microsoft business apps
          </p>

          <div className="text-center mt-16">
            <img className="w-3/5 sm:w-4/5 my-0 mx-auto" src="/assets/img/AppsMicrosoft.png" />
          </div>

          <table className="table-auto" style={{ marginTop: '60px' }}>
            <thead>
              <tr>
                <th className="lg:px-4 lg:py-2" />
                <th className="lg:px-4 lg:py-2">Basic Support</th>
                <th className="lg:px-4 lg:py-2">Standard Support</th>
                <th className="lg:px-4 lg:py-2">Administration</th>
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
