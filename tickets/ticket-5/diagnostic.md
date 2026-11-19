# Prompt de diagnostic : ticket 5 (un bouquet supprimé, tout le panier vidé)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Avec trois lignes dans le panier, « Supprimer » sur une ligne supprime aussi toutes les lignes qui la suivent.

## Étapes pour reproduire
Ajouter Pivoine poudrée, Champêtre, Roses rouges, cliquer sur « Supprimer » sur la première ligne.

## Résultat attendu
Seule la ligne cliquée disparaît.

## Code concerné
`js/panier.js` (`supprimerLigne`, `changerQuantite`) ; `js/app.js` (`quandActionPanier`) ; `js/affichage.js` (boutons `data-action` et `data-index`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **La découpe du tableau n'est pas limitée à un élément** : retenue. `supprimerLigne` (`js/panier.js`) appelait `lignes.splice(index)` : sans second paramètre, `splice` retire la ligne et toutes les suivantes. Vérifiée dans la console : `[10, 20, 30].splice(1)` retire `[20, 30]` et `[10, 20, 30].splice(1, 1)` retire `[20]`. La ligne a été lue par l'IA, non relevée dans le fichier par l'utilisateur ; elle est confirmée indirectement par le comportement.
2. **Mauvais `data-index` sur les boutons** : écartée comme peu probable, non relevée dans l'onglet Éléments.
3. **Action déclenchée plusieurs fois** : écartée, c'était le défaut du ticket 2, corrigé.
