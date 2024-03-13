import styled from "styled-components";

export const Container = styled.div`
  width: 80%;
  margin: 0px auto 150px;
  display: flex;
  justify-content: center;
  align-items: center;
 

  color: ${props => props.theme["red-700"]};
  border: solid 1px ${props => props.theme["red-700"]};
  padding: 10px;
  border-radius: 10px;

  p {
    font-weight: bold;
  }

  span{
    font-weight: 500;
  }
`;
