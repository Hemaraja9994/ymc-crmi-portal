import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
        card: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
