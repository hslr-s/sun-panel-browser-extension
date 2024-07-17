/** @type {import('tailwindcss').Config} */
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  content: [
    './entrypoints/**/*.{html,js,ts,vue}',
    './components/**/*.{html,js,ts,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}

