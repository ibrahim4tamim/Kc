import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F5EF",
        "china-red": "#C62828",
        gold: "#B88A2D",
        charcoal: "#222222",
      },
      fontFamily: {
        arabic: [
          "Tajawal",
          "IBM Plex Sans Arabic",
          "Segoe UI",
          "Tahoma",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
