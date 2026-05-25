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
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#b8ccff",
          300: "#85a8ff",
          400: "#5a83ff",
          500: "#2f5fff",
          600: "#0046af",
          700: "#003a92",
          800: "#002f78",
          900: "#001c4d",
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
