import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  safelist: ["xl:grid-cols-13", "grid-cols-13"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#0c2a4d",
        },
        xcel: {
          50:  "#f0faf9",
          100: "#d6ecea",
          200: "#a8d4d0",
          300: "#72b5af",
          400: "#3e918a",
          500: "#0d6e68",
          600: "#0d5c55",
          700: "#0d3b3a",
          800: "#082e2d",
          900: "#062825",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          900: "#0b1220",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
        ],
      },
      boxShadow: {
        card: "0 18px 45px -28px rgba(15,23,42,0.35), 0 10px 30px -22px rgba(13,148,136,0.22)",
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
export default config;
