import { Link } from 'gatsby';
import React from 'react';
import DynamicLogo from '../../svg/DynamicLogo';
import { Whatsapp } from '../../svg/SocialIcons';
import Button from '../Button';

const Header = () => (
  <header className="sticky z-10 top-0 bg-white shadow">
    <div className="container flex flex-col sm:flex-row justify-between items-center mx-auto py-4 px-8">
      <div className="flex items-center text-2xl">
        <div className="w-40 mr-3">
          <Link to="/">
            <DynamicLogo />
          </Link>
        </div>
      </div>
      <div className="flex mt-4 lg:mr-auto lg:ml-4 sm:mt-0">
        {/* <Link className="px-4 bg-primary text-white" to="/" activeClassName="bg-primary text-white">
          Para Empresas
        </Link> */}
      </div>
      <Link to="/treinamentos" className="px-4 font-bold mt-3 md:mt-0">
        Treinamentos
      </Link>
      <Link to="/planos" className="px-4 font-bold mt-3 md:mt-0">
        Planos
      </Link>
      <Link to="/planilhas-gratuitas" className="px-4 font-bold mt-3 md:mt-0">
        Planilhas Gratuitas
      </Link>
      <Link to="/blog" className="px-4 font-bold mt-3 md:mt-0">
        Blog
      </Link>
    
      <a
        target="_blank"
        rel="noreferrer"
        href="https://api.whatsapp.com/send?phone=5551996936418"
        className="px-4 bg-green-500 hover:bg-green-700 text-white hover:text-white mt-3 md:mt-0 lg:mr-6 rounded"
      >
        <Whatsapp />
      </a>
      <div className="hidden md:block">
  <a href="https://bit.ly/site-cotar-licencas-microsoft-dynamic" target="_blank" rel="noopener noreferrer">
    <Button className="text-sm">Cotar Licenças Microsoft</Button>
  </a>
</div>
<div className="block pt-4 sm:pt-0 md:hidden">
  <a className="px-4" href="https://bit.ly/site-cotar-licencas-microsoft-dynamic" target="_blank" rel="noopener noreferrer">
  Cotar Licenças Microsoft
  </a>
</div>
    </div>
  </header>
);

export default Header;
