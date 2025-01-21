import styled from "styled-components";

export const ContainerHome = styled.div`
  background-color: ${(props) => props.theme["base-background"]};
`;

export const ContainerMain = styled.div`
  margin-top: -70px;
  margin-bottom: 2.5rem;
  min-height: 42vh;
`;

export const ContainerSearch = styled.div`
  max-width: 70%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  > input[type="text"] {
    width: 400px;
    padding: 12px 16px;
    border: 1px solid ${(props) => props.theme.gray};
    border-radius: 6px;

    color: ${(props) => props.theme["base-text"]};
    font-size: 1rem;
    line-height: 1.6;
  }
`;

export const InputSearch = styled.input``;

export const ButtonSearch = styled.button`
  width: 120px;
  font-size: 1rem;
  color: ${(props) => props.theme.white};
  background-color: ${(props) => props.theme["orange-dark"]};
  border: 0;
  padding: 0 2rem;
  height: 3.5rem;
  border-radius: 0.625rem;
  cursor: pointer;

  transition: filter 0.3s;

  &:hover {
    filter: opacity(0.8);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ContainerJobsList = styled.div`
  max-width: 70rem;
  margin: 0 auto;
  padding: 2rem 3rem 0rem;
`;

export const Title = styled.h4`
  color: ${(props) => props.theme.orange};
`;

export const ListJobs = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
`;

export const Thead = styled.thead`
  td {
    color: ${(props) => props.theme.gray};
    font-weight: lighter;
    text-align: center;
    font-size: 0.938rem;

    &:last-child {
      padding-right: 30px;
    }
  }
`;

export const ContainerPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;
