# Prompt de diagnostic : ticket 2 (le bouton +)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Un clic sur « + » dans le panier ajoute plusieurs exemplaires, et le nombre ajouté double à chaque clic (+5, +10, +20, +40, +80). Un clic sur « − » vide le panier.

## Étapes pour reproduire
Ajouter un bouquet, cliquer plusieurs fois sur « + » en notant la quantité avant et après.

## Résultat attendu
Chaque clic sur « + » ajoute 1, chaque clic sur « − » retire 1.

## Code concerné
`js/affichage.js` (`afficherPanier`) ; `js/app.js` (`quandActionPanier`, `rafraichir`) ; `js/panier.js` (`changerQuantite`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **Écouteur de clic ajouté à chaque affichage** : retenue. À chaque appel de `afficherPanier` (`js/affichage.js`), un écouteur `click` s'ajoutait sur `#panier-liste`, qui n'est jamais recréée, et chaque clic les déclenchait tous. Vérifiée avec `getEventListeners(document.querySelector('#panier-liste')).click.length` : 2 écouteurs et quantité 1, puis un clic = +2 (quantité 3) et 4 écouteurs, puis 8 : le nombre double à chaque clic.
2. **`changerQuantite` ajoute plus que prévu** : écartée, elle ajoute l'écart reçu (1).
3. **Plusieurs boutons « + » superposés** : écartée, une ligne n'a qu'un bouton « + ».
