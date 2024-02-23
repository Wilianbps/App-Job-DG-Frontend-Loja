import { styled } from 'styled-components'

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  > p {
    color: #ff0000;
    font-size: 0.875rem;
  }
`

interface InputContainerProps {
  $hasError: boolean
}

export const InputStyledContainer = styled.div<InputContainerProps>`
  height: 2.625rem;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme['base-button']};
  background: ${(props) => props.theme.white};

  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  transition: 0.4s;

  &:focus-within {
    border-color: ${(props) =>
      props.$hasError ? '#ff0000' : props.theme.orange};
  }
`

export const InputStyled = styled.input`
  flex: 1;
  background: none;
  border: none;
  padding: 0 0.75rem;
  height: 100%;
  font-size: 0.75rem;
  color: ${(props) => props.theme['base-text']};

  &::placeholder {
    color: ${(props) => props.theme['base-label']};
  }
`
