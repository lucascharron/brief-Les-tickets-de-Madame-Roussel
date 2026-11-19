# Prompt de diagnostic : ticket 4 (deux tailles, deux grands bouquets)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
J'ajoute une Pivoine poudrée « Petit », puis je choisis « Grand » et je l'ajoute : le panier contient 2 Pivoine poudrée « Grand » (101,00 €) au lieu d'un petit et d'un grand.

## Étapes pour reproduire
Composer Pivoine poudrée en « Petit », ajouter au panier, choisir « Grand » dans le même formulaire, ajouter au panier.

## Résultat attendu
Deux lignes : une « Petit » à 34,90 € et une « Grand » à 50,50 €.

## Code concerné
`js/composition.js` (`options`, `ajouter`) ; `js/app.js` (`quandAjoute`) ; `js/panier.js` (`ajouterAuPanier`, `memesOptions`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **La ligne du panier partage le même objet `options` que le formulaire** : retenue. Vérifiée dans la console, sans rechargement : `l[0].options.taille` vaut `'petit'` après l'ajout, puis `'grand'` après avoir coché « Grand » **sans** cliquer sur « Ajouter au panier ». Un premier essai donnait `'petit'` deux fois : il n'était pas concluant, car on ne savait pas si « Grand » était coché ni si la page avait été rechargée.
2. **La fusion des lignes en découle** : au deuxième ajout, `ajouterAuPanier` compare la ligne et le formulaire (le même objet), les juge identiques et augmente la quantité. Cohérent avec les 2 grandes à 101,00 €, non testée séparément.
3. **Le calcul du prix est faux** : écartée, 34,90 + 15,60 = 50,50 et 2 × 50,50 = 101,00.
