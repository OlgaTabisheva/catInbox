'use client';
import { useState, useTransition } from 'react';
import { addProduct } from '../app/actions';
export default function AddProductButton({ location }: { location: 'fridge' | 'pantry' }) {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [isPending, startTransition] = useTransition();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        startTransition(async () => {
            await addProduct(name, location);
            setName('');
            setIsAdding(false);
        });
    };
    if (isAdding) {
        return (
            <div className="flex flex-col items-center justify-center p-6 border-4 border-dashed border-blue-300 bg-blue-50 rounded-3xl h-full min-h-[16rem] transition-colors">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                    <label className="text-center font-heading font-bold text-blue-500 mb-1">
                        Новый продукт
                    </label>
                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Название..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:outline-none focus:border-blue-400 text-center font-medium"
                        disabled={isPending}
                        required
                        minLength={2}
                        maxLength={50}
                    />
                    <div className="flex gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="flex-1 py-2 rounded-xl bg-slate-200 text-slate-600 font-bold hover:bg-slate-300 transition-colors"
                            disabled={isPending}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50"
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
            className="flex flex-col items-center justify-center p-6 border-4 border-dashed border-slate-300 rounded-3xl h-full min-h-[16rem] hover:bg-slate-50 transition-colors text-slate-400 group cursor-pointer"
        >
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 group-hover:bg-slate-300 transition-colors">
                <span className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">+</span>
            </div>
            <span className="text-lg font-bold font-heading">Добавить</span>
        </button>
    );
}
