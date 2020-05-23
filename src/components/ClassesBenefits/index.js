import React from 'react';

import {
  FaCertificate,
  FaCloud,
  FaStopwatch,
  FaLightbulb,
  FaCommentAlt,
  FaPencilAlt
} from 'react-icons/fa';

import * as S from './styled';

const ClassesBenefits = () => (
  <S.BenefitsSection>
    <S.BenefitsTitle>Benefícios</S.BenefitsTitle>
    <S.BenefitsWrapper>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <FaCertificate color="#5B87B5" size={52} />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Certificado</S.BenefitTitle>
          <S.BenefitDescription>
            Ao concluir um nível, você recebe um certificado digital autentiacdo para complementar o
            currículo.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <FaCloud color="#5B87B5" size={52} />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Online</S.BenefitTitle>
          <S.BenefitDescription>
            As aulas são realizadas através do Microsoft Teams e você pode revêlas a qualquer
            momento.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <FaStopwatch color="#5B87B5" size={52} />
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
          <FaLightbulb color="#5B87B5" size={52} />
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
          <FaCommentAlt color="#5B87B5" size={52} />
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
          <FaPencilAlt color="#5B87B5" size={52} />
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
