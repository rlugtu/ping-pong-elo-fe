/** @type {import('tailwindcss').Config} */
export default {
    content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    theme: {
        extend: {
            animation: {
                fadeIn: 'fadeIn 0.3s ease-in-out'
            },
            fontFamily: {
                unbounded: [
                    '"Unbounded"',
                    'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
                ]
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
