import { createTheme, responsiveFontSizes } from "@mui/material";

let MuiTheme = createTheme({
  palette: {
    primary: {
      main: "#1D5BBF",
      light: "#1D5BBF0D",
    },
  },
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
        variant: "contained",
        color: "primary",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            background: "#1D5BBF0D",
            border: "none",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },
        },
      },
    },
    MuiAvatar: {
      defaultProps: {
        variant: "rounded",
        sx: {
          width: 25,
          height: 25,
        },
      },
    },
    MuiMenuList: {
      defaultProps: {
        dense: true,
      },
    },
    MuiRadio:{
      defaultProps:{
        icon:(
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "2px solid #C5C5C5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          ),
        checkedIcon:(
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: "2px solid #3B54CB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#3B54CB",
              }}
            />
          </div>
        )
      }
    },
    MuiDataGrid: {
      defaultProps: {
        sx: {
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#1D5BBF0D",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        },
      },
    },
  },
});

export default MuiTheme = responsiveFontSizes(MuiTheme);
