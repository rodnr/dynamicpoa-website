import styled from "styled-components";

export const GridContainer = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3 columns for desktop
  grid-auto-rows: minmax(600px, auto);
  gap: 0 20px; // gap between grid items
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); // 2 columns for tablet
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr); // 1 column for small devices
  }
`;

export const RecentTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #1a202c;
`

export const RecentContainer = styled.section`
    text-align: center;
    background-color: #edf2f7;
    padding: 64px 0;
`