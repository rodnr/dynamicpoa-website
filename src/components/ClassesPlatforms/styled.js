import styled from 'styled-components';

export const PlatformsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to right, #5b87b5, #3b5f9e);
  padding: 2rem 0;

  margin: 4rem 0;
`;

export const PlatformsTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 3rem;
  color: #fff;
`;

export const PlatformsWrapper = styled.div`
  justify-content: center;
  width: 80vw;
  display: grid;
  grid-template-columns: repeat(auto-fit, 125px);
  grid-gap: 20px;
`;

export const PlatformBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 125px;
  background-color: #fff;
  box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.05);
  border-radius: 17.5px;
  transition: background-color 0.3s ease;

  &:hover {
    cursor: pointer;
    background-color: #3b5f9e;
  }

  img {
    height: 75px;
  }
`;

export const PlansWrapper = styled.div`
  max-width: 85vw;
  margin-top: 4rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 50px;
`;
