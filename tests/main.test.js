import {describe, expect, test} from '@jest/globals';
import {fetchProducts, filterProducts, sortProducts, handleAddToList} from '../src/main.js';

describe('afficherProduits', () => {
    test('Retourne un tableau de produits', async () => {
        const products = await fetchProducts();
        expect(Array.isArray(products)).toBe(true);
    });
    test('Retourne un tableau de produits non vide', async () => {
        const products = await fetchProducts();
        expect(products.length).toBeGreaterThan(0);
    });
    test('Retourne un tableau de produits avec des objets', async () => {
        const products = await fetchProducts();
        expect(products[0]).toEqual(expect.objectContaining({
            nom: expect.any(String),
            prix_unitaire: expect.any(Number),
            quantite_stock: expect.any(Number),
        }));
    });
    test('Retourne un tableau de 98 produits', async () => {
        const products = await fetchProducts();
        expect(products.length).toBe(98);
    });
});

describe('Filtres et tri', () => {
    test('FilterProducts retourne un tableau de produits filtrés', () => {
        const products = [
            {nom: 'Produit 1'},
            {nom: 'Produit 2'},
            {nom: 'Produit 3'},
        ];
        const filteredProducts = filterProducts(products, 'Produit 1');
        expect(filteredProducts).toEqual([{nom: 'Produit 1'}]);
    });

    test('Trie les produits par nom', () => {
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

    test('Trie les produits par prix', () => {
        const products = [
            {nom: 'Produit 1', prix_unitaire: 10},
            {nom: 'Produit 3', prix_unitaire: 30},
            {nom: 'Produit 2', prix_unitaire: 20},
        ];
        const sortedProducts = sortProducts(products, 'prix');
        expect(sortedProducts).toEqual([
            {nom: 'Produit 1', prix_unitaire: 10},
            {nom: 'Produit 2', prix_unitaire: 20},
            {nom: 'Produit 3', prix_unitaire: 30},
        ]);
    });
});

describe('Ajout au localStorage', () => {
    test('Ajoute un produit à la liste', () => {
        const product = {nom: 'Produit 1'};
        const addToList = document.createElement('button');
        const quantity = document.createElement('p');
        const li = document.createElement('li');
        handleAddToList(product, addToList, quantity, li);
        const list = JSON.parse(localStorage.getItem('list'));
        expect(list).toEqual([{nom: 'Produit 1', quantite: 1}]);
    });

    test('Incrémente la quantité d\'un produit déjà dans la liste', () => {
        const product = {nom: 'Produit 1'};
        const addToList = document.createElement('button');
        const quantity = document.createElement('p');
        const li = document.createElement('li');
        handleAddToList(product, addToList, quantity, li);
        handleAddToList(product, addToList, quantity, li);
        const list = JSON.parse(localStorage.getItem('list'));
        expect(list).toEqual([{nom: 'Produit 1', quantite: 2}]);
    });
});