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
import LottieWork from '../components/LottieWork';
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
        <div className="text-center lg:w-1/2">
          <div className="w-1/5 mb-8 mx-auto">
            <DynamicIcon className="" />
          </div>
          <p className="text-xl lg:text-2xl mt-6 font-light">
            Consultoria em Microsoft 365 e Plataforma Power. Conheça nossas soluções em Excel, Power
            BI e muito mais.
          </p>
          <p className="mt-8 md:mt-12">
            <Button>
              <AnchorLink className="text-white hover:text-white" href="#solucoes">
                Conheça as soluções
              </AnchorLink>
            </Button>
          </p>
        </div>
        <div className="m-0 hidden lg:w-1/2 lg:block">
          <LottieWork />
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
            Planilhas, apresentações, dashboards, fórmularios, etc. Substitua as tarefas repetitivas
            e manuais na sua empresa por processos automatizados.
          </p>
          <img src="/assets/img/Logo365.png" alt="Microsoft Icons" style={{ width: '85%' }} />
        </div>
      }
      secondarySlot={<Excel />}
      classMargin="ml-auto"
    />
    <SplitSection
      reverseOrder
      primarySlot={
        <div className="lg:pl-32 xl:pl-48 border-r-2 pr-8 border-primary text-right ">
          <h3 className="text-3xl font-light leading-tight mb-6 ">PLATAFORMA POWER</h3>
          <p className="text-gray-700 mb-4">
            Implemente as ferramentas mais novas <br /> e modernas da Microsoft. Faça a gestão da
            sua <br /> empresa utilizando o Power BI, aplicativos <br /> ou fluxos automatizados
            entre APIs.
          </p>
          <img
            src="/assets/img/LogoPlataformaPower.png"
            alt="Power Icons"
            style={{ width: '85%', marginLeft: 'auto' }}
          />
        </div>
      }
      secondarySlot={<PowerBI />}
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

    <script src="//code.jivosite.com/widget/xfReppaGI7" async></script>
  </Layout>
);
