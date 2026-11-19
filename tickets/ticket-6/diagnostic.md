# Prompt de diagnostic : ticket 6 (la livraison facturée à 60 €)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Avec un panier à 60,00 € affiché (Blanc pur « Moyen » + vase) et le code postal 37000, la livraison de 5,90 € est facturée alors qu'elle devrait être offerte dès 60 €.

## Étapes pour reproduire
Ajouter ce bouquet, saisir 37000, lire la ligne « Livraison ».

## Résultat attendu
Livraison offerte, total 60,00 €.

## Code concerné
`js/livraison.js` (`fraisLivraison`) ; `js/prix.js` (`prixUnitaire`, `sousTotal`) ; `js/app.js` (`rafraichir`) ; `data/livraison.json` (`seuilGratuite`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **Le sous-total n'est pas exactement 60** : retenue. Les prix à virgule (38,90 + 8,20 + 12,90) sont additionnés en binaire, ce qui donne un résultat très légèrement inférieur à 60, alors que l'affichage arrondit à « 60,00 € ». Vérifiée dans la console avec `[s, s === 60, s >= 60]` : avant correctif `59.99999…`, `false`, `false` ; après correctif `60`, `true`, `true`. Un calcul dans un terminal avait donné `59.99999999999999`.
2. **Comparaison avec le seuil mal écrite** (`>` au lieu de `>=`) : écartée. `montant >= regles.seuilGratuite` a été lu par l'IA dans `js/livraison.js`, non relevé par l'utilisateur. Confirmée indirectement : après arrondi, le même code offre la livraison à 60,00 €.
3. **Zone ou frais mal choisis** : écartée, les autres paniers se comportent normalement.
