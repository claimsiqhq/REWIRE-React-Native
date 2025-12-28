/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // REWIRE Brand Colors - Deep Forest Theme
        background: "#1E1E2E",
        foreground: "#E8E6E3",
        card: {
          DEFAULT: "#2D2D3D",
          foreground: "#E8E6E3",
        },
        primary: {
          DEFAULT: "#4A7C59",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2D4A3E",
          foreground: "#E8E6E3",
        },
        accent: {
          DEFAULT: "#8FBC8B",
          foreground: "#1E1E2E",
        },
        muted: {
          DEFAULT: "#3D3D4D",
          foreground: "#A0A0A0",
        },
        destructive: {
          DEFAULT: "#DC3545",
          foreground: "#FFFFFF",
        },
        border: "#3D3D4D",
        input: "#3D3D4D",
        ring: "#4A7C59",
        // Mood colors
        mood: {
          great: "#4A7C59",
          good: "#8FBC8B",
          okay: "#F5DEB3",
          low: "#DAA520",
          rough: "#CD5C5C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
