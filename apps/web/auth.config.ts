import type { NextAuthConfig } from 'next-auth';
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtected =
                nextUrl.pathname === '/' ||
                nextUrl.pathname.startsWith('/fridge') ||
                nextUrl.pathname.startsWith('/pantry') ||
                nextUrl.pathname.startsWith('/shopping-list') ||
                nextUrl.pathname.startsWith('/recipes') ||
                nextUrl.pathname.startsWith('/create') ||
                nextUrl.pathname.startsWith('/edit');

            if (isProtected) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
