'use client';
import { useOptimistic, startTransition } from 'react';
import Link from 'next/link';
import { deleteRecipe } from '../actions';

interface Recipe {
    id: number;
    title: string;
    ingredients: string[];
    steps: string;
    isFavorite: boolean;
}

export default function RecipeList({ initialRecipes, allProducts }: { initialRecipes: Recipe[], allProducts: any[] }) {
    const [recipes, setRecipes] = useOptimistic(
        initialRecipes,
        (state, newRecipes: Recipe[]) => newRecipes
    );

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
                        className="group bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer relative flex justify-between items-start"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {isReady && <span className="text-xs font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">Можно готовить!</span>}
                                <span className={`text-xs font-bold ${availableCount === totalCount ? 'text-green-500' : 'text-slate-400'}`}>
                                    Ингредиенты: {availableCount}/{totalCount}
                                </span>
                            </div>
                            <h3 className="font-heading font-bold text-xl text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{recipe.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {ings.slice(0, 3).map((ing, i) => (
                                    <span key={i} className={`text-xs font-bold px-2 py-1 rounded-lg ${checkAvailability(ing) ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-100 text-slate-500'}`}>
                                        {ing}
                                    </span>
                                ))}
                                {ings.length > 3 && (
                                    <span className="text-xs font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded-lg">
                                        +{ings.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (confirm('Удалить рецепт?')) handleDelete(recipe.id);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors relative z-20"
                            >
                                ✕
                            </button>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
