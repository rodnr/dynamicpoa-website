import React, { useState } from 'react';

import { FaGraduationCap , FaCalculator, FaCode , FaChartPie , FaChalkboardTeacher, FaFileAlt , FaMobileAlt, FaChartBar , FaPalette , FaDatabase , FaSitemap} from 'react-icons/fa';

import * as S from './styled';
import ClassesPlan from '../ClassesPlan';

import excelIcon from '../../images/apps/Excel.svg';
import pptIcon from '../../images/apps/PPT.svg';
import wordIcon from '../../images/apps/Word.svg';
import powerBIIcon from '../../images/apps/PowerBI.svg';
import powerAppsIcon from '../../images/apps/PowerApps.svg';
import flowIcon from '../../images/apps/Flow.svg';

const ClassesPlatforms = () => {
  const [platform, setPlatform] = useState(null);

  return (
    <S.PlatformsSection id="platformsSection">
      <S.PlatformsTitle>Conheça os treinamentos disponíveis para sua empresa</S.PlatformsTitle>
      <S.PlatformsWrapper>
        <S.PlatformBox
          className={platform === 'Microsoft Excel' && 'active'}
          onClick={() => setPlatform('Microsoft Excel')}
        >
          <img src={excelIcon} alt="Excel" />
        </S.PlatformBox>
        <S.PlatformBox
          className={platform === 'Microsoft PowerPoint' && 'active'}
          onClick={() => setPlatform('Microsoft PowerPoint')}
        >
          <img src={pptIcon} alt="PowerPoint" />
        </S.PlatformBox>
        <S.PlatformBox
          className={platform === 'Microsoft Word' && 'active'}
          onClick={() => setPlatform('Microsoft Word')}
        >
          <img src={wordIcon} alt="Word" />
        </S.PlatformBox>
        <S.PlatformBox
          className={platform === 'Power BI' && 'active'}
          onClick={() => setPlatform('Power BI')}
        >
          <img src={powerBIIcon} alt="Power BI" />
        </S.PlatformBox>
        <S.PlatformBox
          className={platform === 'Power Apps' && 'active'}
          onClick={() => setPlatform('Power Apps')}
        >
          <img src={powerAppsIcon} alt="Power Apps" />
        </S.PlatformBox>
        <S.PlatformBox
          className={platform === 'Power Automate' && 'active'}
          onClick={() => setPlatform('Power Automate')}
        >
          <img src={flowIcon} alt="Power Automate" />
        </S.PlatformBox>
      </S.PlatformsWrapper>
      {platform !== null && <S.PlatformTitle>{platform}</S.PlatformTitle>}
      {platform !== null && (
        <S.PlansWrapper>
          {platform === 'Microsoft Excel' && (
            <>
              <ClassesPlan
                name="Básico"
                hours="4"
                description="Conceitos básicos sobre planilhas"
                icon={<FaGraduationCap size={48} color="#D9D9D9" />}
                price="291"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R57DJTLFU8VY2"
                price="99/pessoa*"
                link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Excel%20Basico"
              />
              <ClassesPlan
                name="Intermediário"
                hours="6"
                description="Fórmulas como PROCV, CORRESP e tabelas dinâmicas"
                description="Fórmulas como PROCV e tabelas dinâmicas"
                icon={<FaCalculator size={48} color="#D9D9D9" />}
                price="499"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=28DRFJLD3XH9L"
                price="129/pessoa*"
                link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Excel%20Intermediario"
              />
              <ClassesPlan
                name="Avançado"
                hours="15"
                description="Power Query e VBA"
                icon={<FaCode size={48} color="#D9D9D9" />}
                price="879"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RUTCWVSXDNLBL"
                price="259/pessoa*"
                link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Excel%20Avancado"
              />
              <ClassesPlan
                name="Dashboards"
                hours="8"
                description="Dashboards com design moderno"
                icon={<FaChartPie size={48} color="#D9D9D9" />}
                price="699"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L7B6FSV6EZG74"
                price="199/pessoa*"
                link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Excel%20Dashboards"
              />
            </>
          )}
          {platform === 'Microsoft PowerPoint' && (
            <ClassesPlan
              name="Completo"
              hours="15"
              description="Aprenda do básico ao avançado sobre apresentações"
              icon={<FaChalkboardTeacher size={48} color="#D9D9D9" />}
              price="291"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4ACPX42PDUWMU"
              price="259/pessoa*"
              link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20PowerPoint"
            />
          )}
          {platform === 'Microsoft Word' && (
            <ClassesPlan
              name="Básico"
              name="Completo"
              hours="15"
              description="Aprenda do básico ao avançado para automatizar documentos"
              icon={<FaFileAlt size={48} color="#D9D9D9" />}
              price="291"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2K4LFD87TTFHN"
              price="259/pessoa*"
              link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Word%20Completo"
            />
          )}
          {platform === 'Power BI' && (
            <>
              <ClassesPlan
                name="Básico"
                hours="4"
                description="Conceitos básicos do Power BI"
                icon={<FaChartBar size={48} color="#D9D9D9" />}
                price="391"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3V7WP6DM46LFW"
                price="129/pessoa*"
                link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Power%20BI%20Basico"
              />
              <ClassesPlan
                name="Intermediário"
                hours="6"
                description="Aprenda técnicas e conceitos de BI e UI/UX na criação de Dashboards"
                icon={<FaPalette size={48} color="#D9D9D9" />}
                price="573"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VY63CURS6LBQE"
                price="189/pessoa*"
                link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Power%20BI%20Intermediario"
              />
              <ClassesPlan
                name="Avançado"
                hours="8"
                hours="12"
                description="Domine a linguagem M, o DAX e a conexão com APIs"
                icon={<FaDatabase size={48} color="#D9D9D9" />}
                price="1152"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MH5A3HWHGNWR4"
                price="289/pessoa*"
                link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Power%20BI%20Avancado"
              />
            </>
          )}
          {platform === 'Power Apps' && (
            <ClassesPlan
              name="Completo"
              hours="20"
              description="Aprenda a criar aplicativos empresariais sem códigos"
              icon={<FaMobileAlt size={48} color="#D9D9D9" />}
              price="531"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=K4LGMALZFWQNY"
              price="289/pessoa*"
              link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Power%20Apps%20Completo"
            />
          )}
          {platform === 'Power Automate' && (
            <ClassesPlan
              name="Completo"
              hours="15"
              description="Tudo sobre automação de processos criando fluxos entre APIs"
              icon={<FaSitemap size={48} color="#D9D9D9" />}
              price="399"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WMK58QZTMVJVW"
              price="289/pessoa*"
              link="https://api.whatsapp.com/send?phone=5551996936418&text=Quero%20contratar%20um%20treinamento%20de%20Power%20Automate%20Completo"
            />
          )}
        </S.PlansWrapper>
      )}
    </S.PlatformsSection>
  );
};

export default ClassesPlatforms;
