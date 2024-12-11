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
    <S.BenefitsTitle>Quais são os benefícios de qualificar-se com a Dynamic?</S.BenefitsTitle>
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
            As aulas são gravadas e podem ser assistidas posteriormente de forma online.
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
           Horários de treinamentos ao vivo flexíveis.
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
            Suporte gratuito por tempo limitado após o treinamento para aplicação dos conteúdos na prática.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={instantaneoIcon} alt="Instantaneo" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Personalização</S.BenefitTitle>
          <S.BenefitDescription>
            Conteúdos segmentados e personalizados de acordo com o público-alvo, por setores ou atividades específicas.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
      <S.SingleBenefit>
        <S.BenefitIcon>
          <img src={exerciciosIcon} alt="Exercicios" />
        </S.BenefitIcon>
        <S.BenefitContent>
          <S.BenefitTitle>Materiais</S.BenefitTitle>
          <S.BenefitDescription>
            Conteúdos práticos com situações reais e apostilas para fixação do conteúdo.
          </S.BenefitDescription>
        </S.BenefitContent>
      </S.SingleBenefit>
    </S.BenefitsWrapper>
  </S.BenefitsSection>
);

export default ClassesBenefits;
