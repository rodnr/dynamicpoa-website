import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SEO from '../components/seo';

import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import LottieHero from '../components/LottieHero';
import SplitSection from '../components/SplitSection';

import ClassesPlatforms from '../components/ClassesPlatforms';
import ClassesBenefits from '../components/ClassesBenefits';

const AulasPage = () => (
  <Layout>
    <SEO
      title="Licensing | Microsoft 365, Dynamics and Azure"
      description="Microsoft 365, Azure, Power Platform e Dynamics 365 com até 20% de desconto para sua empresa."
    />
    <section className="pt-20" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-left p-4 lg:pr-16 lg:w-1/2">
          <h1 className="hero-title">Revendedor Oficial Microsoft</h1>
          <p className="hero-description">
            Microsoft 365, Azure, Power Platform e Dynamics 365 com até 20% de desconto para sua empresa.
          </p>
          <AnchorLink className="text-white hover:text-white" href="https://forms.office.com/r/UczRxsHeLy">
            <Button>Solicite uma cotação</Button>
          </AnchorLink>
        </div>
        <div className="m-0 hidden lg:w-3/5 lg:block">
<div className="m-0 hidden lg:flex lg:w-3/5 lg:justify-center">
<img
  src="/assets/img/platforms/Excel.png"
  alt="Excel"
  className="w-[800px] ml-32"
/>
</div>


        </div>
      </div>
    </section>
    <hr className="my-16 border-gray-300" />
    <ClassesBenefits />
    <section className="container mx-auto my-20 py-24 bg-gray-200 rounded-lg text-center">
        <h3 className="text-5xl font-semibold">Quer solicitar uma cotação de licenciamento para a sua empresa?</h3>
        <p className="mx-4 md:mx-auto mt-8 mb-12 text-lg font-light">
          Entre em contato com a nossa equipe.
        </p>
        <p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1,%20gostaria%20de%20contratar%20uma%20licença"
          >
            <Button size="lg">Entre em contato</Button>
          </a>
        </p>
      </section>
  </Layout>
);

export default AulasPage;
