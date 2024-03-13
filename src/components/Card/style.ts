import styled from "styled-components";

export const Container = styled.div`
  width: 24rem;
  min-height: 225px;
  margin: 0 auto;
  transform: translateY(calc(-50%));
  background-color: ${(props) => props.theme["orange-dark"]};
  border-radius: 1.375rem;
`;

export const Content = styled.div`
  padding: 3.125rem 2.5rem;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  > span {
    color: ${(props) => props.theme.white};
    font-size: 0.875rem;
  }

  > svg {
    font-size: 22px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.938rem;
  font-size: 23px;
  color: ${(props) => props.theme.white};
  font-weight: bold;
`;
