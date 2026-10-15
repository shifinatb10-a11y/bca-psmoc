import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Department brand palette
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd3ff",
          300: "#8eb5ff",
          400: "#598dff",
          500: "#3366f5",
          600: "#1f47e6",
          700: "#1836c7",
          800: "#1a2fa1",
          900: "#1b2d7f",
          950: "#141d4d",
        },
        gold: {
          400: "#f0b429",
          500: "#de911d",
          600: "#cb6e17",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          500: "#5b6478",
          700: "#333b4d",
          900: "#111726",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,23,38,0.04), 0 8px 24px -12px rgba(17,23,38,0.18)",
        lift: "0 12px 40px -16px rgba(24,54,199,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
