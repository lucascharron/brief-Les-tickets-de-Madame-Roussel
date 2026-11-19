# Ticket 4 : deux tailles, deux grands bouquets

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080 (Ctrl+Maj+R pour recharger sans cache), panier vide.
2. Cliquer sur « Composer » sur Pivoine poudrée, laisser la taille « Petit », puis « Ajouter au panier ».
3. Dans le même formulaire, choisir « Grand », puis « Ajouter au panier ».

Résultat observé :
- Après l'étape 2 : une Pivoine poudrée « Petit » à 34,90 €.
- Formulaire en « Grand » : prix 50,50 € (34,90 + 15,60, correct).
- Après l'étape 3 : deux Pivoine poudrée « Grand » à 101,00 €, au lieu d'une « Petit » et d'une « Grand ».

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : j'ajoute une Pivoine poudrée « Petit », puis je choisis « Grand » et je l'ajoute : le panier contient 2 Pivoine poudrée « Grand » (101,00 €) au lieu d'un petit et d'un grand.
- Étapes : composer Pivoine poudrée en « Petit », ajouter au panier, choisir « Grand » dans le même formulaire, ajouter au panier.
- Attendu : deux lignes, une « Petit » à 34,90 € et une « Grand » à 50,50 €.
- Code concerné : `js/composition.js` (`options`, `ajouter`), `js/app.js` (`quandAjoute`), `js/panier.js` (`ajouterAuPanier`, `memesOptions`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **La ligne du panier partage le même objet `options` que le formulaire** : retenue.
   Vérification dans la console, sans recharger la page :
   - Après avoir ajouté la « Petit » : `const l = (await import('/js/panier.js')).lignesPanier(); l[0].options.taille` donne `'petit'`.
   - Après avoir coché « Grand » **sans cliquer sur « Ajouter au panier »** : `l[0].options.taille` donne `'grand'`. La ligne déjà dans le panier a changé sans qu'on y touche.
   - Un premier essai avait donné `'petit'` aux deux relevés. Il n'était pas concluant : je ne savais pas si « Grand » était coché entre les deux commandes ni si la page avait été rechargée (un rechargement relit le panier depuis le stockage, avec des objets séparés du formulaire). Refait sans rechargement, avec « Grand » coché vérifié à l'écran, le résultat est `'grand'`.
2. **La fusion des lignes en découle** : au deuxième ajout, `ajouterAuPanier` cherche une ligne avec les mêmes options (`memesOptions`). La ligne et le formulaire étant le même objet, la comparaison les trouve forcément identiques et augmente la quantité à 2. Cohérent avec le résultat observé (2 grandes à 101,00 €). Non testée séparément.
3. **Le calcul du prix est faux** : écartée, 34,90 + 15,60 = 50,50 et 2 × 50,50 = 101,00.

Propositions de l'IA écartées :
- Copier les options seulement dans `composition.js` (`quandAjoute(bouquetCourant.id, { ...options })`) : cela règle ce cas, mais le panier resterait fragile pour tout autre appelant.
- Recréer un nouvel objet `options` à chaque ouverture du formulaire : cela ne couvre pas deux ajouts successifs avec le même formulaire, qui est le cas de la cliente.

## Cause et correctif expliqués

**Cause** : `composition.js` garde les choix du formulaire dans un seul objet `options`, modifié à chaque changement du formulaire. `ajouterAuPanier` (`js/panier.js`) rangeait cet objet lui-même dans la ligne du panier, sans le copier. La ligne « Petit » et le formulaire étaient donc le même objet : choisir « Grand » changeait la ligne déjà ajoutée. Au deuxième ajout, la comparaison entre la ligne et le formulaire (le même objet) les jugeait identiques, et la quantité passait à 2.

**Correctif** : dans `ajouterAuPanier`, la ligne reçoit une copie des options :

```js
lignes.push({ bouquetId, options: { ...options }, quantite: 1 });
```

Le correctif est dans `panier.js` parce que c'est le panier qui conserve les données : il ne doit pas dépendre du comportement de celui qui l'appelle.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R), panier vide :
- Petit puis Grand dans le même formulaire : deux lignes (« Petit » 34,90 € et « Grand » 50,50 €).
- Cocher « Grand » après l'ajout ne change pas la ligne du panier.
- Deux fois la même composition : une seule ligne, quantité 2.
- Même bouquet avec et sans vase : deux lignes distinctes.
- Rejeu des tickets 1, 2 et 3 : `noel10` donne la remise, « + » et « − » changent la quantité de 1, « Merci » affiche 4 bouquets dont « Le petit mot ».
