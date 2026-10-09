import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B2545', 800: '#10305a', 700: '#16407a', 600: '#1d4e89', 100: '#e4ecf6', 50: '#f1f5fa' },
        gold: { DEFAULT: '#B8892B', 600: '#9a7220', 100: '#f6ecd3' },
        teal: { DEFAULT: '#0F766E', 700: '#0b5d57', 100: '#d7efec' },
        paper: '#F7F6F2',
        ink: { DEFAULT: '#1c2430', soft: '#4a5565', mute: '#6b7686' },
        line: '#e3e1da',
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', '"Book Antiqua"', 'Georgia', 'serif'],
        sans: ['Inter', '"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      maxWidth: { page: '1180px' },
      boxShadow: { card: '0 1px 2px rgba(11,37,69,.06), 0 4px 16px rgba(11,37,69,.04)' },
    },
  },
  plugins: [],
};

export default config;
