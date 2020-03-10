// eslint-disable-next-line no-undef
module.exports = {
  plugins: [
    'tailwindcss',
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? [
        '@fullhuman/postcss-purgecss',
        {
          content: [
            './pages/**/*.{js,jsx,ts,tsx}',
            './components/**/*.{js,jsx,ts,tsx}',
          ],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        },
      ]
      : undefined,
  ],
};
