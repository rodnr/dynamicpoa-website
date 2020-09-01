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
    style={{ background: 'linear-gradient(29deg, #5B87B5, #3B5F9E 70%)' }}
  >
    <div className="container mx-auto text-center">
      <h2 className="text-3xl lg:text-5xl  text-white mx-4 md:mx-0">
        Veja como podemos ajudar a sua empresa
      </h2>
      <p className="mt-4 text-white text-xl font-thin mx-4 md:mx-0">
        Implemente, treine, desenvolva ou receba suporte nas ferramentas da Microsoft
      </p>
      <div className="flex flex-col md:flex-row md:-mx-3 mt-12">
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Projetos.png" />
            <p className="font-semibold text-xl">Projeto</p>
            <p className="mt-4" style={{ color: '#909090' }}>
              Desenvolva projetos personalizados para sua empresa. Planilhas automatizadas com VBA,
              dashboards, aplicativos empresariais, formulários, processos automatizados e muito
              mais com as ferramentas mais integradas no mercado.
            </p>
          </Card>
        </div>
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Consultoria.png" />
            <p className="font-semibold text-xl">Consultoria</p>
            <p className="mt-4" style={{ color: '#909090' }}>
              Uma das melhores opções para quem usa diariamente as ferramentas da Microsoft,
              permitindo contratar suporte e desenvolvimento remoto de um especialista.
            </p>
          </Card>
        </div>
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Treinamentos.png" />
            <p className="font-semibold text-xl">Treinamento</p>
            <p className="mt-4" style={{ color: '#909090' }}>
              Treinamentos in-company para qualificar a sua equipe nas principais ferramentas do
              mercado, aumentar a produtividade e abrir portas para novas possibilidades.
            </p>
          </Card>
        </div>
      </div>
      <AnchorLink href="#ferramentas">
        <LineButton className="mt-12 flex mx-auto">Plataformas</LineButton>
      </AnchorLink>
    </div>
  </section>
);

export default SolucoesSection;
