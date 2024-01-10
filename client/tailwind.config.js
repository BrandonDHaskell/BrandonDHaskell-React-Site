/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
        keyframes: {
            slideIn: {
                "0%": { transform: "translateX(100%)", opacity: 0 },
                "100%": { transform: "translateX(0)", opacity: 1 }
            }
        },
        animation: {
            slideIn: "slideIn 1s ease-out"
        }
    },
  },
  plugins: [],
}

