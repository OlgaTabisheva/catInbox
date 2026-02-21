'use client';
import { useOptimistic, startTransition, useState } from 'react';
import Link from 'next/link';
import { deleteRecipe } from '../actions';
import { useTranslation } from '../TranslationProvider';

interface Recipe {
    id: number;
    title: string;
    ingredients: string[];
    steps: string;
    isFavorite: boolean;
}

export default function RecipeList({ initialRecipes, allProducts }: { initialRecipes: Recipe[], allProducts: any[] }) {
    const t = useTranslation();
    const [recipes, setRecipes] = useOptimistic(
        initialRecipes,
        (state, newRecipes: Recipe[]) => newRecipes
    );
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const checkAvailability = (ingredient: string) => {
        const lowerIng = ingredient.toLowerCase();
        return allProducts.some(p =>
            p.inStock &&
            (lowerIng.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(lowerIng))
        );
    };

    const handleDelete = async (id: number) => {
        const newRecipes = recipes.filter(r => r.id !== id);
        startTransition(() => {
            setRecipes(newRecipes);
        });
        await deleteRecipe(id);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => {
                const ings = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
                const availableCount = ings.filter(checkAvailability).length;
                const totalCount = ings.length;
                const isReady = availableCount === totalCount && totalCount > 0;

                return (
                    <Link
                        key={recipe.id}
                        href={`/recipes/${recipe.id}`}
                        className="group bg-sand20 p-4 md:p-6 rounded-3xl shadow-sm border border-sand30 hover:shadow-md hover:border-primary100 transition-all cursor-pointer relative flex justify-between items-start"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {isReady && <span className="text-xs font-black text-primary100 bg-sandColorful20 px-2 py-0.5 rounded-full uppercase tracking-tighter">{t.ready}</span>}
                                <span className={`text-xs font-bold ${availableCount === totalCount ? 'text-primary100' : 'text-sand80'}`}>
                                    {t.ingredients}: {availableCount}/{totalCount}
                                </span>
                            </div>
                            <h3 className="font-heading font-bold text-xl text-sand80 mb-2 group-hover:text-primary100 transition-colors">{recipe.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {ings.slice(0, 3).map((ing, i) => (
                                    <span key={i} className={`text-xs font-bold px-2 py-1 rounded-lg ${checkAvailability(ing) ? 'bg-sand10 text-primary100 border border-sand30' : 'bg-sandColorful10 text-sand80 opacity-60'}`}>
                                        {ing}
                                    </span>
                                ))}
                                {ings.length > 3 && (
                                    <span className="text-xs font-bold px-2 py-1 bg-sand10 text-sand80 rounded-lg">
                                        +{ings.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {confirmDeleteId === recipe.id ? (
                                <div className="absolute inset-0 bg-sand20/95 z-50 rounded-3xl flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-200">
                                    <p className="font-bold text-slate-800 mb-2 text-sm">{t.deleteConfirm} «{recipe.title}»?</p>
                                    <div className="flex gap-2 w-full justify-center">
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDeleteId(null); }}
                                            className="px-4 py-1.5 rounded-lg bg-slate-200 font-bold text-slate-600 hover:bg-slate-300 text-xs"
                                        >
                                            {t.no}
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(recipe.id); }}
                                            className="px-4 py-1.5 rounded-lg bg-primary100 font-bold text-white hover:bg-primary140 text-xs"
                                        >
                                            {t.yes}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setConfirmDeleteId(recipe.id);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-sand10 border border-sand30 text-primary100 hover:bg-primary100 hover:text-white transition-colors relative z-20"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
