describe('Affichage initial', () => {
    beforeEach(() => {
        cy.visit('/index.html');
    });

    it('Vérifier que les produits sont affichés dans #liste-produits', () => {
        cy.get('#liste-produits').children().should('have.length.greaterThan', 0);
    });

    it('Vérifier que le nombre de produits est affiché dans #compteur-produits', () => {
        cy.get('#liste-produits').children().then((products) => {
            const productCount = products.length;
            cy.get('#compteur-produits').should('contain', productCount);
        });
    });
});

describe('Recherche de produit', () => {
    beforeEach(() => {
        cy.visit('/index.html');
    });

    it('Vérifier que la liste est filtrée en fonction du mot-clé saisi', () => {
        cy.get('#recherche').type('Ail');
        cy.get('#liste-produits').children().should('have.length', 1);
    });

    it('Exemple : taper "Ail" doit réduire la liste à 1 produits', () => {
        cy.get('#recherche').type('Ail');
        cy.get('#liste-produits').children().should('have.length', 1);
        cy.get('#liste-produits').children().first().should('contain', 'Ail');
    });
});

describe('Tri des produits', () => {
    beforeEach(() => {
        cy.visit('/index.html');
    });

    it('Tester le tri par nom (ordre alphabétique)', () => {
        cy.get('#tri').select('nom');
        cy.get('#liste-produits').children().then((products) => {
            const productNames = [...products].map(product => product.querySelector('.product-name').textContent);
            const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
            expect(productNames).to.deep.equal(sortedNames);
        });
    });

    it('Tester le tri par prix (ordre croissant)', () => {
        cy.get('#tri').select('prix');
        cy.get('#liste-produits').children().then((products) => {
            const productPrices = [...products].map(product => parseFloat(product.querySelector('.product-price').textContent));
            const sortedPrices = [...productPrices].sort((a, b) => a - b);
            expect(productPrices).to.deep.equal(sortedPrices);
        });
    });
});

describe('Réinitialisation des filtres', () => {
    beforeEach(() => {
        cy.visit('/index.html');
    });

    it('Vérifier que le champ #recherche est vidé', () => {
        cy.get('#recherche').type('Ail');
        cy.get('#reset-filtres').click();
        cy.get('#recherche').should('have.value', '');
    });

    it('Vérifier que #tri revient à son état initial', () => {
        cy.get('#tri').select('prix');
        cy.get('#reset-filtres').click();
        cy.get('#tri').should('have.value', '');
    });

    it('Vérifier que tous les produits sont de nouveau affichés', () => {
        cy.get('#recherche').type('Ail');
        cy.get('#reset-filtres').click();
        cy.get('#liste-produits').children().should('have.length.greaterThan', 0);
    });
});

describe('Ajout d’un produit à la liste', () => {
    beforeEach(() => {
        cy.visit('/index.html');
        cy.window().then((win) => {
            win.localStorage.clear();
        });
    });

    it('Vérifier que le produit est bien ajouté au localStorage', () => {
        cy.get('#liste-produits').children().first().children().find('button').click();
        cy.window().then((win) => {
            const listeCourse = JSON.parse(win.localStorage.getItem('list'));
            expect(listeCourse).to.have.length.greaterThan(0);
        });
    });

    it('Vérifier la structure des données ajoutées', () => {
        cy.get('#liste-produits').children().first().children().find('button').click();
        cy.window().then((win) => {
            const listeCourse = JSON.parse(win.localStorage.getItem('list'));
            const produit = listeCourse[listeCourse.length - 1];
            expect(produit).to.have.property('nom');
            expect(produit).to.have.property('prix_unitaire');
            expect(produit).to.have.property('quantite_stock');
        });
    });
});