import {describe, expect, test} from '@jest/globals';
import {fetchProducts, filterProducts, sortProducts} from '../src/main.js';

describe('afficherProduits', () => {
    test('fetchProducts retourne un tableau de produits', async () => {
        const products = await fetchProducts();
        expect(Array.isArray(products)).toBe(true);
    });
    test('fetchProducts retourne un tableau de produits non vide', async () => {
        const products = await fetchProducts();
        expect(products.length).toBeGreaterThan(0);
    });
    test('fetchProducts retourne un tableau de produits avec des objets', async () => {
        const products = await fetchProducts();
        expect(products[0]).toEqual(expect.objectContaining({
            nom: expect.any(String),
            prix_unitaire: expect.any(Number),
            quantite_stock: expect.any(Number),
        }));
    });
    test('fetchProducts retourne un tableau de 98 produits', async () => {
        const products = await fetchProducts();
        expect(products.length).toBe(98);
    });
});

describe('Filtres et tri', () => {
    test('filterProducts retourne un tableau de produits filtrés', () => {
        const products = [
            {nom: 'Produit 1'},
            {nom: 'Produit 2'},
            {nom: 'Produit 3'},
        ];
        const filteredProducts = filterProducts(products, 'Produit 1');
        expect(filteredProducts).toEqual([{nom: 'Produit 1'}]);
    });

    test('trie les produits par nom', () => {
        const products = [
            {nom: 'Produit 1'},
            {nom: 'Produit 3'},
            {nom: 'Produit 2'},
        ];
        const sortedProducts = sortProducts(products, 'nom');
        expect(sortedProducts).toEqual([
            {nom: 'Produit 1'},
            {nom: 'Produit 2'},
            {nom: 'Produit 3'},
        ]);
    });
});

describe('Ajout au localStorage', () => {

});