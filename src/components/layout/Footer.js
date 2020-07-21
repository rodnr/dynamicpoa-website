import React from 'react';
import { Link } from 'gatsby';

import { LinkedIn, Instagram } from '../../svg/SocialIcons';

const Footer = () => (
  <footer className="container mx-auto py-16 px-3 mt-16 lg:mt-48 mb-8 text-gray-800">
    <div className="flex -mx-3 content-center text-center lg:text-left flex-col lg:flex-row">
      <div className="flex-1 px-3">
        <h2 className="text-lg font-semibold mb-5">Sobre a Dynamic</h2>
        <p className="text-base font-light mb-3">
          Empresa fundada em outubro de 2018, com o objetivo de ajudar empresas a automatizar tarefas
          manuais e repetitivas, melhorando a qualidade e produtividade. Usando softwares que são
          comuns no escritório, nossos clientes recebem soluções com preços mais acessíveis e mais
          rápido.
        </p>
        <p className="font-light">CNPJ: 34.909.360/0001-22</p>
        <p className="font-light">Porto Alegre - RS</p>
      </div>
      <div className="flex-1 mx-auto my-16 lg:my-0 px-3 text-center">
        <h2 className="text-lg font-semibold mb-5">Menu</h2>
        <ul>
          <li>
            <Link className="px-4" to="/">
              Para Empresas
            </Link>
          </li>
          <li>
            <Link className="px-4" to="/aulas">
              Para Você
            </Link>
          </li>
          <li>
            <Link className="px-4" to="/planilhas-gratuitas">
              Planilhas Gratuitas
            </Link>
          </li>
          <li>
            <Link className="px-4" to="/precos">
              Preços
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 px-3 text-center lg:text-right">
        <h2 className="text-lg font-semibold mb-5">Contato</h2>
        <ul className="mb-4 flex lg:mr-2 mx-auto lg:ml-auto">
          <span className="mx-auto lg:mx-0 lg:ml-auto flex">
            <li className="mr-2">
              <a target="_blank" href="https://www.linkedin.com/company/dynamicpoa/">
                <LinkedIn />
              </a>
            </li>
            <li>
              <a target="_blank" href="https://www.instagram.com/dynamicpoa/">
                <Instagram />
              </a>
            </li>
          </span>
        </ul>
        <ul>
          <li>
            <a target="_blank" href="https://api.whatsapp.com/send?phone=5551996936418">
              +55 (51) 99693-6418
            </a>
          </li>
          <li>
            <a target="_blank" href="mailto:contato@dynamicpoa.com">
              contato@dynamicpoa.com
            </a>
          </li>
        </ul>
      </div>
    </div>
    <p className="text-center mt-12">
      <a
        className="hover:bg-chima hover:px-1 hover:text-white text-gray-500"
        target="_blank"
        href="https://agenciachima.com/"
      >
        Site desenvolvido pela Agência Chima 🧉
      </a>
    </p>
  </footer>
);

export default Footer;
