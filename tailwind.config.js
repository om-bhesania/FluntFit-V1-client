import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#845526 ",
        secondary: "#fafcfb ",
        accent: "#3c5451 ",
        background: "#fafcfb ",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          default: "1340px",
          sm: "100%",
          md: "100%",
          lg: "1024px",
          xl: "1280px",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};