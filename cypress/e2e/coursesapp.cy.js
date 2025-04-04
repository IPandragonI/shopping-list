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
        cy.get('#recherche').type('Lait');
        cy.get('#liste-produits').children().should('have.length', 3);
    });

    it('Exemple : taper "Lait" doit réduire la liste à 3 produits', () => {
        cy.get('#recherche').type('Lait');
        cy.get('#liste-produits').children().should('have.length', 3);
        cy.get('#liste-produits').children().first().should('contain', 'Lait');
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
        cy.get('#recherche').type('Lait');
        cy.get('#reset-filtres').click();
        cy.get('#recherche').should('have.value', '');
    });

    it('Vérifier que #tri revient à son état initial', () => {
        cy.get('#tri').select('prix');
        cy.get('#reset-filtres').click();
        cy.get('#tri').should('have.value', '');
    });

    it('Vérifier que tous les produits sont de nouveau affichés', () => {
        cy.get('#recherche').type('Lait');
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

describe('Navigation vers la liste de courses', () => {
    beforeEach(() => {
        cy.visit('/index.html');
        cy.window().then((win) => {
            win.localStorage.setItem('list', JSON.stringify([
                { nom: 'Produit 1', prix_unitaire: 10, quantite: 2 },
                { nom: 'Produit 2', prix_unitaire: 20, quantite: 3 }
            ]));
        });
        cy.get('#liste-course').click();
    });

    it('Vérifier que les produits ajoutés s’affichent dans le tableau #liste-course-body', () => {
        cy.get('#liste-course-body').children().should('have.length', 2);
        cy.get('#liste-course-body').children().first().should('contain', 'Produit 1');
        cy.get('#liste-course-body').children().last().should('contain', 'Produit 2');
    });

    it('Vérifier que le total général s’affiche dans #total-general', () => {
        cy.get('#total-general').should('contain', '💰 Total général : 80.00 €');
    });
});

describe('Modification de la quantité', () => {
    beforeEach(() => {
        cy.visit('/index.html');
        cy.window().then((win) => {
            win.localStorage.setItem('list', JSON.stringify([
                { nom: 'Produit 1', prix_unitaire: 10, quantite: 2 },
                { nom: 'Produit 2', prix_unitaire: 20, quantite: 3 }
            ]));
        });
        cy.get('#liste-course').click();
    });

    it('Vérifier que la quantité est modifiée', () => {
        cy.get('#liste-course-body').children().first().find('input[type="number"]').clear().type('5');
        cy.get('#liste-course-body').children().first().find('input[type="number"]').should('have.value', '5');
    });

    it('Vérifier que le sous-total est mis à jour', () => {
        cy.get('#liste-course-body').children().first().find('input[type="number"]').clear().type('5');
        cy.get('#liste-course-body').children().first().find('td').eq(3).should('contain', '50.00');
    });

    it('Vérifier que le total général est mis à jour', () => {
        cy.get('#liste-course-body').children().first().find('input[type="number"]').clear().type('5');
        cy.get('#total-general').should('contain', '💰 Total général : 110.00 €');
    });
});

describe('Suppression d’un produit', () => {
    beforeEach(() => {
        cy.visit('/index.html');
        cy.window().then((win) => {
            win.localStorage.setItem('list', JSON.stringify([
                { nom: 'Produit 1', prix_unitaire: 10, quantite: 2 },
                { nom: 'Produit 2', prix_unitaire: 20, quantite: 3 }
            ]));
        });
        cy.get('#liste-course').click();
    });

    it('Vérifier que la ligne est supprimée', () => {
        cy.get('#liste-course-body').children().last().find('button').click();
        cy.get('#liste-course-body').children().should('have.length', 1);
    });

    it('Vérifier que le localStorage est mis à jour', () => {
        cy.get('#liste-course-body').children().last().find('button').click();
        cy.window().then((win) => {
            const listeCourse = JSON.parse(win.localStorage.getItem('list'));
            expect(listeCourse).to.have.length(1)
            expect(listeCourse[0].nom).to.equal('Produit 1');
        });
    });
});

describe('Vider la liste', () => {
    beforeEach(() => {
        cy.visit('/index.html');
        cy.window().then((win) => {
            win.localStorage.setItem('list', JSON.stringify([
                { nom: 'Produit 1', prix_unitaire: 10, quantite: 2 },
                { nom: 'Produit 2', prix_unitaire: 20, quantite: 3 }
            ]));
        });
        cy.get('#liste-course').click();
    });

    it('Simuler la confirmation et vérifier que toutes les lignes sont supprimées', () => {
        cy.get('#vider-liste').click();
        cy.on('window:confirm', () => true);
        cy.get('#liste-course-body').children().should('have.length', 0);
    });

    it('Vérifier que total-general revient à zéro', () => {
        cy.get('#vider-liste').click();
        cy.on('window:confirm', () => true);
        cy.get('#total-general').should('contain', '💰 Total général : 0 €');
    });
});
