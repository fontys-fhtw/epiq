/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // gold is to emphasize the brand color
        gold: "#cc9c07",

        // dark is mainly for the background
        dark: "#005249",

        // brown is an extra color when needed
        brown: "#846c3d",
      },
    },
  },
};
