import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
vi.mock('../app/actions', () => ({
    toggleProductStatus: vi.fn(),
    deleteProduct: vi.fn(),
    updateProduct: vi.fn(),
}));
describe('ProductCard', () => {
    const mockProduct = {
        id: 1,
        name: 'Test Product',
        location: 'fridge',
        inStock: true,
        imageUrl: 'test.png',
    };
    it('renders product name', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    it('shows "В наличии" badge when inStock is true', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText('В наличии')).toBeInTheDocument();
    });
    it('shows buttons for Delete and Edit', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByTitle('Удалить')).toBeInTheDocument();
        expect(screen.getByTitle('Редактировать')).toBeInTheDocument();
    });
});
