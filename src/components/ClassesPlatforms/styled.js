import styled from 'styled-components';

export const PlatformsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to right, #202A45, #3b5f9e);
  padding: 4rem 0;

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

  &.active {
    box-shadow: 4px 4px 3px 0 rgba(0, 0, 0, 0.25);
    background-image: linear-gradient(to right, #202A45, #3b5f9e);
  }

  &:hover {
    cursor: pointer;
    transform: translateY(-2px);
    box-shadow: 2px 2px 6px 2px rgba(0, 0, 0, 0.05);
    opacity: 0.8;
  }

  img {
    height: 75px;
  }
`;

export const PlatformTitle = styled.h3`
  margin-top: 3rem;
  font-size: 2.5rem;
  font-weight: 600;
  color: #fff;
`;

export const PlansWrapper = styled.div`
  max-width: 85vw;
  margin-top: 3rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 50px;
`;
