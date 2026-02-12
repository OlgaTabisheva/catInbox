import { getRecipeById, getAllProducts } from '../../actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
interface PageProps {
    params: Promise<{ id: string }>;
}
export default async function RecipeDetailPage({ params }: PageProps) {
    const { id } = await params;
    const [recipe, allProducts] = await Promise.all([
        getRecipeById(parseInt(id)),
        getAllProducts()
    ]);
    if (!recipe) {
        notFound();
    }
    const checkAvailability = (ingredient: string) => {
        const lowerIng = ingredient.toLowerCase();
        return allProducts.some(p =>
            p.inStock &&
            (lowerIng.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(lowerIng))
        );
    };
    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <Link href="/recipes" className="inline-flex items-center text-slate-500 hover:text-purple-600 font-bold transition-colors">
                    ← Назад к рецептам
                </Link>
                <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="inline-flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                >
                    ✏️ Редактировать
                </Link>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-100">
                <h1 className="text-4xl font-heading font-black text-slate-800 mb-6 text-center">{recipe.title}</h1>
                <div className="mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                    <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                        🛒 Ингредиенты
                    </h3>
                    <ul className="space-y-3">
                        {(recipe.ingredients as string[]).map((ing, idx) => {
                            const isAvailable = checkAvailability(ing);
                            return (
                                <li key={idx} className="flex items-center justify-between text-slate-700 font-medium p-2 rounded-xl hover:bg-white/50 transition-colors">
                                    <div className="flex items-center">
                                        <span className={`w-3 h-3 rounded-full mr-3 ${isAvailable ? 'bg-green-500 ring-4 ring-green-100' : 'bg-red-400 ring-4 ring-red-100'}`}></span>
                                        <span className={isAvailable ? 'text-slate-700' : 'text-slate-400'}>{ing}</span>
                                    </div>
                                    {isAvailable ? (
                                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">ЕСТЬ</span>
                                    ) : (
                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">НЕТ</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
                        👨‍🍳 Приготовление
                    </h3>
                    <div className="prose prose-purple max-w-none text-slate-600 leading-relaxed whitespace-pre-line font-medium bg-slate-50 p-6 rounded-2xl">
                        {recipe.steps}
                    </div>
                </div>
            </div>
        </div>
    );
}
