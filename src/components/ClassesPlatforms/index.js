import React, { useState } from 'react';

import { FaGraduationCap } from 'react-icons/fa';

import * as S from './styled';
import ClassesPlan from '../ClassesPlan';

const ClassesPlatforms = () => {
  const [platform, setPlatform] = useState(null);

  return (
    <S.PlatformsSection>
      <S.PlatformsTitle>Qual plataforma você deseja aprender?</S.PlatformsTitle>
      <S.PlatformsWrapper>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Excel')}>Excel</S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Powerpoint')}>
          Powerpoint
        </S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Word')}>Word</S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Power BI')}>PowerBI</S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Power Apps')}>PowerApps</S.PlatformBox>
        <S.PlatformBox onClick={() => setPlatform('Microsoft Flow')}>Flow</S.PlatformBox>
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
