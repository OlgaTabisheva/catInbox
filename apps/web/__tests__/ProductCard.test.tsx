import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../components/ProductCard';

vi.mock('../app/actions', () => ({
    toggleProductStatus: vi.fn(),
    deleteProduct: vi.fn(),
    updateProduct: vi.fn(),
}));

vi.mock('../app/TranslationProvider', () => ({
    useTranslation: () => ({
        buy: "Buy",
        have: "Have",
        addToStash: "Add to Stash",
        deleteConfirm: "Delete",
        yes: "Yes",
        no: "No",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit"
    })
}));

describe('ProductCard', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        location: 'fridge',
        inStock: true,
        imageUrl: 'test.png',
        originalName: 'Test Product'
    };
    it('renders product name', () => {
        render(<ProductCard product={mockProduct} isLoggedIn={true} />);
        expect(screen.getByText('Test Product')).toBeDefined();
    });
    it('shows Have text instead of В наличии', () => {
        render(<ProductCard product={mockProduct} isLoggedIn={true} />);
        expect(screen.getByText('Have')).toBeDefined();
    });
    it('shows buttons for Delete and Edit', () => {
        render(<ProductCard product={mockProduct} isLoggedIn={true} />);
        expect(screen.getByTitle('Delete')).toBeDefined();
        expect(screen.getByTitle('Edit')).toBeDefined();
    });
});
