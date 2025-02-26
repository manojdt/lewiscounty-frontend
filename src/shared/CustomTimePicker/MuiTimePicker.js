import { TimePicker } from "@mui/x-date-pickers";
import React from "react";

const MuiTimePicker = (props) => {
  const { helperText, placeholder, error, disabled, ...restOfProps } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <TimePicker
      disabled={disabled}
      open={open}
      onClose={() => setOpen(false)}
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

export default MuiTimePicker;
