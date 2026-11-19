# Ticket 5 : un bouquet supprimé, tout le panier vidé

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080 (Ctrl+Maj+R pour recharger sans cache), panier vide.
2. Ajouter trois bouquets différents, dans cet ordre : Pivoine poudrée, Champêtre, Roses rouges. Le panier contient trois lignes.
3. Cliquer sur « Supprimer » sur une ligne, puis remettre les trois bouquets avant l'essai suivant.

Résultat observé :
- « Supprimer » sur la 1ère ligne : les trois lignes disparaissent.
- « Supprimer » sur la 2ème ligne : elle et la 3ème disparaissent, la 1ère reste.
- « Supprimer » sur la 3ème ligne : elle seule disparaît.

La ligne cliquée disparaît avec toutes celles qui la suivent.

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : avec trois lignes dans le panier, « Supprimer » sur une ligne supprime aussi toutes les lignes qui la suivent.
- Étapes : ajouter Pivoine poudrée, Champêtre, Roses rouges, cliquer sur « Supprimer » sur la première ligne.
- Attendu : seule la ligne cliquée disparaît.
- Code concerné : `js/panier.js` (`supprimerLigne`, `changerQuantite`), `js/app.js` (`quandActionPanier`), `js/affichage.js` (boutons `data-action` et `data-index`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **L'instruction qui retire la ligne retire aussi tout ce qui la suit** : retenue. Dans `supprimerLigne` (`js/panier.js`), la découpe du tableau (`splice`) n'est pas limitée à un élément.
   Vérification dans la console :
   - `[10, 20, 30].splice(1)` retire `[20, 30]` : tout à partir de la position 1.
   - `[10, 20, 30].splice(1, 1)` retire `[20]` : un seul élément.
   Cela correspond exactement au motif observé. La ligne `lignes.splice(index);` a été lue par l'IA dans `js/panier.js` ; je ne l'ai pas relevée moi-même dans le fichier avant le correctif. Elle est confirmée indirectement par le comportement avant et après correction.
2. **Les boutons « Supprimer » ne portent pas le bon numéro de ligne** (`data-index`) : écartée comme peu probable, c'est bien la ligne cliquée qui disparaît en premier. Je n'ai pas relevé les `data-index` dans l'onglet Éléments.
3. **L'action est déclenchée plusieurs fois** : écartée, c'était le défaut du ticket 2, corrigé.

Proposition de l'IA écartée :
- Réécrire `supprimerLigne` avec `lignes = lignes.filter(...)` : cela marcherait, mais c'est un changement plus large pour le même résultat.

## Cause et correctif expliqués

**Cause** : `supprimerLigne` (`js/panier.js`) appelait `lignes.splice(index)`. Sans second paramètre, `splice` retire l'élément à la position `index` **et tous ceux qui le suivent**. Supprimer la 1ère ligne retirait donc tout, la 2ème retirait la 2ème et la 3ème, la dernière retirait seulement elle-même.

**Correctif** : `js/panier.js`, `supprimerLigne` :

```js
lignes.splice(index, 1);
```

Le second paramètre limite la découpe à un seul élément.

Effet connu : `changerQuantite` appelle `supprimerLigne` quand la quantité tombe à 0. Le bouton « − » sur une ligne de quantité 1 avait donc le même défaut, avec plusieurs lignes. Le correctif règle les deux cas.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R), avec trois lignes :
- « Supprimer » sur la 1ère, la 2ème ou la dernière ligne : seule cette ligne disparaît.
- « − » sur une ligne de quantité 1 avec plusieurs lignes : seule cette ligne disparaît.
- Le sous-total diminue du prix de la seule ligne supprimée.
- Rejeu des tickets 1 à 4 : `noel10` donne la remise, « + » et « − » changent la quantité de 1, « Merci » affiche 4 bouquets, petit puis grand donnent deux lignes.
