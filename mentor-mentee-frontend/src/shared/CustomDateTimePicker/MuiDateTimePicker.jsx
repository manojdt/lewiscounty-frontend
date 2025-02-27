import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import calendar_icon from "../../assets/icons/calendar_icon.svg";
import { Avatar } from "@mui/material";

const CustomDateTimePicker = ({ helperText,placeholder, error, ...restOfProps }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        slots={{
          openPickerIcon: () => (
            <Avatar src={calendar_icon} alt={"calendar_icon"} />
          ),
        }}
        slotProps={{
          textField: {
            error: !!error,
            helperText,
            ...(placeholder && { placeholder })
          },
        }}
        {...restOfProps}
      />
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;
