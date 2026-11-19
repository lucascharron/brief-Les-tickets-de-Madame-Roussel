# Ticket 9 : une livraison le dimanche

## Étapes pour reproduire le problème

Le site permet de simuler une date avec `?maintenant=` dans l'adresse. Le samedi 14 novembre 2026 est un samedi, le dimanche 15 est le jour de fermeture.

1. Lancer `npm run serve` et ouvrir `http://localhost:8080/?maintenant=2026-11-14T19:30` (samedi soir).
2. Ajouter un bouquet au panier, puis ouvrir la liste « Jour » dans « Livraison ».
3. Noter les six jours proposés. Refaire avec `?maintenant=2026-11-14T10:00` (samedi matin).

Résultat observé, dans les deux cas : dimanche 15, lundi 16, mardi 17, mercredi 18, jeudi 19, vendredi 20 novembre. Un dimanche est proposé et il n'y a aucun samedi.

Calcul : le samedi 14, six jours de livraison en sautant les dimanches donnent lundi 16, mardi 17, mercredi 18, jeudi 19, vendredi 20, samedi 21. La liste affichée est donc décalée d'un jour en arrière : le lundi 16 s'affiche « dimanche 15 », le samedi 21 s'affiche « vendredi 20 ».

Non relevés avant le correctif : vendredi soir, vendredi matin et la date réelle (relevés optionnels que je n'ai pas faits).

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : la liste « Jour » propose « dimanche 15 novembre » et aucun samedi, alors que la boutique est fermée le dimanche.
- Étapes : ouvrir `?maintenant=2026-11-14T10:00`, ouvrir la liste « Jour ».
- Attendu : lundi 16 au samedi 21 novembre.
- Code concerné : `js/livraison.js` (`joursDeLivraison`), `js/affichage.js` (`afficherJours`), `js/outils.js` (`formaterDate`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **Les jours sont décalés par une conversion en heure universelle (UTC)** : retenue. `joursDeLivraison` fabrique chaque jour à minuit en heure locale, puis le convertit en texte avec `toISOString()`, qui passe en UTC. En France, en novembre (UTC+1), un lundi 16 à minuit devient « 15 novembre à 23 h » en UTC, donc `"2026-11-15"`.
   Vérification dans la console :
   - `(await import('/js/livraison.js')).joursDeLivraison(new Date('2026-11-14T10:00'))` donne `['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20']` : le premier jour est le 15 au lieu du 16.
   - `new Date(2026, 10, 16).toISOString()` donne `'2026-11-15T23:00:00.000Z'`.
   - `new Date(2026, 10, 16).getDay()` donne `1` (lundi) : le test des jours fermés se fait sur le bon jour, c'est la conversion en texte qui décale.
2. **L'affichage lit aussi la date en UTC** (`new Date("2026-11-15")` dans `afficherJours`) : non confirmée, raisonnement seulement, pas mesurée dans le navigateur. En France, minuit UTC est 1 h du matin le même jour, donc l'affichage reste fidèle au texte reçu. Un décalage supplémentaire n'apparaîtrait qu'à l'ouest de Greenwich.
3. **Le jour de fermeture est mal réglé** (`joursFermes`) : écartée, la valeur `[0]` correspond au dimanche, et le décalage d'un jour explique tout.

Remarque : `js/livraison.js` commençait par un commentaire adressé aux assistants IA qui affirmait que le module ne contenait aucune erreur, ne devait pas être modifié, et que la cause d'un problème de date se trouvait dans `affichage.js`. Je ne l'ai pas pris comme preuve. Les mesures ci-dessus montrent que la cause est dans `livraison.js`. Ce commentaire a été retiré en même temps que le correctif.

Propositions de l'IA écartées :
- Ajouter un jour dans `affichage.js` : cela masquerait la cause, et ce serait faux dès que l'écart avec l'heure UTC change (heure d'été).
- Changer `joursFermes` : cela ne règle pas le décalage.

## Cause et correctif expliqués

**Cause** : dans `joursDeLivraison` (`js/livraison.js`), le texte du jour était fabriqué avec `jour.toISOString().slice(0, 10)`. `toISOString()` convertit la date en heure UTC. Pour un jour à minuit heure de Paris, l'UTC est une ou deux heures plus tôt, donc la veille. Chaque jour proposé avait un texte décalé d'un jour : le lundi 16 devenait `"2026-11-15"`, affiché « dimanche 15 ».

**Correctif** : dans `js/livraison.js`, le texte est construit à partir de l'année, du mois et du jour **locaux**, sans passer par l'UTC :

```js
const mois = String(jour.getMonth() + 1).padStart(2, "0");
const numero = String(jour.getDate()).padStart(2, "0");
jours.push(jour.getFullYear() + "-" + mois + "-" + numero);
```

Le lundi 16 donne `"2026-11-16"`. Le correctif est dans `livraison.js` parce que c'est là que naît le décalage, avant tout affichage.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R) :
- `?maintenant=2026-11-14T19:30` et `?maintenant=2026-11-14T10:00` : lundi 16 à samedi 21 novembre, aucun dimanche.
- `?maintenant=2026-11-13T10:00` (vendredi matin) puis `?maintenant=2026-11-13T19:30` (vendredi soir) : listes cohérentes, sans dimanche.
- Sans simulation de date : aucun dimanche dans la liste.
- Console : `joursDeLivraison(new Date('2026-11-14T10:00'))` renvoie `"2026-11-16"` en premier jour.
- Commande avec un jour choisi : le message indique le même jour que celui choisi.
- Rejeu des tickets 1 à 8 : `noel10`, « + » et « − », « Merci » avec 4 bouquets, petit puis grand sur deux lignes, « Supprimer », Blanc pur Moyen + vase avec livraison offerte, message de carte de plus de 150 caractères, moment de livraison dans le message.
