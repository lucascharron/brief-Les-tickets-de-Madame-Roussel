# Prompt de diagnostic : ticket 3 (un bouquet absent de l'occasion « Merci »)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Avec l'occasion « Merci », « Le petit mot » n'apparaît pas, alors qu'il apparaît avec « Toutes ».

## Étapes pour reproduire
Ouvrir la boutique, cliquer sur l'occasion « Merci », regarder les bouquets affichés.

## Résultat attendu
« Le petit mot » apparaît avec « Merci ».

## Code concerné
`js/affichage.js` (`afficherCatalogue`, filtre sur les occasions) ; `data/catalogue.json` (les `occasions` de chaque bouquet) ; `js/app.js` (`preparerFiltres`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **Les `occasions` de « Le petit mot » ne contiennent pas exactement l'identifiant de « Merci »** : retenue. Son occasion est écrite `Merci` (M majuscule) dans `data/catalogue.json` alors que l'identifiant est `merci`. Vérifiée dans la console : liste des occasions par bouquet, puis `['Merci', 'plaisir'].includes('merci')` donne `false` et `['merci', 'plaisir'].includes('merci')` donne `true`.
2. **Le filtre lui-même est défectueux** : écartée, les autres bouquets s'affichent bien dans leurs occasions.
3. **L'identifiant du bouton radio « Merci » est mal créé** : écartée, Champêtre, Soleil d'automne et Blanc pur apparaissent sous « Merci ».
4. **Le bouquet n'a aucune occasion** : écartée, il apparaît avec « Pour le plaisir ».
