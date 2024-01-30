/** @type {import('tailwindcss').Config} */
export default {
    content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    theme: {
        extend: {
            animation: {
                fadeIn: 'fadeIn 0.3s forwards'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0, transform: 100 },
                    '100%': { opacity: 100, transform: 0 }
                }
            }
        }
    },
    plugins: []
}
