import { getRecipeById } from '../../../actions';
import RecipeForm from '../../../../components/RecipeForm';
import { notFound } from 'next/navigation';
export default async function EditRecipePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const recipe = await getRecipeById(parseInt(id));
    if (!recipe) return notFound();
    const steps = recipe.steps || '';
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients as string[] : [];
    return (
        <RecipeForm
            initialData={{
                id: recipe.id,
                title: recipe.title,
                ingredients,
                steps
            }}
            isEditMode={true}
        />
    );
}
