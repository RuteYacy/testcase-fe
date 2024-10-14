/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blueDark: "#4645ff",
        blueLight: "#7d7cff",
        whitePrimary: "#f8fafc",
        gray: '#aeb7c6',
        black: '#09090b'
      },
      fontFamily: {
        'mulish-black': ['Mulish-Black', 'sans-serif'],
        'mulish-black-italic': ['Mulish-BlackItalic', 'sans-serif'],
        'mulish-bold': ['Mulish-Bold', 'sans-serif'],
        'mulish-bold-italic': ['Mulish-BoldItalic', 'sans-serif'],
        'mulish-extra-bold': ['Mulish-ExtraBold', 'sans-serif'],
        'mulish-extra-bold-italic': ['Mulish-ExtraBoldItalic', 'sans-serif'],
        'mulish-extra-light': ['Mulish-ExtraLight', 'sans-serif'],
        'mulish-extra-light-italic': ['Mulish-ExtraLightItalic', 'sans-serif'],
        'mulish-italic': ['Mulish-Italic', 'sans-serif'],
        'mulish-light': ['Mulish-Light', 'sans-serif'],
        'mulish-light-italic': ['Mulish-LightItalic', 'sans-serif'],
        'mulish-medium': ['Mulish-Medium', 'sans-serif'],
        'mulish-medium-italic': ['Mulish-MediumItalic', 'sans-serif'],
        'mulish-regular': ['Mulish-Regular', 'sans-serif'],
        'mulish-semi-bold': ['Mulish-SemiBold', 'sans-serif'],
        'mulish-semi-bold-italic': ['Mulish-SemiBoldItalic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
