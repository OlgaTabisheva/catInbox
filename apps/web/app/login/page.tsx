'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '../actions';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h1 className="text-3xl font-heading font-black text-center mb-6 text-slate-800">
                    Вход в Кото-Учёт 😺
                </h1>
                <form action={dispatch} className="space-y-4">
                    { }
                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Email</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="email"
                            name="email"
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-2">Пароль</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="password"
                            name="password"
                            placeholder="******"
                            required
                            minLength={6}
                        />
                    </div>
                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100 animate-pulse">
                            ⚠️ {errorMessage}
                        </div>
                    )}
                    <LoginButton />
                    <div className="text-center mt-4">
                        <p className="text-xs text-slate-400">
                            Нет аккаунта? Попросите администратора (меня) создать его.
                            <br />
                            (или используйте <b>admin@example.com</b> / <b>password123</b>)
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            aria-disabled={pending}
        >
            {pending ? (
                <>
                    <span className="animate-spin">⚙️</span> Входим...
                </>
            ) : 'Войти'}
        </button>
    );
}
