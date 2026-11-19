# Ticket 1 : le code promo refusé

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080.
2. Cliquer sur « Composer » sur un bouquet, puis sur « Ajouter au panier ».
3. Dans « Code promo », saisir un code puis cliquer sur « Appliquer ». Noter le message et la ligne « Remise » du récapitulatif.
4. Répéter avec chaque saisie, en rechargeant la page entre deux essais :
   - `NOEL10` : « Code NOEL10 appliqué. », remise de 4,78 € sur 47,80 €.
   - `noel10` : « Ce code promo n'existe pas. »
   - `Noel10` : « Ce code promo n'existe pas. »
   - ` NOEL10` (espace avant) : « Ce code promo n'existe pas. »
   - `NOEL10 ` (espace après) : « Ce code promo n'existe pas. »

Résultat : seule la saisie exactement `NOEL10` est acceptée.

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : une cliente saisit NOEL10 sur téléphone et le site répond « Ce code promo n'existe pas ».
- Étapes : ajouter un bouquet au panier, saisir `noel10`, `Noel10`, ` NOEL10` ou `NOEL10 ` dans « Code promo », cliquer sur « Appliquer ».
- Attendu : le code est accepté et la remise appliquée, comme avec `NOEL10`.
- Code concerné : `js/promo.js`, fonction `appliquerPromo` ; `js/app.js`, `appliquerCode`.
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier dans le navigateur.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **Comparaison exacte dans `appliquerPromo`** (`js/promo.js`, `promo.code === saisie`) : retenue. Vérifiée par les cinq essais dans le navigateur et par la lecture de la ligne dans l'onglet Sources. Le point d'arrêt n'a pas donné de valeurs exploitables pour `noel10` (valeurs vides), je ne m'appuie donc pas dessus.
2. **Le téléphone envoie une majuscule ou un espace** : plausible, non confirmée sur un appareil réel. Vérification indirecte : le champ `#code-promo` n'a que `id`, `type="text"` et `class`, aucun attribut `autocapitalize`, `autocorrect` ou `spellcheck` (onglet Éléments).
3. **`js/promotions.js` n'est pas utilisé** : ce module gère la casse et les espaces mais `app.js` importe seulement `promo.js`. Pas la cause directe. Pas vérifié dans l'onglet Network.
4. **Données mal chargées** : écartée, puisque `NOEL10` exact fonctionne.

Propositions de l'IA écartées :
- Brancher `promotions.js` à la place de `promo.js` : sa signature est différente (il prend la liste en paramètre et renvoie un nombre, pas `{ valide, remise, message }`), cela casserait `app.js`.
- Ajouter `autocapitalize="none"` sur le champ : cela ne traite que l'apparence du problème, ne règle pas l'espace en trop, et ne corrige pas la comparaison.

## Cause et correctif expliqués

**Cause** : `appliquerPromo` (`js/promo.js`) comparait le texte saisi tel quel au code de `data/promos.json` (`"NOEL10"`) avec `===`. Une minuscule, une majuscule en début de saisie ou un espace en trop suffisent à faire échouer la comparaison, d'où « Ce code promo n'existe pas ». Sur un téléphone, le clavier peut changer la casse ou ajouter un espace, ce qui n'arrive pas sur l'ordinateur de la propriétaire.

**Correctif** : dans `appliquerPromo`, la saisie est d'abord nettoyée (`trim()` retire les espaces au début et à la fin, `toUpperCase()` passe en majuscules), puis comparée :

```js
const code = saisie.trim().toUpperCase();
const regle = promos.find((promo) => promo.code === code);
```

Le correctif est dans cette fonction parce que c'est là que la comparaison échoue, et qu'elle est appelée à deux endroits de `app.js` (au clic sur « Appliquer » et à chaque mise à jour du récapitulatif).

## Vérification

Après correctif, avec un bouquet dans le panier :
- `NOEL10`, `noel10`, `Noel10`, ` NOEL10` et `NOEL10 ` sont acceptés, avec la même remise.
- `FAUX` est toujours refusé (« Ce code promo n'existe pas. »).
- Après rechargement de la page avec un code appliqué, la remise reste.

Non vérifié : le comportement sur un vrai téléphone.
