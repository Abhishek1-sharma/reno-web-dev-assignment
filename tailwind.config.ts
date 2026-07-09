import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#17202A",
        paper: "#F7F8FA",
        line: "#D9DEE7",
        accent: "#0F766E",
        danger: "#C2410C"
      }
    }
  },
  plugins: []
};

export default config;
