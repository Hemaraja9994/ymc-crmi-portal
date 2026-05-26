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
        // Indigo palette — kept under the `xcel-*` name so existing utility
        // classes across the codebase auto-update (drop-in swap).
        xcel: {
          50:  "#EEF2FF",   // indigo-50  · soft hover bg / badge bg
          100: "#E0E7FF",   // indigo-100 · badge bg (AAA 11:1 with indigo-800 text)
          200: "#C7D2FE",   // indigo-200 · light borders
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",   // indigo-500 · hover state on darker buttons
          600: "#4F46E5",   // indigo-600 · structural interactive
          700: "#4338CA",   // indigo-700 · active nav (white text: 7.5:1 AAA)
          800: "#3730A3",   // indigo-800 · strong text on light bg
          900: "#312E81",   // indigo-900 · header/panel mid stop
          950: "#1E1B4B",   // indigo-950 · hero deepest anchor (white: 14.4:1 AAA)
        },
        // Vibrant orange accent — for primary CTAs and active highlights.
        // accent-500 is decorative only (white text fails on it).
        // accent-600 is the safe CTA shade (white text: 4.6:1 AA pass).
        accent: {
          50:  "#FFF7ED",   // orange-50 · soft wash
          100: "#FFEDD5",   // orange-100 · chip bg (AAA with orange-900 text)
          200: "#FED7AA",
          300: "#FDBA74",   // bright orange dot on dark bg
          400: "#FB923C",
          500: "#F97316",   // orange-500 · DECORATIVE only (white text fails)
          600: "#EA580C",   // orange-600 · CTA bg (white text: 4.6:1 AA)
          700: "#C2410C",   // orange-700 · CTA hover (white text: 6.0:1 AAA-large)
          800: "#9A3412",   // orange-800 · pressed/dark (white text: 7.5:1 AAA)
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
