/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral dark background for most pages
        darkBg: "#1c1c1e", // Charcoal gray

        // Gold is the brand accent color used for buttons, icons, etc.
        gold: "#cc9c07",

        // Dark green used for sections and emphasized areas
        dark: "#005249",

        // Brown used for minor details (e.g., borders, dividers)
        brown: "#846c3d",
      },
    },
  },
};
