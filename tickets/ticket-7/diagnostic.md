# Prompt de diagnostic : ticket 7 (le message de la carte coupé)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Dans la zone « Votre message » de la carte, le texte s'arrête à 150 caractères, sans avertissement. La cliente ne peut pas finir sa phrase.

## Étapes pour reproduire
Cocher « Carte avec votre message », taper ou coller plus de 150 caractères.

## Résultat attendu
La cliente comprend pourquoi elle est bloquée, ou peut écrire plus, selon la décision de Madame Roussel.

## Code concerné
`js/composition.js` (`preparerComposition`, `lireFormulaire`) ; `data/catalogue.json` (`options.carte.longueurMax`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **La limite est une valeur de configuration appliquée par `composition.js`** : retenue. Vérifiée : le `textarea#message-carte` a `maxlength="150"` (onglet Éléments) et `options.carte.longueurMax` vaut `150` dans `data/catalogue.json` (console).
2. **La limite est appliquée deux fois** (attribut `maxlength` et coupure `slice` dans `lireFormulaire`) : retenue d'après la lecture du code, non mesurée dans le navigateur.
3. **Le panier ou le stockage coupe le message** : écartée, le panier n'affiche simplement pas le texte du message.
