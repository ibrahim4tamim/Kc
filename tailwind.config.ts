import type { Config } from "tailwindcss";

// ألوان الهوية الرسمية — من ورقة هوية كواليس الصين
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F5EF",
        "china-red": "#CC2828",
        gold: "#C9A24A",
        "gold-deep": "#B88A2D",
        charcoal: "#222222",
      },
      fontFamily: {
        arabic: [
          "IBM Plex Sans Arabic",
          "Tajawal",
          "Segoe UI",
          "Tahoma",
          "Arial",
          "sans-serif",
        ],
        latin: ["Montserrat", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(34,34,34,0.04), 0 8px 24px rgba(34,34,34,0.06)",
        "card-hover": "0 2px 4px rgba(34,34,34,0.06), 0 16px 40px rgba(34,34,34,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
