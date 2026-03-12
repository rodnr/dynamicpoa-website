import React from 'react';

import certificadoIcon from '../../images/benefits/certificado.svg';
import onlineIcon from '../../images/benefits/online.svg';
import flexivelIcon from '../../images/benefits/flexivel.svg';
import consultoriaIcon from '../../images/benefits/consultoria.svg';
import instantaneoIcon from '../../images/benefits/instantaneo.svg';
import exerciciosIcon from '../../images/benefits/exercicios.svg';

import * as S from './styled';

const ClassesBenefits = () => (
  <S.BenefitsSection>
    <S.BenefitsTitle>Quais são os benefícios de licenciar com a Dynamic?</S.BenefitsTitle>
    <S.BenefitsWrapper>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={certificadoIcon} alt="Parceiro Oficial" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Parceiro Oficial</S.BenefitTitle>
          <S.BenefitDescription>
           Estamos listados na página oficial de parceiros Microsoft como Revendedor Autorizado.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={onlineIcon} alt="Disponibilidade" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Disponibilidade</S.BenefitTitle>
          <S.BenefitDescription>
            Nosso portal web permite gerenciar suas licenças a qualquer momento.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={flexivelIcon} alt="Agilidade" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Agilidade</S.BenefitTitle>
          <S.BenefitDescription>
           As licenças são disponibilizadas no ambiente em pouco tempo
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={consultoriaIcon} alt="Consultoria" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Consultoria</S.BenefitTitle>
          <S.BenefitDescription>
            Tenha a opinião de um especialista em quais as opções de licenciamento atendem sua necessidade
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={instantaneoIcon} alt="Relatórios" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Relatórios</S.BenefitTitle>
          <S.BenefitDescription>
            Receba relatórios personalizado de custos, economia e usabilidade das licenças
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={exerciciosIcon} alt="Controle" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Controle</S.BenefitTitle>
          <S.BenefitDescription>
            O cancelamento e renovação de licenças ficam 100% no seu controle
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
    </S.BenefitsWrapper>
  </S.BenefitsSection>
);

export default ClassesBenefits;
