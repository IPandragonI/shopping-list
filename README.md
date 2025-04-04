# Shopping-list

## Tests unitaires
#### Mathys Farineau

### Organisation du code
- **Racine** : Contient les vues HTML principales (`index.html` pour les produits disponibles et `list.html` pour la liste de courses).
- **Dossier `src`** : Contient les fichiers JavaScript pour chaque vue.

### Les tests effectués
Nous avons utilisé **Jest** et **Cypress** pour effectuer les tests unitaires et les tests end-to-end.

#### Tests avec Jest
- Vérification des fonctions utilitaires.
- Tests des composants individuels.

#### Tests avec Cypress
- Vérification de l'affichage initial des produits.
- Tests de recherche et de filtrage des produits.
- Tests de tri des produits.
- Tests de réinitialisation des filtres.
- Tests d'ajout de produits à la liste de courses.
- Tests de suppression de produits de la liste de courses.
- Tests de mise à jour du total général.

### Difficultés rencontrées
Aucune difficulté majeure rencontrée, sauf quelques difficultés avec **Jest** pour la gestion avec le dom.