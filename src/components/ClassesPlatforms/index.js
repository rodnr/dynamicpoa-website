import React, { useState } from 'react';

import { FaChartBar } from 'react-icons/fa';

import ClassesPlan from '../ClassesPlan';
import * as S from './styled';

import powerBIIcon from '../../images/apps/PowerBI.svg';

const ClassesPlatforms = () => {
  const [platform, setPlatform] = useState(null);

  return (
    <S.PlatformsSection id="platformsSection">
      <S.PlatformsTitle>
        Inscreva-se nos próximos treinamentos online abertos ao público
      </S.PlatformsTitle>
      <S.PlatformsWrapper>
        <S.PlatformBox
          className={platform === 'Power BI' && 'active'}
          onClick={() => setPlatform('Power BI')}
        >
          <img src={powerBIIcon} alt="Power BI" />
        </S.PlatformBox>
      </S.PlatformsWrapper>
      {platform !== null && <S.PlatformTitle>{platform}</S.PlatformTitle>}
      {platform !== null && (
        <S.PlansWrapper>
          {platform === 'Power BI' && (
            <>
              <ClassesPlan
                name="Básico"
                hours="3"
                description="Conceitos básicos e fundamentais do Power BI"
                icon={<FaChartBar size={48} color="#D9D9D9" />}
                price="20/01/2025"
                link="https://buy.stripe.com/5kAbL957R9eJd4Q5kl"
              />
            </>
          )}
        </S.PlansWrapper>
      )}
    </S.PlatformsSection>
  );
};

export default ClassesPlatforms;
