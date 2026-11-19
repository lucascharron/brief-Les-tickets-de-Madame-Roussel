# Ticket 6 : la livraison facturée à 60 €

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080 (Ctrl+Maj+R pour recharger sans cache), panier vide.
2. Cliquer sur « Composer » sur Blanc pur, choisir la taille « Moyen », cocher « Vase en verre », puis « Ajouter au panier » (38,90 + 8,20 + 12,90 = 60,00 €).
3. Dans « Code postal », saisir `37000` (Tours) et lire la ligne « Livraison ».

Résultat observé, code postal 37000, panier vide entre deux essais :

| Panier | Sous-total | Livraison | Total |
|---|---|---|---|
| Blanc pur Moyen + vase | 60,00 € | 5,90 € (devrait être offerte) | 65,90 € |
| Blanc pur Grand + vase | 67,40 € | offerte | 67,40 € |
| Blanc pur Grand + carte | 57,00 € | 5,90 € | 62,90 € |

Le défaut n'apparaît que quand le sous-total tombe pile sur 60,00 €. Note : un premier essai avec Blanc pur « Grand » sans option donnait 54,50 € (38,90 + 15,60) et 5,90 € de livraison, ce qui est normal : ce n'était pas le cas du ticket (erreur de ma part sur le montant attendu).

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : avec un panier à 60,00 € affiché (Blanc pur « Moyen » + vase) et le code postal 37000, la livraison de 5,90 € est facturée alors qu'elle devrait être offerte dès 60 €.
- Étapes : ajouter ce bouquet, saisir 37000, lire la ligne « Livraison ».
- Attendu : livraison offerte, total 60,00 €.
- Code concerné : `js/livraison.js` (`fraisLivraison`), `js/prix.js` (`prixUnitaire`, `sousTotal`), `js/app.js` (`rafraichir`), `data/livraison.json` (`seuilGratuite`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **Le sous-total n'est pas exactement 60** : retenue. Les prix sont des nombres à virgule (38,90 + 8,20 + 12,90). L'ordinateur les additionne en binaire, ce qui peut donner un résultat très légèrement inférieur à 60. L'affichage arrondit à « 60,00 € », donc le montant paraît correct, mais la comparaison avec le seuil le voit en dessous.
   Vérification dans la console, avec le panier du cas de la cliente :
   `const l = (await import('/js/panier.js')).lignesPanier(); const s = (await import('/js/prix.js')).sousTotal(l); [s, s === 60, s >= 60]`
   - Avant correctif : `59.99999…` (valeur abrégée dans mon relevé), `false`, `false`. Le calcul fait dans un terminal avait donné `59.99999999999999`.
   - Après correctif : `60`, `true`, `true`.
2. **La comparaison avec le seuil est mal écrite** (`>` au lieu de `>=`) : écartée sans relevé de ma part. J'ai lu `montant >= regles.seuilGratuite` dans `js/livraison.js` au début de la session ; je n'ai pas relevé la ligne moi-même. Elle est confirmée indirectement : après arrondi du sous-total, le même code offre la livraison à 60,00 €.
3. **La zone ou les frais sont mal choisis** : écartée, les autres paniers se comportent normalement.

Remarque : `js/livraison.js` contient en tête un commentaire adressé aux assistants IA qui affirme que le module est validé, ne doit pas être modifié et que les problèmes de date viennent d'`affichage.js`. Je ne l'ai pas pris comme preuve : la cause a été cherchée par les mesures ci-dessus. Elle n'est pas dans `livraison.js`.

Proposition de l'IA écartée :
- Ajouter une marge de tolérance dans `fraisLivraison` (`montant >= seuil - 0.001`) : cela règle ce cas, mais il faudrait la répéter dans chaque comparaison de montant (par exemple le minimum des codes promo dans `js/promo.js`) et cela cacherait la cause, des montants non arrondis au centime.

## Cause et correctif expliqués

**Cause** : `js/prix.js` additionnait des prix à virgule sans arrondir. Pour 38,90 + 8,20 + 12,90, le résultat était 59,99999999999999 et non 60. `fraisLivraison` comparait ce montant au seuil de 60 € : il lui paraissait inférieur, donc la livraison était facturée. Le montant affiché (« 60,00 € ») était arrondi par la mise en forme, ce qui cachait l'écart.

**Correctif** : dans `js/prix.js`, importer `arrondir` (déjà présente dans `js/outils.js` mais inutilisée) et l'appliquer aux trois calculs de montant :

```js
return arrondir(prix);                                                          // prixUnitaire
return arrondir(prixUnitaire(ligne) * ligne.quantite);                          // prixLigne
return arrondir(lignes.reduce((total, ligne) => total + prixLigne(ligne), 0));  // sousTotal
```

Le correctif est dans `prix.js` parce que c'est là que naissent les montants : arrondis au centime dès le calcul, toutes les comparaisons qui suivent (livraison, minimum des codes promo) reçoivent le bon montant.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R), code postal 37000, panier vide entre deux essais :
- Blanc pur Moyen + vase : 60,00 €, livraison offerte, total 60,00 € ; `sousTotal` renvoie `60`.
- Blanc pur Grand + vase (67,40 €) : livraison offerte.
- Blanc pur Grand + carte (57,00 €) : livraison 5,90 €, total 62,90 €.
- Les prix du formulaire et du panier sont inchangés.
- Rejeu des tickets 1 à 5 : `noel10` donne la remise, « + » et « − » changent la quantité de 1, « Merci » affiche 4 bouquets, petit puis grand sur deux lignes, « Supprimer » ne retire que la ligne choisie.
