/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// src/tailwind.config.js
const { nextui } = require('@nextui-org/react');

// Corrected tailwind.config.js
module.exports = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      prefix: 'nextui',
      addCommonColors: false,
      defaultTheme: 'dark',
      defaultExtendTheme: 'dark',
    }),
  ],
};
