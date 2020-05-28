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
      <S.PlatformsTitle>Qual plataforma você deseja aprender?</S.PlatformsTitle>
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
                description="Aprenda o fundamental sobre planilhas"
                icon={<FaGraduationCap size={48} color="#5b87b5" />}
                price="291"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R57DJTLFU8VY2"
              />
              <ClassesPlan
                name="Intermediário"
                hours="4"
                description="Crie fórmulas complexas e tabelas dinâmicas"
                icon={<FaCalculator size={48} color="#5b87b5" />}
                price="499"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=28DRFJLD3XH9L"
              />
              <ClassesPlan
                name="Avançado"
                hours="10"
                description="Explore a programação do Excel usando VBA"
                icon={<FaCode size={48} color="#5b87b5" />}
                price="879"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RUTCWVSXDNLBL"
              />
              <ClassesPlan
                name="Dashboards"
                hours="6"
                description="Desenvolva Dashboards com design modernos"
                icon={<FaChartPie size={48} color="#5b87b5" />}
                price="699"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L7B6FSV6EZG74"
              />
            </>
          )}
          {platform === 'Microsoft PowerPoint' && (
            <ClassesPlan
              name="Básico"
              hours="4"
              description="Aprenda o fundamental sobre apresentações"
              icon={<FaChalkboardTeacher size={48} color="#5b87b5" />}
              price="291"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4ACPX42PDUWMU"
            />
          )}
          {platform === 'Microsoft Word' && (
            <ClassesPlan
              name="Básico"
              hours="4"
              description="Aprenda o fundamental sobre documentos"
              icon={<FaFileAlt size={48} color="#5b87b5" />}
              price="291"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2K4LFD87TTFHN"
            />
          )}
          {platform === 'Power BI' && (
            <>
              <ClassesPlan
                name="Básico"
                hours="4"
                description="Conheça a plataforma que cada vez mais cresce no mercado"
                icon={<FaChartBar size={48} color="#5b87b5" />}
                price="391"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3V7WP6DM46LFW"
              />
              <ClassesPlan
                name="Intermediário"
                hours="5"
                description="Aprenda técnicas e conceitos de BI, UI, UX e Design na criação de Dashboards"
                icon={<FaPalette size={48} color="#5b87b5" />}
                price="573"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VY63CURS6LBQE"
              />
              <ClassesPlan
                name="Avançado"
                hours="8"
                description="Domine a linguagem M, o DAX e a conexão com APIs"
                icon={<FaDatabase size={48} color="#5b87b5" />}
                price="1152"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MH5A3HWHGNWR4"
              />
            </>
          )}
          {platform === 'Power Apps' && (
            <ClassesPlan
              name="Nível Básico"
              hours="5"
              description="Aprenda a criar aplicativos empresariais sem precisar programar"
              icon={<FaMobileAlt size={48} color="#5b87b5" />}
              price="531"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=K4LGMALZFWQNY"
            />
          )}
          {platform === 'Power Automate' && (
            <ClassesPlan
              name="Nível Básico"
              hours="4"
              description="Saiba como automatizar processos criando fluxos entre APIs"
              icon={<FaSitemap size={48} color="#5b87b5" />}
              price="399"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WMK58QZTMVJVW"
            />
          )}
        </S.PlansWrapper>
      )}
    </S.PlatformsSection>
  );
};

export default ClassesPlatforms;
