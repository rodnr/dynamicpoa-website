#202A45import { Link } from "gatsby";
import styled from "styled-components";

export const PostLink = styled(Link)`
  text-decoration: none;
  color: #3b5f9e;
`;

export const PostItemWrapper = styled.div`
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  border: #d3d3d3 solid 1px;
  height: 100%;
  

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to bottom,#202A45,#3b5f9e);
    color: white;
  }
`;

export const PostTitle = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1.2;
`;

export const PostDate = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
`;

export const PostDescription = styled.p`
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.5
  `;

export const PostImage = styled.img`
  width: 100%;
  height: 260px;
  margin-bottom: 1em;

  object-fit: cover;
  `