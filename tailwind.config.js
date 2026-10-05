/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0084ff",
        "primary-light": "#e8f3ff",
        "primary-container": "#0073df",
        surface: "#f8f9fe",
        "on-surface": "#0f172a",
        "on-surface-variant": "#64748b",
        "surface-container": "#f1f5f9",
        "surface-card": "#ffffff",
        "accent-green": "#10b981",
        "accent-amber": "#f59e0b",
        "accent-purple": "#8b5cf6",
      },
    },
  },
  plugins: [],
};
