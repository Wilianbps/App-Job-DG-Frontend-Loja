
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StyledDatePicker } from "./styles";

export function DatePickerMUI() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDatePicker />
    </LocalizationProvider>
  );
}
