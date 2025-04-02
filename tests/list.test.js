import {beforeEach, describe, expect, test} from '@jest/globals';
import {
    handleClearList,
    calculateTotal,
    createRow,
    handleQuantityChange,
    handleRemoveItem,
    renderList,
} from '../src/list.js';

describe('Affichage du tableau', () => {
    let tableBody;
    let total;
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Prix total</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody id="liste-course-body"></tbody>
            </table>
            <p id="total"></p>
        `;
        tableBody = document.getElementById('liste-course-body');
        total = document.getElementById('total');
    });

    test('Le tableau doit être vide', () => {
        const list = [];
        renderList(list, tableBody, total);
        expect(tableBody.innerHTML).toBe('');
    });

    test('Le tableau doit contenir 2 éléments', () => {
        const list = [
            {nom: 'Produit 1', prix_unitaire: 10, quantite: 2},
            {nom: 'Produit 2', prix_unitaire: 20, quantite: 3},
        ];
        renderList(list, tableBody, total);
        expect(tableBody.children.length).toBe(2);
    });
});

describe('Affichage du total', () => {
    let total;
    beforeEach(() => {
        document.body.innerHTML = '<p id="total"></p>';
        total = document.getElementById('total');
    });

    test('Le total doit être de 0.00€', () => {
        const list = [];
        total.textContent = '💰 Total général : ' + calculateTotal(list) + ' €';
        expect(total.textContent).toBe('💰 Total général : 0.00 €');
    });

    test('Le total doit être de 80.00€', () => {
        const list = [
            {nom: 'Produit 1', prix_unitaire: 10, quantite: 2},
            {nom: 'Produit 2', prix_unitaire: 20, quantite: 3},
        ];
        total.textContent = '💰 Total général : ' + calculateTotal(list) + ' €';
        expect(total.textContent).toBe('💰 Total général : 80.00 €');
    });
});

describe('modification de quantité', () => {
    let list;
    let tableBody;
    let total;
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Prix total</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody id="liste-course-body"></tbody>
            </table>
            <p id="total"></p>
        `;
        list = [
            {nom: 'Produit 1', prix_unitaire: 10, quantite: 2},
            {nom: 'Produit 2', prix_unitaire: 20, quantite: 3},
        ];
        tableBody = document.getElementById('liste-course-body');
        total = document.getElementById('total');
    });

    test('La quantité doit être modifiée', () => {
        const item = list[0];
        const row = createRow(item, list);
        tableBody.appendChild(row);
        const quantity = row.querySelector('input');
        quantity.value = 5;
        const totalPrice = row.querySelector('td:last-child');
        handleQuantityChange({target: quantity}, item, list, totalPrice, total);
        expect(totalPrice.textContent).toBe('50.00');
    });

    test('Le total doit être mis à jour', () => {
        renderList(list, tableBody, total);
        const row = tableBody.children[0];
        const quantity = row.querySelector('input');
        quantity.value = 5;
        const totalPrice = row.querySelector('td:last-child');
        handleQuantityChange({target: quantity}, list[0], list, totalPrice, total);
        expect(total.textContent).toBe('💰 Total général : 110.00 €');
    });
});

describe('suppression individuelle', () => {
    let list;
    let tableBody;
    let total;
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Prix total</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody id="liste-course-body"></tbody>
            </table>
            <p id="total"></p>
        `;
        list = [
            {nom: 'Produit 1', prix_unitaire: 10, quantite: 2},
            {nom: 'Produit 2', prix_unitaire: 20, quantite: 3},
        ];
        tableBody = document.getElementById('liste-course-body');
        total = document.getElementById('total');
    });

    test('L\'élément doit être supprimé', () => {
        renderList(list, tableBody, total);
        const row = tableBody.children[0];
        handleRemoveItem(list[0], list, row, tableBody, total);
        expect(tableBody.children.length).toBe(1);
    });

    test('Le total doit être mis à jour', () => {
        renderList(list, tableBody, total);
        const row = tableBody.children[0];
        handleRemoveItem(list[0], list, row, tableBody, total);
        expect(total.textContent).toBe('💰 Total général : 60.00 €');
    });
});

describe('Bouton vider la liste', () => {
    let list;
    let tableBody;
    let total;
    let clearList;
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Prix total</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody id="liste-course-body"></tbody>
            </table>
            <p id="total"></p>
            <button id="vider-liste">Vider la liste</button>
        `;
        list = [
            {nom: 'Produit 1', prix_unitaire: 10, quantite: 2},
            {nom: 'Produit 2', prix_unitaire: 20, quantite: 3},
        ];
        tableBody = document.getElementById('liste-course-body');
        total = document.getElementById('total');
        clearList = document.getElementById('vider-liste');
    });

    test('La liste doit être vidée', () => {
        renderList(list, tableBody, total);
        handleClearList(tableBody, total);
        expect(tableBody.innerHTML).toBe('');
    });

    test('Le total doit être mis à jour', () => {
        renderList(list, tableBody, total);
        handleClearList(tableBody, total);
        expect(total.textContent).toBe('💰 Total général : 0 €');
    });
})