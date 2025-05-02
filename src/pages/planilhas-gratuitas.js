import React from 'react'
import SEO from "../components/seo"

import PlanilhasSection from '../components/PlaninhaSection'
import planilhasData from '../data/planilhas-data'
import Layout from '../components/layout/Layout';

const PlanilhasGratuitasPage = () => (
  <Layout>
    <SEO title="Planilhas Gratuitas" description="Todo mês uma planilha nova 100% gratuita para você aproveitar!"/>
    <div className="mb-16" style={{background: "linear-gradient(29deg, #202A45, #3B5F9E 70%)"}}>
      <h1 className="text-white text-6xl text-center font-bold pt-24">Planilhas Gratuitas Dynamic</h1>
      <p className="text-white text-xl text-center font-light pt-2 pb-24">Feitas especialmente para você, só baixar e sair usando!</p>
    </div>
    {planilhasData.map(data => (
      <PlanilhasSection id={data.id} title={data.title} description={data.description} img={data.img} downloadLink={data.downloadLink} reverseOrder={data.reverseOrder}  />
    ))}
  </Layout>
)

export default PlanilhasGratuitasPage
