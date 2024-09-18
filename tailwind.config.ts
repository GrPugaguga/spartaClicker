import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'roman-gold': '#FFD700',
        'roman-black': '#1A1A1A',
        'roman-wood': '#8B4513',
        'roman-red': '#8B0000', 
      },
      fontFamily: {
        'roman': ['Trajan Pro', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
