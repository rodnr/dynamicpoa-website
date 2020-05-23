import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SEO from '../components/seo';

import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import LineButton from '../components/LineButton';
import DynamicIcon from '../svg/DynamicIcon';
import LottieProgramming from '../components/LottieProgramming';

import ClassesBenefits from '../components/ClassesBenefits';

const CursosPage = () => (
  <Layout>
    <SEO
      title="Cursos"
      description="Conheça nossas soluções para você se destacar com as ferramentas Microsoft! Soluções para Excel, PowerPoint, Power BI, entre outras."
    />
    <section className="pt-20" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-center lg:w-1/2">
          <div className="w-1/5 mb-8 mx-auto">
            <DynamicIcon />
          </div>
          <p className="text-xl lg:text-2xl mt-6 font-light">
            Aulas particulares online para aprofundar os conhecimentos nas ferramentas da Microsoft.
          </p>
          <p className="mt-8 md:mt-12">
            <Button>
              <AnchorLink className="text-white hover:text-white" href="#planos">
                Ver preços
              </AnchorLink>
            </Button>
          </p>
        </div>
        <div className="m-0 hidden lg:w-1/2 lg:block">
          <LottieProgramming />
        </div>
      </div>
    </section>
    <section
      id="planos"
      className="my-20 py-16 pb-20 lg:mb-40 lg:mt-48"
      style={{ background: 'linear-gradient(29deg, #5B87B5, #3B5F9E 70%)' }}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-3xl lg:text-5xl  text-white mx-4 md:mx-0">
          Entre em contato e receba um orçamento personalizado!
        </h2>
        <p className="mt-4 text-white text-xl font-thin mx-4 md:mx-0">
          Clique no botão abaixo para falar com a gente pelo Whatsapp.
        </p>
        <a
          target="_blank"
          href="https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1!%20Voc%C3%AA%20pode%20me%20ajudar?"
        >
          <LineButton className="mt-8">Clique aqui</LineButton>
        </a>
      </div>
    </section>
    <ClassesBenefits />
  </Layout>
);

export default CursosPage;
