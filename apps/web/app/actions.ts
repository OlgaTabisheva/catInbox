'use server';
import { db } from '@repo/db';
import { products, recipes, users } from '@repo/db/schema';
import { eq, and, sql } from 'drizzle-orm';
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

export async function logoutUser() {
    const { signOut } = await import('../auth');
    await signOut({ redirectTo: '/' });
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

async function checkAuth() {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    const userId = parseInt((session.user as any).id, 10);
    return { session, userId };
}

export async function getProducts(location: 'fridge' | 'pantry') {
    const { userId } = await checkAuth();
    return await db.select().from(products).where(
        and(eq(products.location, location), eq(products.userId, userId))
    );
}

export async function getAllProducts() {
    const { userId } = await checkAuth();
    return await db.select().from(products).where(eq(products.userId, userId));
}

export async function toggleProductStatus(id: number, currentStatus: boolean) {
    const { userId } = await checkAuth();
    await db.update(products).set({ inStock: !currentStatus }).where(
        and(eq(products.id, id), eq(products.userId, userId))
    );
    revalidatePath('/');
    revalidatePath('/pantry');
    revalidatePath('/shopping-list');
}

export async function getShoppingList() {
    const { userId } = await checkAuth();
    return await db.select().from(products).where(
        and(eq(products.inStock, false), eq(products.userId, userId))
    );
}

export async function addProduct(name: string, location: 'fridge' | 'pantry') {
    const { userId } = await checkAuth();

    console.log(`User ${userId} attempting to add "${name}" to ${location}`);

    // Check if product already exists for this user in any location
    const existingProduct = await db.select().from(products).where(
        and(
            sql`LOWER(${products.name}) = LOWER(${name})`,
            eq(products.userId, userId)
        )
    );

    if (existingProduct.length > 0) {
        const p = existingProduct[0];
        const locName = p.location === 'fridge' ? 'холодильнике' : 'шкафу';
        throw new Error(`Этот продукт уже есть в ${locName}!`);
    }

    const imageUrl = await findBestImageForProduct(name);
    await db.insert(products).values({ name, location, inStock: true, imageUrl, userId });
    revalidatePath(`/${location}`);
}

export async function moveProduct(id: number, newLocation: 'fridge' | 'pantry') {
    const { userId } = await checkAuth();
    await db.update(products).set({ location: newLocation }).where(
        and(eq(products.id, id), eq(products.userId, userId))
    );
    revalidatePath('/fridge');
    revalidatePath('/pantry');
}

export async function updateProduct(id: number, name: string) {
    const { userId } = await checkAuth();
    const imageUrl = await findBestImageForProduct(name);
    await db.update(products).set({ name, imageUrl }).where(
        and(eq(products.id, id), eq(products.userId, userId))
    );
    revalidatePath('/');
    revalidatePath('/pantry');
    revalidatePath('/shopping-list');
}

export async function deleteProduct(id: number, location: 'fridge' | 'pantry' | 'shopping-list') {
    const { userId } = await checkAuth();
    await db.delete(products).where(
        and(eq(products.id, id), eq(products.userId, userId))
    );
    if (location === 'shopping-list') {
        revalidatePath('/shopping-list');
    } else {
        revalidatePath(`/${location}`);
    }
}

export async function getRecipes() {
    const { userId } = await checkAuth();
    return await db.select().from(recipes).where(eq(recipes.userId, userId));
}

export async function getRecipeById(id: number) {
    const { userId } = await checkAuth();
    const result = await db.select().from(recipes).where(
        and(eq(recipes.id, id), eq(recipes.userId, userId))
    );
    return result[0];
}

export async function createRecipe(title: string, ingredients: string[], steps: string) {
    const { userId } = await checkAuth();
    await db.insert(recipes).values({
        title,
        ingredients,
        steps,
        isFavorite: false,
        userId
    });
    revalidatePath('/recipes');
}

export async function updateRecipe(id: number, title: string, ingredients: string[], steps: string) {
    const { userId } = await checkAuth();
    await db.update(recipes).set({
        title,
        ingredients,
        steps
    }).where(
        and(eq(recipes.id, id), eq(recipes.userId, userId))
    );
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);
}

export async function deleteRecipe(id: number) {
    const { userId } = await checkAuth();
    await db.delete(recipes).where(
        and(eq(recipes.id, id), eq(recipes.userId, userId))
    );
    revalidatePath('/recipes');
}
export async function scanRecipeWithGemini(urlOrText: string) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        console.error("AI Scan failed: API Key missing");
        return { success: false, error: "API Key missing" };
    }
    console.log("Starting AI Scan for input length:", urlOrText.length);

    let contextData = urlOrText;
    if (urlOrText.trim().startsWith('http')) {
        try {
            console.log("Fetching URL:", urlOrText);
            const res = await fetch(urlOrText.trim(), { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const html = await res.text();
            contextData = html.substring(0, 40000); // 40k chars of HTML
        } catch (e) {
            console.error("Failed to fetch URL", e);
        }
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
            Extract a cooking recipe from the following context (it might be HTML or raw text):
            "${contextData}"
            
            Return ONLY valid JSON with keys: 
            - title (string)
            - ingredients (array of strings, e.g. ["Молоко 1л", "Яйца 2шт"])
            - steps (string with newlines)
            
            IMPORTANT: Return ONLY raw JSON, without any markdown formatting, backticks, or explanations.
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
