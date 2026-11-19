# Prompt de diagnostic : ticket 1 (le code promo refusé)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Une cliente saisit NOEL10 sur téléphone et le site répond « Ce code promo n'existe pas ». Sur l'ordinateur de la propriétaire, le code fonctionne.

## Étapes pour reproduire
Ajouter un bouquet au panier, saisir `noel10`, `Noel10`, ` NOEL10` ou `NOEL10 ` dans « Code promo », cliquer sur « Appliquer ».

## Résultat attendu
Le code est accepté et la remise appliquée, comme avec `NOEL10`.

## Code concerné
`js/promo.js` (fonction `appliquerPromo`) ; `js/app.js` (`appliquerCode`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **Comparaison exacte du code** : retenue. `appliquerPromo` (`js/promo.js`) compare `promo.code === saisie`, sans majuscules ni retrait des espaces. Vérifiée par les cinq saisies dans le navigateur (seule `NOEL10` exacte acceptée) et par la lecture de la ligne dans l'onglet Sources. Le point d'arrêt n'a pas donné de valeurs exploitables.
2. **Le téléphone envoie une majuscule ou un espace** : plausible, non confirmée sur un appareil réel. Vérifiée indirectement : le champ `#code-promo` n'a que `id`, `type="text"` et `class`, sans `autocapitalize`, `autocorrect` ni `spellcheck`.
3. **`js/promotions.js` non utilisé** : pas la cause directe, non vérifié dans l'onglet Network.
4. **Données mal chargées** : écartée, `NOEL10` exact fonctionne.
