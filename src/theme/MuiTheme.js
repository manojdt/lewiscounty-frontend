import { createTheme, responsiveFontSizes } from "@mui/material";

let MuiTheme = createTheme({
  typography: {
    fontFamily: ["Plus Jakarta Sans", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
        colorInherit: {
          borderColor: "rgba(62, 62, 62, 1)",
          color: "rgba(62, 62, 62, 1)",
        },
        containedPrimary: {
          background: "linear-gradient(to right, #00AEBD, #1D5BBF)",
        },
      },
      defaultProps: {
        size: "large",
        disableElevation: true,
        disableTouchRipple: true,
      },
    },
  },
});

export default MuiTheme = responsiveFontSizes(MuiTheme);
