import { Link } from 'gatsby';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 2/3;
  margin: 0 auto;
  gap: 1rem;
  max-width: 70rem;

  @media screen and (max-width: 768px) {
    padding: 0 1rem;
  }

`;

export const LinkContainer = styled(Link)`
  background-color: #e2e8f0;
  color: #4a5568;
  border-radius: 0.25rem;
  padding: 1rem;
  font-weight: 800;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #cbd5e0;
  }
`;

export const Arrow = styled.span`
  margin-right: 0.5rem;
  margin-left: ${props => (props.right ? '0.5rem' : '0')};
`;