/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#ccff00', // Neon Volt
        secondary: '#8b5cf6', // Electric Violet
        accent: '#f59e0b', // Amber-500
        background: '#09090b', // Deep Zinc
        surface: '#18181b', // Matte Graphite
        dark: {
          900: '#09090b', // Replaced with Deep Zinc
          800: '#18181b', // Replaced with Matte Graphite
          700: '#27272a', // Zinc-800
        },
      },
      fontFamily: {
        heading: ['Outfit_700Bold', 'sans-serif'],
        body: ['Inter_400Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
