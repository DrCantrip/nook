/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EBF2FA",
          600: "#3A6A9A",
          900: "#1A3A5C",
        },
        teal: {
          bg: "#F0FDFA",
          text: "#134E4A",
        },
        warmstone: "#F5F4F0",
      },
      borderRadius: {
        card: "16px",
        button: "10px",
        badge: "6px",
        input: "12px",
        modal: "20px",
      },
    },
  },
  plugins: [],
};
