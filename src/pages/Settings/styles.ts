import styled from "styled-components";

export const Container = styled.div`
  max-width: 70rem;
  margin: 0 auto;
  padding: 2rem 3rem 0rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const ContentLocalEnvironment = styled.div`
  h3 {
    margin-bottom: 2rem;
  }

  > form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ContentRemoteEnvironment = styled.div`
  h3 {
    margin-bottom: 2rem;
  }

  > form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const Button = styled.button`
max-width: 190px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.theme["orange-dark"]};
  border: 0;
  padding: 0 2rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  cursor: pointer;

  transition: filter 0.3s;

  &:hover {
    filter: opacity(0.8);
  }
`;
