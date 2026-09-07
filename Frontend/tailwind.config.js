/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // One type family. Display weight is carried by weight + tracking, not a second font.
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // COLOR LOCK: neutral zinc base + exactly one accent (deep rose). Nothing else.
      colors: {
        accent: {
          50: "#fff1f3",
          100: "#ffe4e9",
          200: "#fecdd6",
          300: "#fda4b6",
          400: "#fb7191",
          500: "#f43f6e",
          600: "#e11d54",
          700: "#be123f",
          800: "#9f1239",
          900: "#881337",
        },
      },
      // SHAPE LOCK: cards = rounded-2xl (16px), interactive = rounded-full. No other radii.
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
