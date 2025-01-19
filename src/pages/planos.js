import React from 'react';
import SEO from '../components/seo';

import Layout from '../components/layout/Layout';
import PrecosSection from '../components/PrecosSection';

const PrecosPage = () => (
  <Layout>
    <SEO
      title="Planos | Consultoria, Suporte e Desenvolvimento em Microsoft 365 e Plataforma Power"
      description="Contrate um pacote de horas com especialistas em Power Apps, Power Automate, Power BI, entre outras."
    />
    <PrecosSection />
  </Layout>
);

export default PrecosPage;
