export const localStorage = window.localStorage;
const tableBody = document.getElementById('liste-course-body');
const total = document.getElementById('total-general');
const clearList = document.getElementById('vider-liste');
export const updateLocalStorage = (list) => localStorage.setItem('list', JSON.stringify(list));
export const calculateTotal = (list) => list.reduce((acc, item) => acc + item.prix_unitaire * item.quantite, 0).toFixed(2);

export const createRow = (item, list) => {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const price = document.createElement('td');
    const quantity = document.createElement('td');
    const totalPrice = document.createElement('td');
    const removeButton = document.createElement('td');

    name.innerHTML = '<p class="font-bold">' + item.nom + '</p>';
    price.textContent = item.prix_unitaire;
    quantity.innerHTML = '<input class="input w-1/4" type="number" value=' + item.quantite + '>';
    totalPrice.textContent = (item.quantite * item.prix_unitaire).toFixed(2);
    removeButton.innerHTML = '<button class="btn btn-error">SUPPRIMER</button>';

    quantity.addEventListener('input', (e) => handleQuantityChange(e, item, list, totalPrice, total));
    removeButton.addEventListener('click', () => handleRemoveItem(item, list, row, tableBody, total));

    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(quantity);
    row.appendChild(totalPrice);
    row.appendChild(removeButton);
    return row;
};

export const handleQuantityChange = (e, item, list, totalPrice, total) => {
    const newQuantity = parseInt(e.target.value);
    const newList = list.map(product => {
        if (product.nom === item.nom) {
            product.quantite = newQuantity;
        }
        return product;
    });
    updateLocalStorage(newList);
    totalPrice.textContent = (item.prix_unitaire * newQuantity).toFixed(2);
    total.textContent = '💰 Total général : ' + calculateTotal(newList) + ' €';
};

export const handleRemoveItem = (item, list, row, tableBody, total) => {
    const newList = list.filter(product => product.nom !== item.nom);
    updateLocalStorage(newList);
    tableBody.removeChild(row);
    total.textContent = '💰 Total général : ' + calculateTotal(newList) + ' €';
};

export const renderList = (list, tableBody, total) => {
    tableBody.innerHTML = '';
    list.forEach(item => {
        const row = createRow(item, list);
        tableBody.appendChild(row);
    });
    total.textContent = '💰 Total général : ' + calculateTotal(list) + ' €';
};

export const handleClearList = (tableBody, total) => {
    localStorage.removeItem('list');
    tableBody.innerHTML = '';
    total.textContent = '💰 Total général : 0 €';
}

export const init = () => {
    const list = JSON.parse(localStorage.getItem('list')) || []
    renderList(list, tableBody, total);
    clearList.addEventListener('click', () => handleClearList(tableBody, total));
};

document.addEventListener('DOMContentLoaded', init);
