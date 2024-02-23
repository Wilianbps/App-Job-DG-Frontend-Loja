import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StyledDatePicker } from "./styles";

interface DatePickerMuiProps {
  selectDate: Date  | unknown;
  onSelectDate: (date: Date  | unknown) => void;
}

export function DatePickerMUI({
  selectDate,
  onSelectDate,
}: DatePickerMuiProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledDatePicker
        format="dd/MM/yyyy"
        value={selectDate}
        onChange={(date: Date | unknown) => onSelectDate(date)}
      />
    </LocalizationProvider>
  );
}
