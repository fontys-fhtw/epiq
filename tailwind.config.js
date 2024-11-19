/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Customer-Side Colors
        teal: {
          50: "#e6fffa",
          100: "#b2f5ea",
          200: "#81e6d9",
          300: "#4fd1c5",
          400: "#38b2ac",
          500: "#319795", // Primary
          600: "#2c7a7b",
          700: "#285e61",
          800: "#234e52",
          900: "#1d4044",
        },
        amber: {
          50: "#fff8e1",
          100: "#ffecb3",
          200: "#ffe082",
          300: "#ffd54f",
          400: "#ffca28",
          500: "#ffc107", // Secondary
          600: "#ffb300",
          700: "#ffa000",
          800: "#ff8f00",
          900: "#ff6f00",
        },
        coral: {
          500: "#ff6b6b",
          600: "#fa5252",
          700: "#f03e3e",
          800: "#e03131",
          900: "#c92a2a",
        },
        olive: {
          500: "#a3d900",
          600: "#94c700",
          700: "#82b500",
          800: "#739300",
          900: "#627200",
        },
        // Admin-Side Colors
        navy: {
          500: "#2c3e50", // Primary
          600: "#273c5a",
          700: "#223451",
          800: "#1c2e40",
          900: "#162930",
        },
        slate: {
          500: "#64748b", // Secondary
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        crimson: {
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#450a0a",
        },
        lime: {
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
        },
        // Common Colors
        charcoal: "#333333",
        offwhite: "#f9fafb",
        black: "#000000",
        white: "#ffffff",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
        // Add other font families if needed
      },
      // You can customize other properties like spacing, borderRadius, etc.
    },
  },
  plugins: [
    // Optional: Add Tailwind CSS plugins if needed
    "@tailwindcss/forms", // For better form styling
    "@tailwindcss/typography", // For prose styling
  ],
};
