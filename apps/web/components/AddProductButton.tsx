'use client';
import { useState, useTransition } from 'react';
import { addProduct } from '../app/actions';
import { useTranslation } from '../app/TranslationProvider';

export default function AddProductButton({ location }: { location: 'fridge' | 'pantry' }) {
    const t = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [isPending, startTransition] = useTransition();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setErrorMsg(null);
        startTransition(async () => {
            try {
                await addProduct(name, location);
                setName('');
                setIsAdding(false);
            } catch (e: any) {
                setErrorMsg(e.message);
            }
        });
    };
    if (isAdding) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border-2 border-sand30 bg-sand20 rounded-3xl h-full min-h-[12rem] transition-colors shadow-sm">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
                    <label className="text-center font-heading font-bold text-primary140 mb-1 text-sm">
                        {t.newProduct}
                    </label>
                    {errorMsg && (
                        <p className="text-[10px] text-error font-bold text-center bg-red-100 rounded p-1">
                            {errorMsg}
                        </p>
                    )}
                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Название..."
                        className="w-full px-3 py-2 rounded-lg border-2 border-sand30 focus:outline-none focus:border-primary100 text-center text-sm font-medium"
                        disabled={isPending}
                        required
                        minLength={2}
                        maxLength={50}
                    />
                    <div className="flex gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="flex-1 py-1.5 rounded-lg bg-error text-white font-bold hover:bg-red-600 transition-colors text-xs"
                            disabled={isPending}
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-1.5 rounded-lg bg-primary100 text-white font-bold hover:bg-primary140 transition-colors shadow-sm disabled:opacity-50 text-xs"
                            disabled={isPending}
                        >
                            {isPending ? '...' : 'OK'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
    return (
        <button
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-sand40 rounded-3xl h-full min-h-[12rem] bg-sand10 hover:bg-sand20 transition-all text-sand60 group cursor-pointer hover:shadow-md hover:border-primary100"
        >
            <div className="w-10 h-10 rounded-full bg-primary100 flex items-center justify-center mb-2 group-hover:bg-primary140 transition-colors">
                <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">+</span>
            </div>
            <span className="text-sm font-bold font-heading">{t.add}</span>
        </button>
    );
}
