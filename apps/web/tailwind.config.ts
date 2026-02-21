import type { Config } from "tailwindcss";


const theme = {
    colors: {
        white: '#FFFFFF',
        primary100: '#6A8323',
        primary140: '#55691C',
        primarydark100: '#323232',
        primarydark120: '#000000',
        primary: '#4ade80',
        primaryHover: '#22c55e',
        secondary: '#f87171',
        secondaryHover: '#ef4444',
        sand80: '#655D45',
        sand80opacity: 'rgb(101, 93, 69, 0.2)',
        sand60: '#726A54',
        sand40: '#A49B82',
        sand30: '#F2E4B8',
        sand20: '#F9ECC5',
        sandColorful100: '#8B590D',
        sandColorful80: '#AF9F74',
        sandColorful30: '#EFD9A0',
        sandColorful20: '#FFEEC1',
        sandColorful10: '#FFF6DE',
        accent15fill: '#FFE4DB',
        error: '#EA3E27',
        warning: '#F6990C',
        success: '#53902D',
        light: '#fdfdfd',
        card: '#ffffff',
        dark: '#1e293b',
        sand10: '#FCF1D5',
        shadow1: '0px 8px 32px 0px #56340052',
        shadow2: '0px 4px 16px 0px #56340014',
        shadowCard: '0px 4px 16px 0px rgba(86, 52, 0, 0.08)',
        shadowPopup: '0px 8px 32px 0px rgba(86, 52, 0, 0.20)',
        primary40pastthough: 'rgb(106, 131, 35, 0.4)',
        primary20pastthough: 'rgb(106, 131, 35, 0.2)',
        primary10pastthough: 'rgb(106, 131, 35, 0.1)',
        primary8pastthough: 'rgb(106, 131, 35, 0.08)',
        buttonColor: '#FFDCBF',
        background: {
            light: '#fdfdfd',
            card: '#ffffff',
            dark: '#1e293b',
            sand10: '#FCF1D5',
            primary100: '#6A8323',
            primary140: '#55691C',
        },
        text: {
            primary: '#334155',
            secondary: '#64748b',
            light: '#f8fafc',
        },
        accents: {
            orange: '#fb923c',
            blue: '#60a5fa',
            accent100: '#FC4C0E',
            accent120: '#E14610',
            accent140: '#BB3A0C',
            accent30opacity: 'rgb(252, 76, 0, 0.30)',
            accent15opacity: 'rgb(252, 76, 0, 0.15)',
            accent8opacity: 'rgb(252, 76, 0, 0.08)',
        }
    },
    borderRadius: {
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        soft: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    fonts: {
        body: ['var(--font-nunito)', 'ui-sans-serif', 'system-ui'],
        heading: ['var(--font-nunito)', 'ui-sans-serif', 'system-ui'],
    }
};

const { background, ...otherColors } = theme.colors;
const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ...otherColors,
                background: background.light,
                'background-light': background.primary100,
                'background-dark': background.primary140,
                'background-card': background.sand10,
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
