import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        homerun: {
          green: "#1a7a3a",
          "green-hover": "#15632e",
          "green-dark": "#0d4a22",
          "green-light": "#e8f5ec",
          "bubble-user": "#d4edbc",
          yellow: "#f5c518",
          "yellow-light": "#fef9e7",
        },
        whatsapp: {
          header: "#075e54",
          teal: "#128c7e",
          accent: "#25d366",
          bg: "#ece5dd",
          user: "#dcf8c6",
          incoming: "#ffffff",
          dark: "#111b21",
          muted: "#667781",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-devanagari)", "var(--font-noto-telugu)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
