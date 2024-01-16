import Box from "@mui/material/Box";
import { StyledTextField } from "./styles";
import { ChangeEvent } from "react";

interface InputMUIProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function InputMUI({ value, onChange }: InputMUIProps) {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": {
          width: "400px",
          maxWidth: "100%",
          borderRadius: "10px",
        },
        ".MuiOutlinedInput-root": { borderRadius: "10px" },
      }}
      noValidate
      autoComplete="off"
    >
      <StyledTextField
        value={value}
        onChange={onChange}
        id="outlined-basic"
        label="Buscar"
        variant="outlined"
        placeholder="Buscar por nome, tabela ou status"
      />
    </Box>
  );
}
