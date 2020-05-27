import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SEO from '../components/seo';

import Layout from '../components/layout/Layout';
import Button from '../components/Button';
import LineButton from '../components/LineButton';
import DynamicIcon from '../svg/DynamicIcon';
import LottieProgramming from '../components/LottieProgramming';

import ClassesPlatforms from '../components/ClassesPlatforms';
import ClassesBenefits from '../components/ClassesBenefits';

const CursosPage = () => (
  <Layout>
    <SEO
      title="Cursos"
      description="Conheça nossas soluções para você se destacar com as ferramentas Microsoft! Soluções para Excel, PowerPoint, Power BI, entre outras."
    />
    <section className="pt-20 mb-32" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-center lg:w-1/2">
          <div className="w-1/5 mb-8 mx-auto">
            <DynamicIcon />
          </div>
          <p className="text-xl lg:text-2xl mt-6 font-light">
            Aulas particulares online para aprofundar os conhecimentos nas ferramentas da Microsoft.
          </p>
          <p className="mt-8 md:mt-12">
            <AnchorLink className="text-white hover:text-white" href="#platformsSection">
              <Button>Ver preços</Button>
            </AnchorLink>
          </p>
        </div>
        <div className="m-0 hidden lg:w-1/2 lg:block">
          <LottieProgramming />
        </div>
      </div>
    </section>
    <ClassesPlatforms />
    <ClassesBenefits />
  </Layout>
);

export default CursosPage;
