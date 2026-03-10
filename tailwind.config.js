/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          gold: '#FBBF24',
          red: '#DC2626',
          green: '#16A34A',
        },
        coach: {
          bg: '#FFFFFF',
          card: '#F8FAFC',
          border: '#E2E8F0',
          text: '#0F172A',
        },
      },
      fontFamily: {
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        'poppins-extrabold': ['Poppins_800ExtraBold'],
        'poppins-black': ['Poppins_900Black'],
      },
    },
  },
  plugins: [],
}
