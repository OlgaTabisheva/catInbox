'use client';
import { useState } from 'react';
import { createRecipe, updateRecipe, scanRecipeWithGemini } from '../app/actions';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../app/TranslationProvider';

interface RecipeFormProps {
    initialData?: {
        id?: number;
        title: string;
        ingredients: string[];
        steps: string;
    };
    isEditMode?: boolean;
}
export default function RecipeForm({ initialData, isEditMode = false }: RecipeFormProps) {
    const router = useRouter();
    const t = useTranslation();
    const [activeTab, setActiveTab] = useState<'manual' | 'scan'>('manual');
    const [title, setTitle] = useState(initialData?.title || '');
    const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || ['']);
    const [steps, setSteps] = useState(initialData?.steps || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scanUrl, setScanUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState('');
    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };
    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const validIngredients = ingredients.filter(i => i.trim() !== '');
            if (isEditMode && initialData?.id) {
                await updateRecipe(initialData.id, title, validIngredients, steps);
                router.push(`/recipes/${initialData.id}`);
            } else {
                await createRecipe(title, validIngredients, steps);
                router.push('/recipes');
            }
        } catch (e) {
            console.error('Failed to submit recipe:', e);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleScan = async () => {
        setIsScanning(true);
        setScanError('');
        try {
            const result = await scanRecipeWithGemini(scanUrl);
            if (result.success && result.data) {
                const { title, ingredients, steps } = result.data;
                setTitle(title || '');
                setIngredients(Array.isArray(ingredients) ? ingredients : []);
                if (Array.isArray(steps)) {
                    setSteps(steps.join('\n'));
                } else {
                    setSteps(steps || '');
                }
                setActiveTab('manual');
            } else {
                setScanError(result.error || 'Не удалось распознать рецепт. Проверьте ссылку или текст.');
            }
        } catch {
            setScanError('Ошибка соединения с AI.');
        } finally {
            setIsScanning(false);
        }
    };
    return (
        <div className="max-w-2xl mx-auto pb-20">
            <h1 className="text-2xl md:text-3xl font-heading font-black text-slate-800 mb-6 text-center">
                {isEditMode ? `${t.edit} ✏️` : `${t.create} 🍳`}
            </h1>
            {!isEditMode && (
                <div className="bg-sand20 p-1 rounded-2xl shadow-sm mb-6 flex border border-sand30">
                    <button
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'manual'
                            ? 'bg-sand10 text-primary100 shadow-sm'
                            : 'text-sand80 hover:bg-sand10/50'
                            }`}
                    >
                        Вручную
                    </button>
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'scan'
                            ? 'bg-sand10 text-primary100 shadow-sm'
                            : 'text-sand80 hover:bg-sand10/50'
                            }`}
                    >
                        {t.scanBot} ✨
                    </button>
                </div>
            )}
            {activeTab === 'scan' && !isEditMode ? (
                <div className="bg-sand20 p-4 md:p-6 rounded-3xl shadow-lg border border-sand30">
                    <div className="text-center mb-6">
                        <img src="/assets/thinking.svg" alt="AI Scan" className="w-16 h-16 mx-auto mb-4 block" />
                        <h2 className="text-xl font-bold text-sand80 mb-2">{t.scanBot}</h2>
                        <p className="text-sand60 text-sm">{t.scanBotDesc}</p>
                    </div>
                    <textarea
                        className="w-full p-4 rounded-xl bg-white border-2 border-dashed border-sand40 focus:border-primary100 focus:ring-0 transition-colors mb-4 text-sm font-medium"
                        rows={5}
                        placeholder="Вставьте ссылку (https://eda.ru/...) или текст рецепта здесь..."
                        value={scanUrl}
                        onChange={(e) => setScanUrl(e.target.value)}
                    />
                    {scanError && (
                        <div className="p-3 bg-red-50 text-error rounded-xl mb-4 text-sm font-bold text-center">
                            {scanError}
                        </div>
                    )}
                    <button
                        onClick={handleScan}
                        disabled={isScanning || !scanUrl}
                        className="w-full bg-primary100 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary140 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isScanning ? (
                            <>
                                <span className="animate-spin">⚙️</span>
                                {t.scanning}
                            </>
                        ) : (
                            <>
                                {t.scanBtn}
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-sand20 p-4 md:p-6 rounded-3xl shadow-lg border border-sand30 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-sand80 mb-2 font-heading uppercase tracking-wide">Название блюда</label>
                        <input
                            required
                            minLength={2}
                            maxLength={100}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-sand10 border border-sand30 focus:border-primary100 focus:ring-4 focus:ring-primary100/10 transition-all font-bold text-lg"
                            placeholder="Например: Борщ"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-sand80 mb-2 font-heading uppercase tracking-wide">{t.ingredients}</label>
                        <div className="space-y-2">
                            {ingredients.map((ing, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="py-3 font-bold text-sand40 w-6 text-center">{i + 1}.</span>
                                    <input
                                        required
                                        value={ing}
                                        onChange={(e) => handleIngredientChange(i, e.target.value)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-sand10 border border-sand30 focus:border-primary100 focus:ring-2 focus:ring-primary100/10 transition-all font-medium"
                                        placeholder="Продукт..."
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="mt-3 text-sm font-bold text-primary100 hover:brightness-90 px-2 py-1 rounded-lg hover:bg-white transition-colors"
                        >
                            + Добавить ингредиент
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-sand80 mb-2 font-heading uppercase tracking-wide">{t.howToCook}</label>
                        <textarea
                            required
                            minLength={10}
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl bg-sand10 border border-sand30 focus:border-primary100 focus:ring-4 focus:ring-primary100/10 transition-all resize-none"
                            placeholder="1. Нарежьте...&#10;2. Смешайте...&#10;3. Запекайте..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary100 hover:bg-primary140 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 text-lg uppercase tracking-wider"
                    >
                        {isSubmitting ? '...' : (isEditMode ? t.saveChanges : t.saveRecipe)}
                    </button>
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full bg-sand10 hover:bg-sand20 text-sand80 font-bold py-4 rounded-xl border border-sand30 transition-colors"
                        >
                            {t.cancel}
                        </button>
                    )}
                </form>
            )}
        </div>
    );
}
