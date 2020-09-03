import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SEO from '../components/seo';

import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import DynamicIcon from '../svg/DynamicIcon';
import LottieProgramming from '../components/LottieProgramming';

import ClassesPlatforms from '../components/ClassesPlatforms';
import ClassesBenefits from '../components/ClassesBenefits';

const AulasPage = () => (
  <Layout>
    <SEO
      title="Aulas"
      description="Conheça nossas soluções para você se destacar com as ferramentas Microsoft! Soluções para Excel, PowerPoint, Power BI, entre outras."
    />
    <section className="pt-20" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-left p-4 lg:pr-16 lg:w-1/2">
          <h1 className="hero-title">Aulas particulares</h1>
          <p className="hero-description">
            Aprofunde o seu conhecimentos nas ferramentas da Microsoft.
          </p>
          <AnchorLink className="text-white hover:text-white" href="#platformsSection">
            <Button>Ver preços</Button>
          </AnchorLink>
        </div>
        <div className="m-0 hidden lg:w-2/5 lg:block" style={{ margin: '0 auto' }}>
          <LottieProgramming />
        </div>
      </div>
    </section>
    <ClassesPlatforms />
    <ClassesBenefits />
  </Layout>
);

export default AulasPage;
