import React from 'react';
import { Link } from 'gatsby';
import Button from '../Button';
import DynamicLogo from '../../svg/DynamicLogo';
import { Whatsapp } from '../../svg/SocialIcons';

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
        <Link className="px-4" to="/" activeClassName="bg-primary text-white">
          Para Empresas
        </Link>
        <Link className="px-4" to="/aulas" activeClassName="bg-primary text-white">
          Para Você
        </Link>
      </div>
      <Link to="/precos" className="px-4 font-bold mt-3 md:mt-0 lg:mr-4">
        Preços
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
        <Link to="/planilhas-gratuitas">
          <Button className="text-sm">Planilhas Gratuitas</Button>
        </Link>
      </div>
      <div className="block pt-4 sm:pt-0 md:hidden">
        <Link className="px-4" to="/planilhas-gratuitas">
          Planilhas Gratuitas
        </Link>
      </div>
    </div>
  </header>
);

export default Header;
