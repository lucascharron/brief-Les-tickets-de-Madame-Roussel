# Ticket 2 : le bouton +

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080 (Ctrl+Maj+R pour recharger sans cache).
2. Cliquer sur « Composer » sur un bouquet, puis sur « Ajouter au panier » : le panier affiche 1 bouquet.
3. Cliquer **une seule fois** sur « + » et noter la quantité. Recommencer plusieurs fois.
4. Cliquer sur « − » et noter la quantité.

Résultat observé, un clic sur « + » à chaque fois :
- 1 → 6 (+5), 6 → 16 (+10), 16 → 36 (+20), 36 → 76 (+40), 76 → 156 (+80).
- Un clic sur « − » à 156 vide le panier.

Le nombre ajouté double à chaque clic au lieu d'être 1.

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : un clic sur « + » dans le panier ajoute plusieurs exemplaires, et le nombre ajouté double à chaque clic (+5, +10, +20, +40, +80). Un clic sur « − » vide le panier.
- Étapes : ajouter un bouquet, cliquer plusieurs fois sur « + » en notant la quantité avant et après.
- Attendu : chaque clic sur « + » ajoute 1, chaque clic sur « − » retire 1.
- Code concerné : `js/affichage.js` (`afficherPanier`), `js/app.js` (`quandActionPanier`, `rafraichir`), `js/panier.js` (`changerQuantite`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **Le gestionnaire de clic de la liste du panier est ajouté à chaque affichage** : retenue. À chaque appel de `afficherPanier`, un écouteur `click` s'ajoute sur `#panier-liste`, qui n'est jamais recréée. Un clic les déclenche tous, et chacun appelle `rafraichir()` qui en ajoute un autre : le nombre d'écouteurs double à chaque clic.
   Vérification dans la console : `getEventListeners(document.querySelector('#panier-liste')).click.length`.
   - Après rechargement et ajout d'un bouquet : 2 écouteurs, quantité 1.
   - Prévision avant de cliquer : +2 en quantité et 4 écouteurs. Après un clic sur « + » : quantité 3 et 4 écouteurs.
   - Deuxième clic : 8 écouteurs. La suite 1, 2, 4, 8 double à chaque clic.
2. **`changerQuantite` ajoute plus que prévu** : écartée, elle ajoute l'écart reçu (1), ce qui n'explique pas un doublement.
3. **Plusieurs boutons « + » superposés** : écartée, une ligne n'a qu'un bouton « + ».

Propositions de l'IA écartées :
- Écrire `liste.onclick = ...` : le symptôme disparaît, mais la cause est cachée.
- Retirer l'ancien écouteur avant d'en poser un nouveau : plus fragile, il faut garder une référence de la fonction.
- Limiter la quantité dans `changerQuantite` : cela traite le symptôme là où il se voit, pas la cause.

## Cause et correctif expliqués

**Cause** : `afficherPanier` (`js/affichage.js`) est appelée à chaque `rafraichir()` et attachait à chaque fois un nouvel écouteur de clic sur `#panier-liste`. Cette liste reste la même dans la page : seuls ses éléments sont recréés. Les écouteurs s'accumulaient donc, et chaque clic exécutait autant d'actions qu'il y avait d'écouteurs, chacune ajoutant un écouteur de plus.

**Correctif** :
- `js/affichage.js` : `afficherPanier(lignes)` n'attache plus d'écouteur. Une nouvelle fonction `preparerPanier(surAction)` l'attache une seule fois.
- `js/app.js` : `preparerPanier(quandActionPanier)` est appelée une fois dans `demarrer()`, et `rafraichir()` appelle `afficherPanier(lignes)`.

L'écouteur est attaché au démarrage parce que le projet fait déjà ainsi pour le formulaire de composition (`preparerComposition`), et parce que la liste n'est jamais remplacée.

## Vérification

Après correctif, après rechargement :
- « + » ajoute 1 par clic, « − » retire 1 par clic.
- La console indique toujours 1 écouteur sur `#panier-liste`.
- Rejeu du ticket 1 : les codes promo fonctionnent toujours.

Observation hors ticket, non traitée : avec deux lignes dans le panier, « Supprimer » sur la première ligne supprime tout le panier, alors que sur la deuxième il ne supprime qu'elle.
