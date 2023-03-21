import styled from "styled-components";

export const GridContainer = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 columns for desktop
  grid-auto-rows: minmax(600px, auto);
  gap: 40px; // gap between grid items
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); // 2 columns for tablet
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr); // 1 column for small devices
  }
`;