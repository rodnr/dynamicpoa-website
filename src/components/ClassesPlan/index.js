import React from 'react';

import * as S from './styled';

const ClassesPlan = ({ name, description, icon, price, link }) => (
  <S.PlanWrapper>
    <S.PlanName>{name}</S.PlanName>
    <S.PlanDescription>{description}</S.PlanDescription>
    <S.PlanIcon>{icon}</S.PlanIcon>
    <S.PlanPrice>
      R$
      <span>{price}</span>
    </S.PlanPrice>
    <S.PlanButton href={link} target="_blank">
      COMPRAR
    </S.PlanButton>
  </S.PlanWrapper>
);

export default ClassesPlan;
