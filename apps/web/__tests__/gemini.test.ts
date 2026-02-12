import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findBestImageForProduct } from '../lib/gemini';
const MOCK_API_KEY = 'test-api-key';
describe('findBestImageForProduct', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        process.env.GOOGLE_GENERATIVE_AI_API_KEY = MOCK_API_KEY;
    });
    it('should return default twemoji for known Russian products', async () => {
        const milk = await findBestImageForProduct('Молоко');
        expect(milk).toContain('1f95b.png');
        const cheese = await findBestImageForProduct('Сыр');
        expect(cheese).toContain('1f9c0.png');
    });
    it('should return basket for unknown products when no API key (or mock failure)', async () => {
        const unknown = await findBestImageForProduct('UnicornMeat');
        expect(unknown).toContain('1f9fa.png'); 
    });
});
