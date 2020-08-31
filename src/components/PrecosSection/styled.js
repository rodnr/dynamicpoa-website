import styled from 'styled-components';

export const Plan = styled.a`
  display: block;
  text-decoration: none;
  color: #000;

  box-shadow: rgba(0, 0, 0, 0.08) 0px 10px 28px;
  padding-bottom: 2.5rem;
  height: 100%;
  width: 320px;
  border-radius: 0.5rem;
  background: #fff;

  transition: all 0.6s ease;

  p.title {
    font-size: 2rem;
    font-weight: 300;
    padding: 1.5rem 0;
    border-top-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    background: rgb(91, 135, 181);
    color: #ffffff70;
  }

  .plan_hours {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #878787;
    font-size: 1.5rem;

    svg {
      margin-right: 0.5rem;
    }
  }

  .plan_price_wrapper {
    margin: 4rem 1.5rem 3rem;
    display: flex;
    justify-content: center;
  }

  .plan_currency {
    line-height: 6rem;
  }

  .plan_price {
    font-size: 6rem;
    line-height: 6rem;
    margin: 0 1rem;
  }

  .plan_month {
    line-height: 6rem;
  }

  .hire_button {
    display: inline-block;
    text-transform: uppercase;
    margin-top: 3rem;
    background: rgb(91, 135, 181);
    color: #ffffff;
    padding: 10px 35px;
    border-radius: 5px;
  }

  &.standard {
    p.title {
      font-weight: 600;
      background: rgb(59, 95, 158);
      color: #ffffff;
    }

    .hire_button {
      background: rgb(59, 95, 158);
    }
  }

  &.personalized {
    p.title {
      font-size: 1.5rem;
      font-weight: 300;
      padding: 0.5rem 0;
      border-top-right-radius: 0.5rem;
      border-top-left-radius: 0.5rem;
      background: rgb(91, 135, 181);
      color: #ffffff;
    }

    div {
      padding: 3rem 3.5rem;
    }
    .hire_button {
      margin: 0;
    }
  }

  &:hover {
    color: #000;
    transform: translateY(-5px);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 28px;
  }
`;

export const DiscountLabel = styled.div`
  position: absolute;
  right: -35px;
  top: 5px;
  font-size: 12px;
  color: #fff;
  background: #35b86e;
  padding: 3px 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.75);
`;
