import styled from '@emotion/styled'
import { DatePicker } from "@mui/x-date-pickers";

export const StyledDatePicker = styled(DatePicker)`
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #F28344;
    border-radius: 0.625rem;
  }
  .MuiOutlinedInput-root {
    border-radius: 0.625rem;
  }
`;