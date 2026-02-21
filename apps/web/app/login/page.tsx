'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '../actions';
import { useSearchParams } from 'next/navigation';
import catIcon from '../../assets/hello.svg';
import { useTranslation } from '../TranslationProvider';

export default function LoginPage() {
    const t = useTranslation();
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    return (
        <div className="flex h-screen items-center justify-center bg-sand10">
            <div className="w-full max-w-md bg-sand20 p-8 rounded-3xl shadow-xl border border-sand30">
                <h1 className="text-3xl font-heading font-black text-center mb-6 text-sand80 uppercase tracking-tight">
                    {t.login} 🐾
                </h1>
                <img src={catIcon.src} alt="Cat" className="w-50 h-50 mx-auto mb-6 block object-contain" />
                <form action={dispatch} className="space-y-4">

                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                    <div>
                        <label className="block text-sm font-bold text-sand80 mb-2 font-heading">Email</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl bg-white border border-sand30 focus:outline-none focus:ring-2 focus:ring-primary100/50"
                            type="email"
                            name="email"
                            placeholder="user@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-sand80 mb-2 font-heading">Пароль</label>
                        <input
                            className="w-full px-4 py-3 rounded-xl bg-white border border-sand30 focus:outline-none focus:ring-2 focus:ring-primary100/50"
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
            className="w-full bg-primary100 hover:bg-primary140 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wide"
            aria-disabled={pending}
        >
            {pending ? (
                <>
                    <span className="animate-spin">⚙️</span> ...
                </>
            ) : '🔑'}
        </button>
    );
}
