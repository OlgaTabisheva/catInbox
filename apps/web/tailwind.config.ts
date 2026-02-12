import type { Config } from "tailwindcss";
import { theme } from "../../packages/ui/theme";
const { background, ...otherColors } = theme.colors;
const config: Config = {
    content: [
        "./pages*.{js,ts,jsx,tsx,mdx}",
        "./components*.{js,ts,jsx,tsx,mdx}",
        "./app*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                ...otherColors,
                background: background.light,
                'background-light': background.light,
                'background-dark': background.dark,
                'background-card': background.card,
                foreground: theme.colors.text.primary,
            },
            borderRadius: theme.borderRadius,
            fontFamily: theme.fonts,
            boxShadow: theme.shadows,
        },
    },
    plugins: [],
};
export default config;
