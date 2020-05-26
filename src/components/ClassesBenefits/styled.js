import styled from 'styled-components';
import media from 'styled-media-query';

export const BenefitsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #303030;
`;

export const BenefitsTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 3rem;
`;

export const BenefitsWrapper = styled.div`
  max-width: 65vw;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 50px;

  ${media.lessThan('medium')`
    max-width: 90vw;
    grid-template-columns: repeat(1, 1fr);
  `}
`;

export const SingleBenefit = styled.div`
  display: flex;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border-radius: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.05);
  }

  ${media.lessThan('large')`
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `}
`;

export const BenefitIcon = styled.div`
  margin-right: 2rem;
  max-width: 100px;

  ${media.lessThan('large')`
    margin-right: 0;
    margin-bottom: 1rem;
  `}
`;

export const BenefitContent = styled.div`
  color: #3c4245;

  ${media.lessThan('large')`
    text-align: center;
  `}
`;

export const BenefitTitle = styled.h4`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const BenefitDescription = styled.p``;
