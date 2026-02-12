import type { NextAuthConfig } from 'next-auth';
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const onRestrictedPage = nextUrl.pathname.startsWith('/create') || nextUrl.pathname.startsWith('/edit');
            if (onRestrictedPage) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
