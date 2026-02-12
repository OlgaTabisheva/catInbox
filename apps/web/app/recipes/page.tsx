import { getRecipes, getAllProducts } from '../actions';
import RecipeList from './RecipeList';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function RecipesPage() {
    const [recipes, allProducts] = await Promise.all([
        getRecipes(),
        getAllProducts()
    ]);
    const formattedRecipes = recipes.map(r => ({
        ...r,
        ingredients: (Array.isArray(r.ingredients) ? r.ingredients : []) as string[]
    }));
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-black text-slate-800">
                    Книга Рецептов 📖
                </h1>
                <Link
                    href="/create"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
                >
                    <span>+</span>
                    <span className="hidden md:inline">Создать</span>
                </Link>
            </div>
            <RecipeList initialRecipes={formattedRecipes} allProducts={allProducts} />
            {recipes.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="text-6xl mb-4">👨‍🍳</div>
                    <p className="font-bold text-slate-500 text-lg">Пока нет рецептов</p>
                    <Link href="/create" className="text-blue-500 font-bold hover:underline mt-2 inline-block">
                        Добавить первый
                    </Link>
                </div>
            )}
        </div>
    );
}
