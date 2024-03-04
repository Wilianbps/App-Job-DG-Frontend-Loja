import { forwardRef } from "react";
import { InputWrapper, InputStyledContainer, InputStyled } from "./styles";
interface InputProps {
  placeholder: string;
  type: string;
  value?: string;
  className: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <InputWrapper className={className}>
        <InputStyledContainer $hasError={!!error}>
          <InputStyled {...props} ref={ref} />
        </InputStyledContainer>
        {error && <p>{error}</p>}
      </InputWrapper>
    );
  }
);

Input.displayName = "Input";
