import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';

import Card from './Card';
import LineButton from './LineButton';

import DevIcon from '../svg/DevIcon';
import BulbIcon from '../svg/BulbIcon';
import ClassIcon from '../svg/ClassIcon';

const SolucoesSection = () => (
  <section
    id="solucoes"
    className="my-20 py-16 pb-20 lg:mb-40 lg:mt-48"
    style={{ background: 'linear-gradient(29deg, #202A45, #202A45 70%)' }}
  >
    <div className="container mx-auto text-center">
      <h2 className="text-3xl lg:text-5xl  text-white mx-4 md:mx-0">
      End-to-end services to empower your Microsoft environment
      </h2>
      <p className="mt-4 text-white text-xl font-thin mx-4 md:mx-0">
      Adaptable options for teams of any size and level of maturity.
      </p>
      <div className="flex flex-col md:flex-row md:-mx-3 mt-12">
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Projetos.png" className="w-2/6 my-0 mx-auto"/>
            <p className="font-semibold text-xl" style={{ color: '#202A45' }}>Licensing</p>
            <p className="mt-4" style={{ color: '#EBE8E2' }}>
              Adquira licenças da Microsoft com nossos descontos de até 20% diretamente com a nossa empresa, que é revendedora oficial. 
              Faça cotações para serviços como Azure, Dynamics 365, Microsoft 365, Power BI, Exchange, Windows e muito mais. 
            </p>
          </Card>
        </div>
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Consultoria.png" className="w-2/6 my-0 mx-auto"/>
            <p className="font-semibold text-xl" style={{ color: '#202A45' }}>Administration</p>
            <p className="mt-4" style={{ color: '#EBE8E2' }}>
              Contrate especialistas nas ferramentas do Microsoft 365 e Plataforma Power para ficar à disposição da sua empresa através de pacotes mensais de Suporte, 
              Desenvolvimento ou Gerenciamento.
            </p>
          </Card>
        </div>
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Treinamentos.png" className="w-2/6 my-0 mx-auto"/>
            <p className="font-semibold text-xl" style={{ color: '#202A45' }}>Support</p>
            <p className="mt-4" style={{ color: '#EBE8E2' }}>
              Treinamentos corporativos in-company ou online elaborados 
              de forma personalizada para a sua empresa, trazendo aplicações práticas para os setores e 
              qualificando os colaboradores nas principais ferramentas do
              mercado
            </p>
          </Card>
        </div>
      </div>
     
    </div>
  </section>
);

export default SolucoesSection;
