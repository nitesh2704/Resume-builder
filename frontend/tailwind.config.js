/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        verdant: {
          primary: '#1F7A4C',
          secondary: '#4ADE80',
          tertiary: '#DCFCE7',
          light: '#F6FBF8',
          dark: '#0B1F17',
          'dark-panel': 'rgb(4 11 18)',
          border: '#bbf7d0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 18px 45px rgba(31, 122, 76, 0.24)',
        'glow-green': '0 0 25px rgba(74, 222, 128, 0.2)',
        card: '0 20px 60px rgba(11, 31, 23, 0.08)'
      }
    }
  },
  plugins: []
}
