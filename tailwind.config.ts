import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#B08463",   // Brand Primary
                secondary: "#714329", // Darker Brand
                accent: "#B9937B",    // Accent
                soft: "#D0B9A7",      // Soft Beige
                input: "#E5E5E5",     // Light Grey Inputs
                "base-black": "#141414",
                "base-white": "#FFFFFF",
            },
            fontFamily: {
                sans: ["var(--font-outfit)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
