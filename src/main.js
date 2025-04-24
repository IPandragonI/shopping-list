export const searchInput = document.getElementById('recherche');
export const productList = document.getElementById('liste-produits');
export const productNumber = document.getElementById('compteur-produits');
export const sortSelect = document.getElementById('tri');
export const resetButton = document.getElementById('reset-filtres');
export const localStorage = window.localStorage;


export const fetchProducts = async () => {
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}/products-list.json`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const createProductElement = (product, list) => {
    const li = document.createElement('li');
    li.classList.add('card', 'shadow-sm', 'p-6', 'mb-5', 'bg-white', 'rounded-xl', 'hover:shadow-lg', 'transition-shadow', 'duration-300');

    const quantityTaken = list.find(item => item.nom === product.nom)?.quantite || 0;
    const quantityCount = product.quantite_stock - quantityTaken;

    const title = document.createElement('h2');
    const quantity = document.createElement('p');
    const price = document.createElement('p');
    const addToList = document.createElement('button');

    title.innerHTML = `<h2 class="card-title product-name my-1 text-xl">${product.nom}</h2>`;
    quantity.innerHTML = `<p class="my-1"><strong>Quantité : </strong>${quantityCount}</p>`;
    price.innerHTML = `<p class="my-1 product-price"><strong>Prix : </strong>${product.prix_unitaire}€</p>`;
    addToList.innerHTML = `<button type="button" class="btn btn-secondary mt-5" data-id="${product.nom}">Ajouter à la liste</button>`;

    if (quantityCount === 0) {
        li.classList.add('opacity-75');
        addToList.disabled = true;
        addToList.innerHTML = '<button type="button" class="btn btn-secondary mt-5" data-id="${product.nom}" disabled>Produit épuisé</button>';
    }

    addToList.addEventListener('click', () => handleAddToList(product, addToList, quantity, li));

    li.appendChild(title);
    li.appendChild(quantity);
    li.appendChild(price);
    li.appendChild(addToList);

    return li;
};

export const renderProducts = (products) => {
    const list = JSON.parse(localStorage.getItem('list')) || [];
    productList.innerHTML = '';
    productNumber.innerHTML = `<p class="text-center">${products.length} produits</p>`;
    products.forEach(product => {
        const productElement = createProductElement(product, list);
        productList.appendChild(productElement);
    });
};

export const handleAddToList = (product, addToList, quantity, li) => {
    const list = JSON.parse(localStorage.getItem('list')) || [];
    const productInCart = list.find(item => item.nom === product.nom);
    if (productInCart) {
        productInCart.quantite = parseInt(productInCart.quantite) + 1;
    } else {
        list.push({...product, quantite: 1});
    }
    localStorage.setItem('list', JSON.stringify(list));
    addToList.innerHTML = '<button type="button" class="btn btn-active btn-primary mt-5" data-id="${product.nom}">Produit ajouté !</button>';
    setTimeout(() => {
        addToList.innerHTML = `<button type="button" class="btn btn-secondary mt-5" data-id="${product.nom}">Ajouter à la liste</button>`;
    }, 500);
    const quantityTaken = list.find(item => item.nom === product.nom)?.quantite || 0;
    const quantityCount = product.quantite_stock - quantityTaken;
    quantity.innerHTML = `<p class="my-1"><strong>Quantité : </strong>${quantityCount}</p>`;

    if (quantityCount === 0) {
        li.classList.add('opacity-75');
        addToList.disabled = true;
        addToList.innerHTML = '<button type="button" class="btn btn-secondary mt-5" data-id="${product.nom}" disabled>Produit épuisé</button>';
    }
};

export const filterProducts = (products, searchTerm) => {
    return products.filter(product => product.nom.toLowerCase().includes(searchTerm.toLowerCase()));
};

export const sortProducts = (products, sortBy) => {
    return products.slice().sort((a, b) => {
        if (sortBy === 'nom') {
            return a.nom.localeCompare(b.nom);
        } else if (sortBy === 'prix') {
            return a.prix_unitaire - b.prix_unitaire;
        }
        return 0;
    });
};

export const init = async () => {
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

document.addEventListener('DOMContentLoaded', init);
