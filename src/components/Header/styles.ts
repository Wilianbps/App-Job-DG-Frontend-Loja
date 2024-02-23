import styled from "styled-components";

export const Container = styled.header`
  background-color: ${(props) => props.theme["orange-light"]};
  width: 100%;
  height: 18rem;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 70rem;
  margin: 0 auto;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.div`
  img {
    width: 11rem;
  }
`;

export const ContainerButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export const Button = styled.button`
  font-size: 1rem;
  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.theme["orange-dark"]};
  border: 0;
  padding: 0 2rem;
  height: 3rem;
  border-radius: 0.625rem;
  cursor: pointer;

  transition: filter 0.3s;

  &:hover {
    filter: opacity(0.8);
  }
`;
