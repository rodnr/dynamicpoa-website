import React, { useState } from 'react'
import checkImage from '../images/check.svg';
import seta from '../images/seta.svg';
import icon from '../images/icon.png';
import Plan from './Plan';
import '../css/app.css';

import Button from './Button';

const PlanosSection = () => {
  const [tipoPlano, setTipoPlano] = useState('Anual');
  const [dataTable] = useState(
    [
      { id: 1, name: 'Descontos em projetos e treinamentos', simples: '5%', padrao: '10%', completo: '20%', father: -1},
      { id: 2, name: 'Horas disponíveis/mês', simples: '5h', padrao: '15h', completo: '30h', father: -1 },
      { id: 3, name: 'Tamanho máximo da equipe', simples: '2', padrao: '5', completo: '15', father: -1 },
      { id: 4, name: 'Dicas, sugestões e resolução de dúvidas em geral (licenciamento, segurança, etc.)', simples: 1, padrao: 1, completo: 1, father: -1 },
      { id: 5, name: 'Análise de possibilidades de automação e melhorias', simples: 1, padrao: 1, completo: 1, father: -1 },
      { id: 6, name: 'Criação/edição de códigos em VBA (macros)', simples: '-', padrao: 1, completo: 1, father: -1 },
      { id: 7, name: 'Criação/padronização de layouts de acordo com a identidade visual', simples: '-', padrao: 1, completo: 1, father: -1 },
      { id: 8, name: 'Suporte em Microsoft Excel', simples: 1, padrao: 1, completo: 1, father: 0 },
      { id: 9, name: 'Criação de planilhas', simples: 1, padrao: 1, completo: 1, father: 8 },
      { id: 10, name: 'Edição de planilhas (fórmulas, layout, correções, configurações, etc.)', simples: 1, padrao: 1, completo: 1, father: 8 },
      { id: 11, name: 'Criação de gráficos e dashboards', simples: 1, padrao: 1, completo: 1, father: 8 },
      { id: 12, name: 'Correção de erros e falhas', simples: 1, padrao: 1, completo: 1, father: 8 },
      { id: 13, name: 'Digitação', simples: 1, padrao: 1, completo: 1, father: 8 },
      { id: 14, name: 'Extração de dados, análises, padronização, etc.', simples: '-', padrao: 1, completo: 1, father: 8 },
      { id: 15, name: 'Conexão com dados externos e tratamento de fontes de dados', simples: '-', padrao: 1, completo: 1, father: 8 },
      { id: 16, name: 'Suporte em Microsoft PowerPoint', simples: 1, padrao: 1, completo: 1, father: 0 },
      { id: 17, name: 'Criação de apresentações', simples: 1, padrao: 1, completo: 1, father: 16 },
      { id: 18, name: 'Edição de apresentações (animações, layout, design, configurações, etc.)', simples: 1, padrao: 1, completo: 1, father: 16 },
      { id: 19, name: 'Criação de gráficos', simples: 1, padrao: 1, completo: 1, father: 16 },
      { id: 20, name: 'Revisão de apresentações', simples: 1, padrao: 1, completo: 1, father: 16 },
      { id: 21, name: 'Suporte em Microsoft Word', simples: 1, padrao: 1, completo: 1, father: 0 },
      { id: 22, name: 'Criação de documentos', simples: 1, padrao: 1, completo: 1, father: 21 },
      { id: 23, name: 'Edição de documentos (formatação, design, configurações, etc.)', simples: 1, padrao: 1, completo: 1, father: 21 },
      { id: 24, name: 'Criação de gráficos', simples: 1, padrao: 1, completo: 1, father: 21 },
      { id: 25, name: 'Digitação', simples: 1, padrao: 1, completo: 1, father: 21}
    ]
  );
  
  let [ sonActives, setSonActives ] = useState([]);
  
  function handleClick(e,pai) {
    e.preventDefault();
    let index = sonActives.indexOf(pai);
    if(index > -1){  
      let newSonActives = sonActives.filter(function(value, index, arr){ return value != pai;})        
      setSonActives([...newSonActives]);
    }else{
      setSonActives([...sonActives, pai])
    }
  }

  return(
      <section id="planos" className="my-0 pb-0 ">
        <div className="px-16  mx-auto text-center" style={{background: "linear-gradient(to bottom, #3B5F9E 0%,  #5B87B5 70%, #fff 70%, #fff 100%)"}}>
          <h2 className="text-white text-4xl lg:text-6xl text-center font-bold pt-24 mx-4 md:mx-0">Planos de Consultoria</h2>

          <p className="mb-5 text-white text-xl font-thin mx-4 md:mx-0"> Contrate um especialista no Microsoft 365 </p>

          <div className="stv-radio-buttons-wrapper div-payment-types pb-4">
            <ul className="payment-types">
              <li className="payment-type">
                <input name="radioButtonTest" checked={tipoPlano === 'Mensal'} value="Mensal" onClick={() => setTipoPlano('Mensal')} type="radio" id="pay-m" className="stv-radio-button"></input>
                <label for="pay-m" className="p-1">Pagamento Mensal</label>
              </li>
              <li className="payment-type">
                <input name="radioButtonTest" checked={tipoPlano === 'Anual'} value="Anual" onClick={() => setTipoPlano('Anual')} type="radio" id="pay-y" className="stv-radio-button"></input>
                <label for="pay-y" className="p-1">Pagamento Trimestral</label>
              </li>
            </ul>
          </div>

          <div style={{color: '#595959'}} className="flex flex-col md:flex-row md:-mx-3 mt-12">
            <div className="flex-1 lg:px-3 lg:m-6 md:m-2 mb-6">
              <Plan className="py-6 h-full">
                <p className=" mb-2 font-black text-xl">Simples</p>       
                <hr className="mb-1" style={{marginTop : '5px', marginLeft : '10px', marginRight : '10px',border: '0.3px solid'}} />         
                {(tipoPlano == 'Mensal') 
                    ? <div>R$<div className="font-hairline text-5xl" style={{display: 'inline-block'}}>86</div><div className="font-hairline text-xl"style={{display: 'inline-block'}}>/h</div></div>
                    : <div>R$<div className="font-hairline text-5xl" style={{display: 'inline-block'}}>69</div><div className="font-hairline text-xl"style={{display: 'inline-block'}}>/h</div></div>
                  }
                <p className="mt-4 mb-2 font-hairline">{(tipoPlano == 'Mensal') ? '5h/mês - até 2 pessoas' : '5h/mês - até 2 pessoas'}</p>
                <img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100px'}} src={icon} alt="Logo"/>              
              </Plan>
            </div>
            <div className="flex-1 lg:px-3 lg:m-6 md:m-2 mb-6">
            <Plan className="py-6 h-full">
                <p className="mb-1 font-black text-xl">Padrão</p>
                <hr className="mb-1" style={{marginTop : '5px', marginLeft : '10px', marginRight : '10px',border: '0.3px solid'}} />         
                {(tipoPlano == 'Mensal') 
                    ? <div>R$<div className="font-hairline text-5xl" style={{display: 'inline-block'}}>73</div><div className="font-hairline text-xl"style={{display: 'inline-block'}}>/h</div></div>
                    : <div>R$<div className="font-hairline text-5xl" style={{display: 'inline-block'}}>58</div><div className="font-hairline text-xl"style={{display: 'inline-block'}}>/h</div></div>
                  }
                <p className="mt-4 mb-2 font-hairline">{(tipoPlano == 'Mensal') ? '15h/mês - até 5 pessoas' : '15h/mês - até 5 pessoas'}</p>
                <img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100px'}} src={icon} alt="Logo"/>  
              </Plan>
            </div>
            <div className="flex-1 lg:px-3 lg:m-6 md:m-2 mb-6">        
              <Plan className="py-6 h-full">
                <p className="mb-2 font-black text-xl">Completo</p>
                <hr className="mb-1" style={{marginTop : '5px', marginLeft : '10px', marginRight : '10px',border: '0.3px solid'}} />        
                {(tipoPlano == 'Mensal') 
                    ? <div>R$<div className="font-hairline text-5xl" style={{display: 'inline-block'}}>59</div><div className="font-hairline text-xl"style={{display: 'inline-block'}}>/h</div></div>
                    : <div>R$<div className="font-hairline text-5xl" style={{display: 'inline-block'}}>46</div><div className="font-hairline text-xl"style={{display: 'inline-block'}}>/h</div></div>
                  }
                <p className="mt-4 mb-2 font-hairline">{(tipoPlano == 'Mensal') ? '30h/mês - até 15 pessoas' : '30h/mês - até 15 pessoas'}</p>
                <img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100px'}} src={icon} alt="Logo"/>  
              </Plan>
            </div>
            <div className="flex-1 lg:px-3 lg:m-6 md:m-2 mb-6">
              <Plan className="py-6 h-full">
                <p className="font-black text-xl">Personalizado</p>
                <a target="_blank" href="https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1!%20Voc%C3%AA%20pode%20me%20ajudar?">
                  <Button marginTop="20">Entrar em contato</Button>
                </a>
                <p className="p-6 font-hairline">
                para equipes maiores ou planos com mais disponibilidade mensal
                </p>
              </Plan>
            </div>
          </div>
        </div>

        <div className="table-planos">

          <h2 className="text-black text-4xl lg:text-6xl text-center font-bold mx-4 md:mx-0">Compare os planos</h2>

          <p className="mt-4 text-black text-xl font-thin mx-4 md:mx-0 text-center">Entenda como vamos ajudar sua empresa a aumentar a produtividade</p>

          <table className="table-auto" style={{marginTop:'60px'}}>
            <thead>
              <tr>
                <th className="lg:px-4 lg:py-2"></th>
                <th className="lg:px-4 lg:py-2">Simples</th>
                <th className="lg:px-4 lg:py-2">Padrão</th>
                <th className="lg:px-4 lg:py-2">Completo</th>
              </tr>
            </thead>
            <tbody>
              <tr className='bg-gray-100'>

                <td colspan="4" className="border px-4 lg:py-2">Atrair</td>
=======
                <td colspan="4" className="border px-4 py-2">O que está incluso</td>
              </tr>
              {
                dataTable.map((data,index) => {
                  return(
                    <>
                    {
                      (data.father > 0)?
                        (sonActives.indexOf(data.father) > -1) &&
                          <tr  data-father={data.father}>
                            <td className={(data.father < 1)?'border lg:px-4 lg:py-2':'border lg:px-12 lg:py-2'}>
                            {data.name}
                            </td>
                            <td className="border lg:px-4 lg:py-2" >{(data.simples === 1)?<img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}} src={checkImage} alt='Logo'/>:<label style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}}>{data.simples}</label>}</td>
                            <td className="border lg:px-4 lg:py-2" >{(data.padrao === 1)?<img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}} src={checkImage} alt='Logo'/>:<label style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}}>{data.padrao}</label>}</td>
                            <td className="border lg:px-4 lg:py-2" >{(data.completo === 1)?<img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}} src={checkImage} alt='Logo'/>:<label style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}}>{data.completo}</label>}</td>
                        </tr>
                      :
                        <tr  data-father={data.father}>
                            <td className={(data.father < 1)?'border lg:px-4 lg:py-2':'border lg:px-12 lg:py-2'}>
                              {
                                (data.father == 0)?
                                  <button onClick={((e) => handleClick(e,data.id))} >
                                      <img data-id={data.id} style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}} src={seta} alt='Logo'/>
                                  </button>
                                :''
                              }
      
                            {data.name}
                            </td>
                            <td className="border lg:px-4 lg:py-2" >{(data.simples === 1)?<img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}} src={checkImage} alt='Logo'/>:<label style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}}>{data.simples}</label>}</td>
                            <td className="border lg:px-4 lg:py-2" >{(data.padrao === 1)?<img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}} src={checkImage} alt='Logo'/>:<label style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}}>{data.padrao}</label>}</td>
                            <td className="border lg:px-4 lg:py-2" >{(data.completo === 1)?<img style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}} src={checkImage} alt='Logo'/>:<label style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '10px'}}>{data.completo}</label>}</td>
                        </tr>
                }
                  </>
                  )
                })
              }
            </tbody>
          </table>          
        </div>
      </section>
  );
}

export default PlanosSection
