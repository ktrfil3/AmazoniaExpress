/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable dark mode with 'dark' class
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                uber: {
                    50: '#e6f9f0',
                    100: '#b3efd4',
                    200: '#80e5b8',
                    300: '#4ddb9c',
                    400: '#1ad180',
                    500: '#06C167', // Uber Eats Green
                    600: '#05a757',
                    700: '#048d47',
                    800: '#037337',
                    900: '#025927',
                },
                military: {
                    50: '#f4f7f4',
                    100: '#e3ece3',
                    200: '#c5d9c5',
                    300: '#9bbd9b',
                    400: '#729c72',
                    500: '#527e52',
                    600: '#3f633f',
                    700: '#344f34',
                    800: '#2b3f2b',
                    900: '#233323',
                },
                primary: {
                    DEFAULT: '#06C167',
                    foreground: '#ffffff'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'uber': '0 2px 8px rgba(0,0,0,0.08)',
                'uber-lg': '0 4px 16px rgba(0,0,0,0.12)',
            }
        },
    },
    plugins: [],
}
