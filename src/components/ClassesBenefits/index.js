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
            Nossos treinamentos possuem certificados válidos como parceiro da Microsoft.
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
            Os treinamentos podem ser gravados para ser assistido posteriormente.
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
           Horários flexíveis de acordo com a realidade da empresa.
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
            Consultoria gratuita após o treinamento para auxiliar os participantes a aplicar os conteúdos na prática.
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
            Conteúdos personalizados de acordo com o público-alvo do treinamento, setores, níveis de conhecimento e objetivos.
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
            Exercícios práticos e apostila para avaliar a qualidade do treinamento e do aprendizado.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
    </S.BenefitsWrapper>
  </S.BenefitsSection>
);

export default ClassesBenefits;
