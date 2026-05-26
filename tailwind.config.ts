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
        // Plum/violet palette — kept under the `xcel-*` name so existing
        // utility classes across the codebase auto-update (drop-in swap).
        xcel: {
          50:  "#FAF5FF",   // purple-50 · very light wash
          100: "#F3E8FF",   // purple-100 · badge bg (AAA 11:1 with xcel-900 text)
          200: "#E9D5FF",   // purple-200 · light borders
          300: "#D8B4FE",
          400: "#C084FC",   // purple-400 · soft lavender on dark surfaces
          500: "#A855F7",   // purple-500
          600: "#9333EA",   // purple-600
          700: "#6D28D9",   // violet-700 · active nav (white text: 7.4:1 AAA)
          800: "#5B21B6",   // violet-800 · strong text on light bg
          900: "#4C1D95",   // violet-900 · header/panel mid stop
          950: "#2E1065",   // violet-950 · hero deepest anchor (white: 15.2:1 AAA)
        },
        // Lavender/violet accent — for primary CTAs and active highlights.
        // accent-700 is the safe CTA shade (white text passes AAA-large).
        accent: {
          50:  "#FAF5FF",
          100: "#F3E8FF",   // soft chip bg
          200: "#E9D5FF",
          300: "#D8B4FE",   // soft lavender highlight
          400: "#C084FC",   // bright lavender on dark bg (decorative)
          500: "#A855F7",   // vibrant lavender — decorative only
          600: "#9333EA",
          700: "#7E22CE",   // purple-700 · CTA bg (white text: 6.9:1 AAA-large)
          800: "#6B21A8",   // CTA hover (white: 8.5:1 AAA)
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
