import styled from "styled-components";


export const ContainerFooter = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${(props) => props.theme["orange-light"]};
  padding: 70px;
 
`;

export const ContentFooter = styled.div`
  padding-top: 50px;
  border-top: solid 1px ${(props) => props.theme.gray};
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  span {
    font-size: 0.875rem;
    height: 100%;
    font-weight: bold;
    color: gray;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.625rem;
  }
`;
