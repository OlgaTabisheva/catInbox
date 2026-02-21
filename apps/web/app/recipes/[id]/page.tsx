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
    const { getDictionary, getCurrentLang, translateText } = await import('../../../lib/i18n');
    const t = await getDictionary();
    const lang = await getCurrentLang();
    if (!recipe) {
        notFound();
    }

    if (lang === 'en') {
        recipe.title = await translateText(recipe.title, lang);
        recipe.ingredients = await Promise.all((recipe.ingredients as string[]).map(ing => translateText(ing, lang)));
        recipe.steps = await translateText(recipe.steps, lang);
    }

    const translatedProducts = await Promise.all(allProducts.map(async p => {
        if (lang === 'en') {
            return { ...p, originalName: p.name, name: await translateText(p.name, lang) };
        }
        return p;
    }));

    const checkAvailability = (ingredient: string) => {
        const lowerIng = ingredient.toLowerCase();
        return translatedProducts.some(p =>
            p.inStock &&
            (lowerIng.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(lowerIng))
        );
    };
    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <Link href="/recipes" className="inline-flex items-center text-sand80 hover:text-primary100 font-bold transition-colors">
                    ← {t.backToRecipes}
                </Link>
                <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="inline-flex items-center bg-sand10 text-primary100 px-4 py-2 rounded-xl font-bold hover:bg-sand20 border border-sand30 transition-colors shadow-sm"
                >
                    ✏️ {t.edit}
                </Link>
            </div>
            <div className="bg-sand20 rounded-3xl p-4 md:p-8 shadow-xl border-4 border-sand30">
                <h1 className="text-4xl font-heading font-black text-sand80 mb-6 text-center">{recipe.title}</h1>
                <div className="mb-8 p-6 bg-sandColorful10 rounded-2xl border border-sand30">
                    <h3 className="text-xl font-bold text-primary100 mb-4 flex items-center gap-2">
                        🛒 {t.ingredients}
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
                    <h3 className="text-xl font-bold text-sand80 mb-4 flex items-center gap-2">
                        👨‍🍳 {t.howToCook}
                    </h3>
                    <div className="prose prose-stone max-w-none text-sand80 leading-relaxed whitespace-pre-line font-medium bg-sandColorful10/50 p-6 rounded-2xl border border-sand30">
                        {recipe.steps}
                    </div>
                </div>
            </div>
        </div>
    );
}
