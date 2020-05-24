import styled from 'styled-components';

export const PlanWrapper = styled.div`
  background-color: #fff;
  color: #303030;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;

  border-radius: 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
`;

export const PlanName = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const PlanDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #696969;
`;

export const PlanIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

export const PlanPrice = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 1rem;

  span {
    margin-left: 0.25rem;
    font-size: 1.75rem;
  }
`;

export const PlanButton = styled.a`
  text-decoration: none;
  padding: 0.5rem 2rem;
  background-color: #5b87b5;
  box-shadow: 0 5px 0 #4d7099;
  color: #fff;

  &:hover {
    color: #fff;
    transform: translateY(1px);
    box-shadow: 0 4px 0 #4d7099;
  }

  &:active {
    transform: translateY(5px);
    box-shadow: 0 0 0 #4d7099;
  }
`;
