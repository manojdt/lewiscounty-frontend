import { DateTimePicker } from "@mui/x-date-pickers";
import calendar_icon from "../../assets/icons/calendar_icon.svg";
import { Avatar } from "@mui/material";
import { useState } from "react";

const CustomDateTimePicker = ({
  helperText,
  placeholder,
  error,
  disabled,
  ...restOfProps
}) => {
  const [open, setOpen] = useState(false);
  return (
    <DateTimePicker
      disabled={disabled}
      open={open}
      onClose={() => setOpen(false)}
      slots={{
        openPickerIcon: () => (
          <Avatar
            className={`${disabled ? "opacity-70" : "opacity-100"}`}
            src={calendar_icon}
            alt={"calendar_icon"}
            onClick={() => setOpen(true)}
          />
        ),
      }}
      slotProps={{
        textField: {
          onClick: disabled ? undefined : () => setOpen(true),
          error: !!error,
          helperText,
          ...(placeholder && { placeholder }),
        },
      }}
      {...restOfProps}
    />
  );
};

export default CustomDateTimePicker;
