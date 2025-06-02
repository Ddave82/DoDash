module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dodash-dark': '#121212',
        'dodash-darker': '#0A0A0A',
        'dodash-purple': '#8B5CF6',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #121212, #1A1A1A)',
      }
    },
  },
  plugins: [],
}
