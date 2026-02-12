import { pgTable, serial, text, boolean, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    location: text('location').notNull(), 
    inStock: boolean('in_stock').default(false).notNull(), 
    imageUrl: text('image_url'),
});

export const recipes = pgTable('recipes', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    ingredients: jsonb('ingredients').$type<string[]>().notNull(),
    steps: text('steps').notNull(),
    imageUrl: text('image_url'),
    sourceUrl: text('source_url'),
    isFavorite: boolean('is_favorite').default(false).notNull(),
});

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    role: text('role').default('user'),
});
