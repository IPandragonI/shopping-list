document.addEventListener('DOMContentLoaded', () => {
    const localStorage = window.localStorage;
    const tableBody = document.getElementById('liste-course-body');
    const total = document.getElementById('total-general');
    const clearList = document.getElementById('vider-liste');

    const init = async () => {
        const list = JSON.parse(localStorage.getItem('list')) || [];
        list.forEach(item => {
            const row = document.createElement('tr');
            const name = document.createElement('td');
            const price = document.createElement('td');
            const quantity = document.createElement('td');
            const totalPrice = document.createElement('td');
            const removeButton = document.createElement('td');

            name.innerHTML = '<p class="font-bold">' + item.nom + '</p>';
            price.textContent = item.prix_unitaire;
            quantity.innerHTML = '<input class="input w-1/3" type="number" value="' + item.quantite + '">';
            totalPrice.textContent = (item.quantite * item.prix_unitaire).toFixed(2);
            removeButton.innerHTML = '<button class="btn btn-error">SUPPRIMER</button>';

            quantity.addEventListener('change', e => {
                item.quantite = e.target.value;
                localStorage.setItem('list', JSON.stringify(list));
                totalPrice.textContent = (item.quantite * item.prix_unitaire).toFixed(2);
                const count = newList.reduce((acc, item) => acc + item.quantite, 0).toFixed(2);
                total.textContent = '💰 Total général : ' + count + ' €';
            })

            removeButton.addEventListener('click', () => {
                const newList = list.filter(product => product.nom !== item.nom);
                localStorage.setItem('list', JSON.stringify(newList));
                tableBody.removeChild(row);
                const count = newList.reduce((acc, item) => acc + item.quantite, 0).toFixed(2);
                total.textContent = '💰 Total général : ' + count + ' €';
            });

            row.appendChild(name);
            row.appendChild(price);
            row.appendChild(quantity);
            row.appendChild(totalPrice);
            row.appendChild(removeButton);
            tableBody.appendChild(row);
        });

        const totalGeneral = list.reduce((acc, item) => acc + item.prix_unitaire * item.quantite, 0).toFixed(2);
        total.textContent = '💰 Total général : ' + totalGeneral + ' €';

        clearList.addEventListener('click', () => {
            localStorage.removeItem('list');
            tableBody.innerHTML = '';
            total.textContent = '💰 Total général : 0 €';
        });

    };

    init();
});
