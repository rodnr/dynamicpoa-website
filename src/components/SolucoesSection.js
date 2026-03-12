import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';

import Card from './Card';
import LineButton from './LineButton';

import DevIcon from '../svg/DevIcon';
import BulbIcon from '../svg/BulbIcon';
import ClassIcon from '../svg/ClassIcon';

const SolucoesSection = () => (
  <section
    id="solucoes"
    className="my-20 py-16 pb-20 lg:mb-40 lg:mt-48"
    style={{ background: 'linear-gradient(29deg, #202A45, #202A45 70%)' }}
  >
    <div className="container mx-auto text-center">
      <h2 className="text-3xl lg:text-5xl  text-white mx-4 md:mx-0">
      End-to-end services to empower your environment
      </h2>
      <p className="mt-4 text-white text-xl font-thin mx-4 md:mx-0">
      Adaptable options for teams of any size and level of maturity
      </p>
      <div className="flex flex-col md:flex-row md:-mx-3 mt-12">
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Projetos.png" className="w-2/6 my-0 mx-auto"/>
            <p className="font-semibold text-xl" style={{ color: '#202A45' }}>Licensing</p>
            <p className="mt-4" style={{ color: '#2e2e2e' }}>
              Hire over 4,000 different Microsoft product licenses like Azure, Dynamics 365, Microsoft 365, Power BI, Power Pages, Power Apps, Exchange, Windows and many more, with up to 25% discount. 
            </p>
          </Card>
        </div>
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Consultoria.png" className="w-2/6 my-0 mx-auto"/>
            <p className="font-semibold text-xl" style={{ color: '#202A45' }}>Administration</p>
            <p className="mt-4" style={{ color: '#2e2e2e' }}>
             Hire our specialists to implement and manage your Microsoft tenant and Power Platform environments, with deployment pipelines, Application Lifecycle Management, CI/CD and 
               many other high-level custom-made management solutions
            </p>
          </Card>
        </div>
        <div className="flex-1 px-3 m-6 md:m-2">
          <Card className="p-12 h-full">
            <img src="/assets/img/solutions/Treinamentos.png" className="w-2/6 my-0 mx-auto"/>
            <p className="font-semibold text-xl" style={{ color: '#202A45' }}>Consulting</p>
            <p className="mt-4" style={{ color: '#2e2e2e' }}>
              In our consulting plans, we map your company's business process to create Power Platform architecture and develop solutions to automate 
                and digitalize workflows accross your departments, providing training and support for users.
            </p>
          </Card>
        </div>
      </div>
     
    </div>
  </section>
);

export default SolucoesSection;
