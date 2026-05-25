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
          50:  "#F5FAF9",   // near-white mint tint
          100: "#E6F4F1",   // brand-primary-100 · soft mint – badge bg, hover bg
          200: "#C0DDD8",   // light border tint
          300: "#8ABFB8",
          400: "#4A9A8E",
          500: "#007361",   // interactive-hover
          600: "#008B75",   // interactive-default · primary buttons
          700: "#0B5345",   // brand-primary-700 · active nav, strong accents
          800: "#0A3C36",   // interactive-text · dark labels on light bg
          900: "#062E25",   // brand-primary-900 · hero / panel deepest anchor
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
      animation: {
        "ticker-in": "tickerIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        tickerIn: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
