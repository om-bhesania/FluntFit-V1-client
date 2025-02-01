import { nextui } from "@nextui-org/react";
import { heroui } from "@heroui/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#424242",
        secondary: "#fafcfb ",
        accent: "#3c5451 ",
        background: "#18181b ",
        danger: "#f31260",
        foreground: "#fafcfb",
        default: {
          foreground: "#fafcfb",
          600: "#fafcfb",
        },
        gray: {
          940: "#2E2E33",
          950: "#0A0A0C",
          960: "#18181b",
        },
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
      fontFamily: {
        body: ["Montserrat", "sans-serif"],
        heading: ["Charm", "cursive"],
        secondary: ["Slabo", "serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
