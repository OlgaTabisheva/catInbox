import { getRecipes, getAllProducts } from '../actions';
import RecipeList from './RecipeList';
import Link from 'next/link';
import bookIcon from '../../assets/bowl.svg';
import cookIcon from '../../assets/good-night.svg';

export const dynamic = 'force-dynamic';
export default async function RecipesPage() {
    const [recipes, allProducts] = await Promise.all([
        getRecipes(),
        getAllProducts()
    ]);
    const { getDictionary, getCurrentLang, translateText } = await import('../../lib/i18n');
    const t = await getDictionary();
    const lang = await getCurrentLang();
    const formattedRecipes = await Promise.all(recipes.map(async r => {
        let title = r.title;
        let ingredients = Array.isArray(r.ingredients) ? r.ingredients as string[] : [];
        if (lang === 'en') {
            title = await translateText(r.title, lang);
            ingredients = await Promise.all(ingredients.map(ing => translateText(ing, lang)));
        }
        return {
            ...r,
            title,
            ingredients
        };
    }));
    const translatedProducts = await Promise.all(allProducts.map(async p => {
        if (lang === 'en') {
            return { ...p, originalName: p.name, name: await translateText(p.name, lang) };
        }
        return p;
    }));
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-black text-slate-800">
                    {t.recipes}
                </h1>
                <img src={bookIcon.src} alt="Cat" className="w-10 h-10" />

                <Link
                    href="/create"
                    className="bg-primary100 hover:bg-primary140 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
                >
                    <span className="text-xl">+</span>
                    <span className="hidden md:inline">{t.create}</span>
                </Link>
            </div>
            <RecipeList initialRecipes={formattedRecipes} allProducts={translatedProducts} />
            {recipes.length === 0 && (
                <div className="text-center py-20 bg-sand20 rounded-3xl border-2 border-dashed border-sand40">
                    <img src={cookIcon.src} alt="Cat" className="w-50 h-50 mx-auto mb-6 block object-contain" />
                    <p className="font-bold text-sand80 text-lg uppercase tracking-wider">{t.recipeEmpty}</p>
                    <Link href="/create" className="text-primary100 font-bold hover:underline mt-2 inline-block">
                        {t.addFirst}
                    </Link>
                </div>
            )}
        </div>
    );
}
