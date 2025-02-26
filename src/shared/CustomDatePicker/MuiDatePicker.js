import { Avatar } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import calendar_icon from "../../assets/icons/calendar_icon.svg";

const MuiDatePicker = ({
  helperText,
  placeholder,
  error,
  disabled,
  ...restOfProps
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DatePicker
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

export default MuiDatePicker;
