import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SEO from '../components/seo';

import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import LottieHero from '../components/LottieHero';

import ClassesPlatforms from '../components/ClassesPlatforms';
import ClassesBenefits from '../components/ClassesBenefits';

const AulasPage = () => (
  <Layout>
    <SEO
      title="Treinamentos"
      description="Conheça nossas soluções para você qualificar a sua empresa com as ferramentas Microsoft! Treinamentos de Excel, Power Apps, Power BI, entre outros."
    />
    <section className="pt-20" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-left p-4 lg:pr-16 lg:w-1/2">
          <h1 className="hero-title">Treinamentos e Workshops para você ou sua empresa</h1>
          <p className="hero-description">
            Oferecemos treinamentos personalizados para sua empresa ou workshops mensais para capacitação em Microsoft 365 e Plataforma Power.
          </p>
          <AnchorLink className="text-white hover:text-white" href="#platformsSection">
            <Button>Conheça</Button>
          </AnchorLink>
        </div>
        <div className="m-0 hidden lg:w-3/5 lg:block">
          <LottieHero />
        </div>
      </div>
    </section>
    <ClassesPlatforms />
    <ClassesBenefits />
  </Layout>
);

export default AulasPage;
