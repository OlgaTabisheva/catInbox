'use server';
import { db } from '@repo/db';
import { products, recipes, users } from '@repo/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { findBestImageForProduct } from '../lib/gemini';
import { signIn, auth } from '../auth';
import { AuthError } from 'next-auth';
import { hash } from 'bcryptjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
export async function register(prevState: string | undefined, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (!email || !password) return 'Missing fields';
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) return 'Email already registered';
    const hashedPassword = await hash(password, 10);
    await db.insert(users).values({ email, password: hashedPassword });
    return 'Success';
}
export async function getProducts(location: 'fridge' | 'pantry') {
    return await db.select().from(products).where(eq(products.location, location));
}
export async function getAllProducts() {
    return await db.select().from(products);
}
async function checkAuth() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session;
}
export async function toggleProductStatus(id: number, currentStatus: boolean) {
    await checkAuth();
    await db.update(products).set({ inStock: !currentStatus }).where(eq(products.id, id));
    revalidatePath('/');
    revalidatePath('/pantry');
    revalidatePath('/shopping-list');
}
export async function getShoppingList() {
    return await db.select().from(products).where(eq(products.inStock, false));
}
export async function addProduct(name: string, location: 'fridge' | 'pantry') {
    await checkAuth();
    const imageUrl = await findBestImageForProduct(name);
    await db.insert(products).values({ name, location, inStock: true, imageUrl });
    revalidatePath(`/${location}`);
}
export async function updateProduct(id: number, name: string) {
    await checkAuth();
    const imageUrl = await findBestImageForProduct(name);
    await db.update(products).set({ name, imageUrl }).where(eq(products.id, id));
    revalidatePath('/');
    revalidatePath('/pantry');
    revalidatePath('/shopping-list');
}
export async function deleteProduct(id: number, location: 'fridge' | 'pantry' | 'shopping-list') {
    await checkAuth();
    await db.delete(products).where(eq(products.id, id));
    if (location === 'shopping-list') {
        revalidatePath('/shopping-list');
    } else {
        revalidatePath(`/${location}`);
    }
}
export async function getRecipes() {
    return await db.select().from(recipes);
}
export async function getRecipeById(id: number) {
    const result = await db.select().from(recipes).where(eq(recipes.id, id));
    return result[0];
}
export async function createRecipe(title: string, ingredients: string[], steps: string) {
    await checkAuth();
    await db.insert(recipes).values({
        title,
        ingredients,
        steps,
        isFavorite: false
    });
    revalidatePath('/recipes');
}
export async function updateRecipe(id: number, title: string, ingredients: string[], steps: string) {
    await checkAuth();
    await db.update(recipes).set({
        title,
        ingredients,
        steps
    }).where(eq(recipes.id, id));
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);
}
export async function deleteRecipe(id: number) {
    await checkAuth();
    await db.delete(recipes).where(eq(recipes.id, id));
    revalidatePath('/recipes');
}
export async function scanRecipeWithGemini(urlOrText: string) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error("AI Scan failed: API Key missing");
        return { success: false, error: "API Key missing" };
    }
    console.log("Starting AI Scan for input length:", urlOrText.length);
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Extract recipe data from the following context:
            "${urlOrText}"
            Return ONLY valid JSON with keys: 
            - title (string)
            - ingredients (array of strings, e.g. ["Milk 1L", "Eggs 2pcs"])
            - steps (string with newlines)
            If input is a URL, assume it's a recipe page.
            IMPORTANT: Return ONLY raw JSON, no markdown, no explanations.
        `;
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();
        console.log("Raw AI response received");

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        const data = JSON.parse(text);
        console.log("Parsed AI data successfully:", data.title);
        return { success: true, data };
    } catch (e) {
        console.error("AI Scan Error:", e);
        return { success: false, error: e instanceof Error ? e.message : "Failed to scan recipe" };
    }
}
