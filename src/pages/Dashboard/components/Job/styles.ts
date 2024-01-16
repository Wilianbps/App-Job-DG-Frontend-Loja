import styled from "styled-components";

interface ITbody {
  coolorStatus: string;
}

export const Tbody = styled.tbody<ITbody>`
  tr {
    position: relative;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);

    > td {
      font-size: 0.938rem;
      padding: 0 1.5rem;
      height: 3rem;
      text-align: center;
      background-color: ${(props) => props.theme.white};

      &:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      &:last-child {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }

      .contentJobStatus {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .cycleStatus {
          margin-right: 40px;
          display: block;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: ${(props) =>
            props.coolorStatus == "em execução"
              ? props.theme.yellow
              : props.coolorStatus == "processado"
              ? props.theme["green-dark"]
              : props.theme.red};
        }
      }
    }
  }
`;

interface ITag {
  variant: string;
}

export const Tag = styled.span<ITag>`
  position: absolute;
  content: "/";
  width: 5px;
  height: 100%;
  background-color: ${(props) =>
    props.variant == "usuários"
      ? props.theme.blue
      : props.variant == "entrada loja"
      ? props.theme.pink
      : props.variant == "saída loja" && props.theme.orange};
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
`;
