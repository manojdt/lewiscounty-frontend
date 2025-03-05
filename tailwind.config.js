/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          primary: {
            main: "#1D5BBF",
            light: "#1D5BBF0D",
            dark: "#76818E"
          },
          error: {
            main: "#FF4B26",
            light: "#ffe7e7"
          },
        },
        font: {
          primary: {
            main: "#1D5BBF",
            light: "#1D5BBF0D"
          },
          secondary: {
            white: "#fff",
            black: "#232323",
            gray: "#A9A9A9"
          },
          error: {
            main: "#FF4B26",
            light: "#ffe7e7"
          },
        },
        border: {
          main: "#D3D3D3",
          black: "#232323",
          secondary: "#DBE0E5",
        },
        gray: {
          main: "#EAEDF0",
        },
      },
    },
  },
  plugins: [],
};
