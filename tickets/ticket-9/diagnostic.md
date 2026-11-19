# Prompt de diagnostic : ticket 9 (une livraison le dimanche)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
La liste « Jour » propose « dimanche 15 novembre » et aucun samedi, alors que la boutique est fermée le dimanche.

## Étapes pour reproduire
Ouvrir `?maintenant=2026-11-14T10:00`, ouvrir la liste « Jour ».

## Résultat attendu
Lundi 16 au samedi 21 novembre.

## Code concerné
`js/livraison.js` (`joursDeLivraison`) ; `js/affichage.js` (`afficherJours`) ; `js/outils.js` (`formaterDate`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **Décalage par conversion en heure universelle (UTC)** : retenue. `joursDeLivraison` (`js/livraison.js`) fabriquait le texte du jour avec `toISOString()`, qui passe en UTC : en France en novembre, un lundi 16 à minuit local devient `"2026-11-15"`. Vérifiée dans la console : `joursDeLivraison(new Date('2026-11-14T10:00'))` donne `'2026-11-15'` en premier jour (au lieu du 16), `new Date(2026, 10, 16).toISOString()` donne `'2026-11-15T23:00:00.000Z'` et `new Date(2026, 10, 16).getDay()` donne `1` (lundi), donc le test des jours fermés est correct.
2. **L'affichage lit aussi la date en UTC** (`new Date("2026-11-15")` dans `afficherJours`) : non confirmée, raisonnement seulement. En France, l'affichage reste fidèle au texte reçu.
3. **Jour de fermeture mal réglé** (`joursFermes`) : écartée, `[0]` correspond au dimanche.

Le commentaire en tête de `js/livraison.js`, qui affirmait que le module était sans erreur et que la cause était dans `affichage.js`, n'a pas été pris comme preuve.
