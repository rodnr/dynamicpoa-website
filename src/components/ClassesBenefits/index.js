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
    <S.BenefitsTitle>Benefícios</S.BenefitsTitle>
    <S.BenefitsWrapper>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={certificadoIcon} alt="Certificado" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Certificado</S.BenefitTitle>
          <S.BenefitDescription>
            Ao concluir um nível, você recebe um certificado digital autenticado para complementar o
            currículo.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={onlineIcon} alt="Online" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Online</S.BenefitTitle>
          <S.BenefitDescription>
            As aulas são realizadas através do Microsoft Teams e você pode revê-las a qualquer
            momento.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={flexivelIcon} alt="Flexivel" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Flexível</S.BenefitTitle>
          <S.BenefitDescription>
            Você pode escolher o horário e duração de sua preferência para realizar as aulas.
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
            Consultoria por WhatsApp por 15 dias após a conclusão das aulas para solucionar dúvidas.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={instantaneoIcon} alt="Instantaneo" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Instantâneo</S.BenefitTitle>
          <S.BenefitDescription>
            Você tem liberdade de perguntar a qualquer momento durante a aula e mostrar exemplos na
            sua tela.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={exerciciosIcon} alt="Exercicios" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Exercícios</S.BenefitTitle>
          <S.BenefitDescription>
            Lista de exercícios e desafios enviados para serem resolvidos após a conclusão das
            aulas.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
    </S.BenefitsWrapper>
  </S.BenefitsSection>
);

export default ClassesBenefits;
