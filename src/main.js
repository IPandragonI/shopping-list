document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('recherche');
    const productList = document.getElementById('liste-produits');
    const productNumber = document.getElementById('compteur-produits');
    const sortSelect = document.getElementById('tri');
    const resetButton = document.getElementById('reset-filtres');
    const localStorage = window.localStorage;

    const fetchProducts = async () => {
        try {
            const response = await fetch('/public/products-list.json');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };

    const renderProducts = (products) => {
        productList.innerHTML = '';
        productNumber.innerHTML = `<p class="text-center">${products.length} produits</p>`;
        products.forEach(product => {
            const li = document.createElement('li');
            li.classList.add('card', 'shadow-sm', 'p-6', 'mb-5', 'bg-white', 'rounded-xl');

            const title = document.createElement('h2');
            const quantity = document.createElement('p');
            const price = document.createElement('p');
            const addToList = document.createElement('button');

            title.innerHTML = `<h2 class="card-title my-1 text-xl">${product.nom}</h2>`;
            quantity.innerHTML = `<p class="my-1"><strong>Quantité : </strong>${product.quantite_stock}</p>`;
            price.innerHTML = `<p class="my-1"><strong>Prix : </strong>${product.prix_unitaire}€</p>`;
            addToList.innerHTML = `<button type="button" class="btn btn-secondary mt-5" data-id="${product.nom}">Ajouter à la liste</button>`;

            addToList.addEventListener('click', () => {
                const list = JSON.parse(localStorage.getItem('list')) || [];
                const productInCart = list.find(item => item.nom === product.nom);
                if (productInCart) {
                    productInCart.quantite += 1;
                } else {
                    list.push({...product, quantite: 1});
                }
                localStorage.setItem('list', JSON.stringify(list));
                addToList.innerHTML = '<button type="button" class="btn btn-success mt-5" data-id="${product.nom}">Produit ajouté !</button>';
                setTimeout(() => {
                    addToList.innerHTML = `<button type="button" class="btn btn-secondary mt-5" data-id="${product.nom}">Ajouter à la liste</button>`;
                }, 2000);
            });

            li.appendChild(title);
            li.appendChild(quantity);
            li.appendChild(price);
            li.appendChild(addToList);
            productList.appendChild(li);
        });
    };

    const filterProducts = (products, searchTerm) => {
        return products.filter(product => product.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const sortProducts = (products, sortBy) => {
        return products.slice().sort((a, b) => {
            if (sortBy === 'nom') {
                return a.nom.localeCompare(b.nom);
            } else if (sortBy === 'prix') {
                return a.prix_unitaire - b.prix_unitaire;
            }
            return 0;
        });
    };

    const init = async () => {
        let products = await fetchProducts();
        renderProducts(products);

        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            const filteredProducts = filterProducts(products, searchTerm);
            renderProducts(filteredProducts);
        });

        sortSelect.addEventListener('change', (event) => {
            const sortBy = event.target.value;
            const sortedProducts = sortProducts(products, sortBy);
            renderProducts(sortedProducts);
        });

        resetButton.addEventListener('click', async () => {
            searchInput.value = '';
            sortSelect.value = '';
            products = await fetchProducts();
            renderProducts(products);
        });
    };

    init();
});