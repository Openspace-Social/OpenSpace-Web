module.exports = {
  purge: [
      './components/**/*.{vue,js}',
      './layouts/**/*.{vue,js}',
      './pages/**/*.{vue,js}',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
