function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    } else {
      return `rgb(var(${variableName}))`;
    }
  };
}
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1780px',
      '4xl': '2160px', // only need to control product grid mode in ultra 4k device
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#478CBF',
          dark: '#5FBBFF',
        },
        linkedin: {
          blue: '#0A66C2', // LinkedIn Blue
          white: '#FFFFFF', // White
          lightblue: '#D6F2FF', // Light Blue
          gray: '#B2B2B2', // Gray
          darkblue: '#0A56A8', // Dark Blue
        },
        light: {
          DEFAULT: '#ffffff',
          base: '#646464',
          100: '#f9f9f9',
          200: '#f2f2f2',
          300: '#ededed',
          400: '#e6e6e6',
          500: '#dadada',
          600: '#d2d2d2',
          780: '#478CBF',
          800: '#bcbcbc',
          900: '#a8a8a8',
        },
        dark: {
          DEFAULT: '#000000',
          base: '#a5a5a5',
          100: '#181818',
          200: '#212121',
          250: '#252525',
          300: '#2a2a2a',
          350: '#2b2b2b',
          400: '#323232',
          450: '#2e2e2e',
          500: '#3e3e3e',
          600: '#4a4a4a',
          700: '#6e6e6e',
          750: '#585858',
          780: '#5FBBFF',
          800: '#808080',
          850: '#989898',
          900: '#999999',
          950: '#2b2b2b',
        },
        blue: {
          DEFAULT: '#478CBF', // Default blue color
          light: '#85D7FF',
          dark: '#004085',
          100: '#EBF8FF',
          200: '#BEE3F8',
          300: '#90CDF4',
          400: '#63B3ED',
          500: '#4299E1',
          600: '#3182CE',
          700: '#2B6CB0',
          800: '#2C5282',
          900: '#2A4365',
        },
        green: {
          DEFAULT: '#63AF21', // Default green color
          light: '#A7D77D',
          dark: '#39620E',
          100: '#E3F4C8',
          200: '#C0E299',
          300: '#97D56B',
          400: '#63AF21',
          500: '#559E1C',
          600: '#4B8718',
          700: '#3E7013',
          800: '#316012',
          900: '#254E10',
        },
        red: {
          DEFAULT: '#FF0000', // Domyślny kolor czerwony
          light: '#FF6B6B',
          dark: '#B30000',
          100: '#FFF5F5',
          200: '#FED7D7',
          300: '#FFB3B3',
          400: '#FF7F7F',
          500: '#FF0000',
          600: '#E53E3E',
          700: '#C53030',
          800: '#9B2C2C',
          900: '#63171B',
        },
        mustard: {
          DEFAULT: '#C67816', // Default mustard yellow
          light: '#E4A849',
          dark: '#9A5B12',
          100: '#F9F0D7',
          200: '#F1E09B',
          300: '#E4C45B',
          400: '#D6B31D',
          500: '#C67816',
          600: '#B26512',
          700: '#9A5B12',
          800: '#7F4A0F',
          900: '#5C390C',
        },
        mint: {
          DEFAULT: '#5AFBA9', // Default mint green
          light: '#8CFFD5',
          dark: '#42D78A',
          100: '#E0F8F1',
          200: '#C2F0E3',
          300: '#A3E8D5',
          400: '#7DE0C7',
          500: '#5AFBA9',
          600: '#42D78A',
          700: '#35B872',
          800: '#2A9F5B',
          900: '#1D7D46',
        },
        warning: '#e66767',
        wishlist_price: '#ffffff1a',
        'border-50': withOpacity('--color-border-50'),
        'border-100': withOpacity('--color-border-100'),
        'border-200': withOpacity('--color-border-200'),
        'border-base': withOpacity('--color-border-base'),
      },
      boxShadow: {
        card: '0px 0px 6px rgba(79, 95, 120, 0.1)',
        dropdown: '0px 10px 32px rgba(46, 57, 72, 0.2)',
        'bottom-nav': '0 -2px 3px rgba(0, 0, 0, 0.08)',
      },
      fontSize: {
        '10px': '.625rem',
        '13px': '13px',
        '15px': '15px',
      },
      fontFamily: {
        body: ['var(--font-inter)', 'sans-serif'],
        adlib: ['var(--font-adlib)', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
