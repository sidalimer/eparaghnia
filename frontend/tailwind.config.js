module.exports = {
    content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Open Sans"', 'sans-serif'],
          heading: ['Montserrat', 'sans-serif'],
          mono: ['"Roboto Mono"', 'monospace'],
        },
        colors: {
          primary: '#4CAF50',
          accent: '#2C3E50',
          background: '#F4F6F7',
          danger: '#E74C3C',
          success: '#27AE60',
          textMain: '#333333',
        },
        borderRadius: {
          xl: '12px',
        },
      },
    },
    plugins: [],
  };
  