import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SEO from '../components/seo';

import Button from '../components/Button';
import CustomerCard from '../components/CustomerCard';
import LabelText from '../components/LabelText';
import Layout from '../components/layout/Layout';
import SplitSection from '../components/SplitSection';
import LogoSection from '../components/LogoSection';
import customerData from '../data/customer-data';
import LottieHero from '../components/LottieHero';
import DynamicIcon from '../svg/DynamicIcon';
import { Excel, PowerBI } from '../svg/SvgSheets';

import SolucoesSection from '../components/SolucoesSection';
import Caroussel from '../components/Caroussel';

export default () => (
  <Layout>
    <SEO
      title="Home"
      description="Desenvolvimento, Consultoria e Treinamento nas ferramentas da Microsoft. Conheça nossas soluções!"
    />
    <section className="pt-20" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-left p-4 lg:pr-16 lg:w-1/2">
          <h1 className="hero-title">Soluções Microsoft para empresas</h1>
          <p className="hero-description">
            Descubra como podemos ajudar você a aumentar a produtividade e colaboração da sua equipe
            usando apenas as ferramentas que sua empresa já possui.
          </p>

          <AnchorLink className="text-white hover:text-white" href="#solucoes">
            <Button>Conheça as soluções</Button>
          </AnchorLink>
        </div>
        <div className="m-0 hidden lg:w-3/5 lg:block">
          <LottieHero />
        </div>
      </div>
    </section>
    <SolucoesSection />
    <SplitSection
      id="ferramentas"
      primarySlot={
        <div className="lg:pr-32 xl:pr-48 border-l-2 pl-8 border-primary">
          <h3 className="text-3xl font-light leading-tight mb-6">MICROSOFT 365</h3>
          <p className="text-gray-700 mb-4">
            Revolucione a forma como você usa planilhas, apresentações, formulários, e-mails, dashboards e muito mais. Tenha a sua equipe completamente
            integrada, colaborativa e compartilhando dados em tempo real.
          </p>
        </div>
      }
      secondarySlot={<img src="/assets/img/platforms/Excel.png" alt="Excel" />}
      classMargin="ml-auto"
    />
    <SplitSection
      reverseOrder
      primarySlot={
        <div className="lg:pl-32 xl:pl-48 border-r-2 pr-8 border-primary text-right ">
          <h3 className="text-3xl font-light leading-tight mb-6 ">PLATAFORMA POWER</h3>
          <p className="text-gray-700 mb-4">
            Implemente as ferramentas mais novas <br /> e modernas da Microsoft. Faça a gestão da
            sua <br /> empresa utilizando o Power BI, aplicativos <br /> ou automatize fluxos
            entre APIs.
          </p>
        </div>
      }
      secondarySlot={<img src="/assets/img/platforms/PowerBI.png" alt="Power BI" />}
      classMargin="mr-auto"
    />
    <LabelText className="mb-8 mt-24 text-gray-600 text-center">Clientes</LabelText>
    <Caroussel />
    <section id="depoimentos" className="py-10 lg:py-40">
      <div className="container mx-auto">
        <LabelText className="mb-8 text-gray-<600 text-center">
          O que dizem nossos clientes
        </LabelText>
        <div className="flex flex-col md:flex-row md:-mx-3">
          {customerData.map(customer => (
            <div key={customer.customerName} className="flex-1 px-3">
              <CustomerCard customer={customer} />
            </div>
          ))}
        </div>
        <a target="_blank" rel="noreferrer" href="https://bit.ly/2U2Kerl">
          <Button className="flex mx-auto mt-8">Veja mais</Button>
        </a>
      </div>
    </section>
    <section className="container mx-auto my-20 py-24 bg-gray-200 rounded-lg text-center">
      <h3 className="text-5xl font-semibold">Ficou com alguma dúvida?</h3>
      <p className="mx-4 md:mx-auto mt-8 mb-12 text-lg font-light">
        Estamos à sua disposição! Vamos encontrar a solução ideal para você ou sua empresa.
      </p>
      <p>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1!%20Voc%C3%AA%20pode%20me%20ajudar?"
        >
          <Button size="lg">Fale com a gente</Button>
        </a>
      </p>
    </section>

    <script
      type="text/javascript"
      id="hs-script-loader"
      async
      defer
      src="//js.hs-scripts.com/8385989.js"
    ></script>
  </Layout>
);
