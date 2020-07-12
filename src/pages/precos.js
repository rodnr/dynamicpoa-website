import React from 'react';
import SEO from '../components/seo';

import Layout from '../components/layout/Layout';
import PrecosSection from '../components/PrecosSection';

const PrecosPage = () => (
  <Layout>
    <SEO
      title="Precos"
      description="Conheça nossas soluções para você se destacar com as ferramentas Microsoft! Soluções para Excel, PowerPoint, Power BI, entre outras."
    />
    <PrecosSection />
  </Layout>
);

export default PrecosPage;
