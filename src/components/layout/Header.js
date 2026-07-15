import { Link } from 'gatsby';
import React from 'react';
import novoDynamicLogo from '../../images/novoLogoDynamic.png';
import { Whatsapp } from '../../svg/SocialIcons';
import Button from '../Button';

const PORTAL_URL = 'https://dynamicpoa.powerappsportals.com/';

// Conversion label obtido em Google Ads > Conversões > Portal Login
const ADS_CONVERSION = 'AW-11059828868/INSERIR_LABEL_AQUI';

const handlePortalLoginClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', { send_to: ADS_CONVERSION });
  }
};

const Header = () => (
  <header className="sticky z-10 top-0 bg-white shadow">
    <div className="container flex flex-col sm:flex-row justify-between items-center mx-auto py-4 px-8">
      <div className="flex items-center text-2xl">
        <div className="w-40 mr-3">
          <Link to="/">
            <img src={novoDynamicLogo} alt="Logo Dynamic" className="w-full h-auto" />
          </Link>
        </div>
      </div>
      <div className="flex mt-4 lg:mr-auto lg:ml-4 sm:mt-0" />
      <Link to="/licenciamento" className="px-4 font-bold mt-3 md:mt-0">
        Licensing
      </Link>
      <Link to="/planos" className="px-4 font-bold mt-3 md:mt-0">
        Hire us
      </Link>
      <Link to="/blog" className="px-4 font-bold mt-3 md:mt-0">
        Blog
      </Link>
      <a
        target="_blank"
        rel="noreferrer"
        href="https://api.whatsapp.com/send?phone=5551996936418&text=Vim%20pelo%20site%20e%20tenho%20d%C3%BAvidas"
        className="px-4 bg-green-500 hover:bg-green-700 text-white hover:text-white mt-3 md:mt-0 lg:mr-6 rounded"
      >
        <Whatsapp />
      </a>
      <div className="hidden md:block">
        <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={handlePortalLoginClick}>
          <Button className="text-sm">Portal Login</Button>
        </a>
      </div>
      <div className="block pt-4 sm:pt-0 md:hidden">
        <a className="px-4" href={PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={handlePortalLoginClick}>
          Portal Login
        </a>
      </div>
    </div>
  </header>
);

export default Header;
