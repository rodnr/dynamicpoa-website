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
      title="Treinamentos | Microsoft 365 e Plataforma Power"
      description="Treinamentos personalizados para sua empresa para qualificar seus colaboradores de forma online ou in-company."
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
    <section className="container mx-auto my-20 py-24 bg-gray-200 rounded-lg text-center">
        <h3 className="text-5xl font-semibold">Quer contratar um treinamento personalizado para a sua empresa?</h3>
        <p className="mx-4 md:mx-auto mt-8 mb-12 text-lg font-light">
          Entre em contato com a nossa equipe para elaborar um conteúdo personalizado e exclusivo.
        </p>
        <p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1,%20gostaria%20de%20contratar%20um%20treinamento"
          >
            <Button size="lg">Entre em contato</Button>
          </a>
        </p>
      </section>
  </Layout>
);

export default AulasPage;
