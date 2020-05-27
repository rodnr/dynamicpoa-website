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
          <img src={excelIcon} alt="Microsoft Excel" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Powerpoint')}>
          <img src={pptIcon} alt="Microsoft Powerpoint" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Word')}>
          <img src={wordIcon} alt="Microsoft Word" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Power BI')}>
          <img src={powerBIIcon} alt="Power BI" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Power Apps')}>
          <img src={powerAppsIcon} alt="Power Apps" />
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Flow')}>
          <img src={flowIcon} alt="Microsoft Flow" />
        </S.PlatformBox>
      </S.PlatformsWrapper>
      {platform !== null && (
        <S.PlansWrapper>
          {platform === 'Microsoft Excel' && (
            <>
              <ClassesPlan
                name="Nível Básico"
                description="Aprenda o básico sobre planilhas"
                icon={<FaGraduationCap size={48} color="#5b87b5" />}
                price="369"
                link="https://paypal.com"
              />
              <ClassesPlan
                name="Nível Intermediário"
                description="Aprenda o básico sobre planilhas"
                icon={<FaGraduationCap size={48} color="#5b87b5" />}
                price="369"
                link="https://paypal.com"
              />
            </>
          )}
          {platform === 'Microsoft Powerpoint' && (
            <ClassesPlan
              name="Nível Básico"
              description="Aprenda o básico sobre planilhas"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="369"
              link="https://paypal.com"
            />
          )}
          {platform === 'Microsoft Word' && (
            <ClassesPlan
              name="Nível Básico"
              description="Aprenda o básico sobre planilhas"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="369"
              link="https://paypal.com"
            />
          )}
          {platform === 'Power BI' && (
            <ClassesPlan
              name="Nível Básico"
              description="Aprenda o básico sobre planilhas"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="369"
              link="https://paypal.com"
            />
          )}
          {platform === 'Power Apps' && (
            <ClassesPlan
              name="Nível Básico"
              description="Aprenda o básico sobre planilhas"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="369"
              link="https://paypal.com"
            />
          )}
          {platform === 'Microsoft Flow' && (
            <ClassesPlan
              name="Nível Básico"
              description="Aprenda o básico sobre planilhas"
              icon={<FaGraduationCap size={48} color="#5b87b5" />}
              price="369"
              link="https://paypal.com"
            />
          )}
        </S.PlansWrapper>
      )}
    </S.PlatformsSection>
  );
};

export default ClassesPlatforms;
