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
