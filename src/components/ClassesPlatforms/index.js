import React, { useState } from 'react';

import { FaGraduationCap } from 'react-icons/fa';

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
        <S.PlatformBox onClick={() => setPlatform('Microsoft Excel')}>
          <img src={excelIcon} alt="Excel" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Powerpoint')}>
          <img src={pptIcon} alt="PowerPoint" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Word')}>
          <img src={wordIcon} alt="Word" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Power BI')}>
          <img src={powerBIIcon} alt="Power BI" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Power Apps')}>
          <img src={powerAppsIcon} alt="Power Apps" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Flow')}>
          <img src={flowIcon} alt="Power Automate" />
        </S.PlatformBox>
      </S.PlatformsWrapper>
      {platform !== null && <S.PlatformTitle>{platform}</S.PlatformTitle>}
      {platform !== null && (
        <S.PlansWrapper>
          {platform === 'Microsoft Excel' && (
           <>
              <ClassesPlan
                name="Nível Básico (4h)"
                description="Aprenda o básico sobre planilhas"
                icon={<FaGraduationCap size={48} color="#5b87b5" />}
                price="299"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R57DJTLFU8VY2"
              />
              <ClassesPlan
                name="Nível Intermediário (4h)"
                description="Crie fórmulas complexas e tabelas dinâmicas"
                icon={<FaGraduationCap size={48} color="#5b87b5" />}
                price="499"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R57DJTLFU8VY2"
              />
              <ClassesPlan
                name="Nível Avançado (10h)"
                description="Explore a programação do Excel usando VBA e UserForm"
                icon={<FaGraduationCap size={48} color="#5b87b5" />}
                price="879"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RUTCWVSXDNLBL"
              />
              <ClassesPlan
                name="Dashboards (6h)"
                description="Aprenda a criar Dashboards dinâmicos e com uma visualização impecável"
                icon={<FaGraduationCap size={48} color="#5b87b5" />}
                price="699"
                link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L7B6FSV6EZG74"
              />
            </>
          )}
          {platform === 'Microsoft Powerpoint' && (
            <ClassesPlan
              name="EM BREVE"
              description=""
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price=""
              link="https://paypal.com"
            />
          )}
          {platform === 'Microsoft Word' && (
            <ClassesPlan
              name="EM BREVE"
              description=""
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price=""
              link="https://paypal.com"
            />
          )}
          {platform === 'Power BI' && (
          <>
            <ClassesPlan
              name="Nível Básico (4h)"
              description="Conheça a plataforma que cada vez mais cresce no mercado"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="391"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L7B6FSV6EZG74"
            />
            <ClassesPlan
              name="Nível Intermediário (5h)"
              description="Aprenda técnicas e conceitos de BI, UI, UX e Design na criação de Dashboards"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="573"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VY63CURS6LBQE"
            />
            <ClassesPlan
              name="Nível Avançado (8h)"
              description="Domine a linguagem M e o DAX"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="1152"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MH5A3HWHGNWR4"
            />
          </>
          )}
          {platform === 'Power Apps' && (
            <ClassesPlan
              name="Nível Básico (5h)"
              description="Aprenda a criar aplicativos empresariais sem precisar programar"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="531"
              link="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=K4LGMALZFWQNY"
            />
          )}
          {platform === 'Microsoft Flow' && (
            <ClassesPlan
              name="EM BREVE"
              description=""
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price=""
              link="https://paypal.com"
            />
          )}
        </S.PlansWrapper>
      )}
    </S.PlatformsSection>
  );
};

export default ClassesPlatforms;
