# Ticket 3 : un bouquet absent de l'occasion « Merci »

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080 (Ctrl+Maj+R pour recharger sans cache).
2. Dans « Nos bouquets », cliquer sur chaque occasion et noter les bouquets affichés.

Résultat observé :
- Toutes : 6 bouquets, dont « Le petit mot ».
- Merci : Champêtre, Soleil d'automne, Blanc pur. « Le petit mot » est absent.
- Anniversaire : Pivoine poudrée, Roses rouges.
- Amour : Roses rouges.
- Mariage : Blanc pur.
- Pour le plaisir : Pivoine poudrée, Champêtre, Soleil d'automne, Le petit mot.

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : avec l'occasion « Merci », « Le petit mot » n'apparaît pas, alors qu'il apparaît avec « Toutes ».
- Étapes : ouvrir la boutique, cliquer sur l'occasion « Merci », regarder les bouquets affichés.
- Attendu : « Le petit mot » apparaît avec « Merci ».
- Code concerné : `js/affichage.js` (`afficherCatalogue`, filtre sur les occasions), `data/catalogue.json` (les `occasions` de chaque bouquet), `js/app.js` (`preparerFiltres`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **Les `occasions` de « Le petit mot » ne contiennent pas exactement l'identifiant de l'occasion « Merci »** : retenue.
   Vérification dans la console :
   - `(await (await fetch('data/catalogue.json')).json()).occasions` : l'identifiant de « Merci » est `merci` (minuscules).
   - Occasions des bouquets : Champêtre `plaisir | merci`, Blanc pur `mariage | merci`, Soleil d'automne `merci | plaisir`, Le petit mot `Merci | plaisir` (M majuscule, seul dans ce cas).
   - `['Merci', 'plaisir'].includes('merci')` donne `false` ; `['merci', 'plaisir'].includes('merci')` donne `true`.
2. **Le filtre lui-même est défectueux** : écartée, les autres bouquets s'affichent correctement dans leurs occasions, et « Le petit mot » apparaît avec « Pour le plaisir ».
3. **L'identifiant du bouton radio « Merci » est mal créé** : écartée, Champêtre, Soleil d'automne et Blanc pur apparaissent sous « Merci ».
4. **Le bouquet n'a aucune occasion** : écartée, il apparaît avec « Pour le plaisir ».

Question posée pendant la vérification : « manque-t-il une apostrophe avant `Merci` ? ». Non : les guillemets et apostrophes de la console sont seulement l'affichage des chaînes de caractères.

Proposition de l'IA écartée :
- Rendre le filtre de `afficherCatalogue` insensible à la casse : cela masquerait l'erreur de données au lieu de la corriger, et le fichier garderait une incohérence.

## Cause et correctif expliqués

**Cause** : le filtre de `afficherCatalogue` (`js/affichage.js`) utilise `bouquet.occasions.includes(occasion)`, qui distingue les majuscules des minuscules. Dans `data/catalogue.json`, l'occasion de « Le petit mot » était écrite `"Merci"` alors que l'identifiant de l'occasion est `"merci"`. La comparaison échouait donc pour ce bouquet seulement.

**Correctif** : dans `data/catalogue.json`, les occasions de « Le petit mot » passent de `["Merci", "plaisir"]` à `["merci", "plaisir"]`. Le correctif est dans les données parce que c'est là que l'erreur est née : tous les autres bouquets utilisent déjà l'identifiant en minuscules.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R) :
- Merci : « Le petit mot » apparaît avec Champêtre, Soleil d'automne et Blanc pur.
- Pour le plaisir, Anniversaire, Amour, Mariage et Toutes : inchangés.
- Rejeu du ticket 1 : `noel10` donne la remise.
- Rejeu du ticket 2 : « + » ajoute 1 par clic, « − » retire 1.
