# Ticket 10 : « NaN € » dans le panier

## Étapes pour reproduire le problème

Le problème ne touche qu'une cliente fidèle, qui commandait avant la version 2. Les autres clientes et Madame Roussel n'ont rien. La piste : une sauvegarde de l'ancien panier dans son navigateur.

Information du cahier des charges (trouvée par moi, décisive) : « La version 2, mise en ligne en septembre 2026, a ajouté la composition des bouquets (tailles et options) et un nouveau panier. Les paniers enregistrés par la version 1 ne sont pas repris. »

1. Lancer `npm run serve` et ouvrir http://localhost:8080.
2. Relever la valeur actuelle de la clé `panier-roussel` (F12, onglet Application, Stockage local) : `{"version":2,"lignes":[],"codePromo":""}`.
3. Simuler une ancienne sauvegarde dans la Console, puis recharger :
   ```js
   localStorage.setItem("panier-roussel", '{"version":1,"lignes":[{"bouquetId":"pivoine-poudree"}],"codePromo":""}')
   location.reload()
   ```

Résultat observé : « NaN € » à la place du prix de la ligne.

Limites :
- Le vrai format de la version 1 est inconnu. Cette sauvegarde est une construction de ma part (un identifiant de bouquet, sans quantité), pas le panier réel de la cliente.
- Les premiers essais n'ont rien montré à l'écran : une première simulation (`[{ nom, prix, quantite }]`), puis la simulation avec `version: 1` suivie de F5. Pour la première, la simulation de l'IA dans un terminal prévoyait un prix de 0 et non « NaN ». Le « NaN € » n'est apparu qu'ensuite, en suivant des étapes plus précises.
- Le « elle ne peut plus commander » du ticket n'a pas été reproduit ni expliqué : je n'ai observé que l'affichage « NaN € ».

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : le panier d'une cliente qui commandait avant la version 2 affiche « NaN € » à la place des prix, et elle ne peut plus commander. Les autres clientes n'ont aucun problème.
- Étapes : le navigateur de la cliente contient une sauvegarde de la version 1 (clé `panier-roussel`) ; l'ouverture de la boutique la recharge.
- Attendu : une sauvegarde de la version 1 est ignorée (cahier des charges) et le panier démarre vide.
- Code concerné : `js/stockage.js` (`chargerPanier`, `VERSION`), `js/prix.js` (`prixUnitaire`, `prixLigne`), `js/app.js` (`demarrer`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **La sauvegarde est rechargée sans contrôle de version** : retenue. `chargerPanier` (`js/stockage.js`) ne compare pas la `version` enregistrée à `VERSION` et accepte même une simple liste (`donnees.lignes || donnees`). Une ancienne ligne est donc lue comme une ligne actuelle.
   Vérification : dans le navigateur, avec la sauvegarde `version: 1` ci-dessus, le panier affiche « NaN € ». Vérification complémentaire de l'IA dans un terminal avec une fausse mémoire de navigateur (pas une preuve dans le navigateur) : une ligne sans `quantite` donne `NaN` au prix de ligne et au sous-total, que la sauvegarde ait `version: 1` ou soit une simple liste.
2. **« NaN » vient d'un champ manquant dans une ancienne ligne** : retenue comme mécanisme, non confirmée pour la cliente. `prixLigne` (`js/prix.js`) multiplie le prix par `ligne.quantite` : un nombre multiplié par une valeur manquante donne `NaN`. Je ne sais pas quels champs avait réellement la version 1.
3. **Un problème de calcul de la version 2** : écartée, les autres clientes n'ont pas le problème.

Propositions de l'IA écartées :
- Rendre le calcul tolérant dans `js/prix.js` (par exemple compter une quantité manquante pour 1) : cela traiterait le symptôme et garderait dans le panier des lignes invalides, contrairement au cahier des charges.
- Nettoyer chaque ligne une par une au chargement : plus long et plus fragile que de rejeter une sauvegarde d'une version qu'on ne reprend pas.

## Cause et correctif expliqués

**Cause** : `chargerPanier` (`js/stockage.js`) lisait la sauvegarde du navigateur sans regarder sa version. Le site écrit bien `version: 2`, mais à la lecture il ne la contrôlait pas et acceptait même une simple liste. Une cliente qui avait un panier de la version 1 dans son navigateur le retrouvait chargé comme des lignes de la version 2, dont les champs manquaient ou différaient : le prix de la ligne devenait `NaN`. Les autres clientes n'ont pas de vieux panier enregistré, d'où un problème limité à elle. Le cahier des charges dit pourtant que ces paniers ne sont pas repris : le code n'appliquait pas cette règle.

**Correctif** : dans `chargerPanier`, une sauvegarde dont la version n'est pas la version actuelle est ignorée :

```js
const donnees = JSON.parse(brut);
// Les paniers enregistrés par une autre version (la version 1) ne sont pas repris.
if (donnees.version !== VERSION) {
  return { lignes: [], codePromo: "" };
}
return { lignes: donnees.lignes || [], codePromo: donnees.codePromo || "" };
```

Le correctif est dans `stockage.js` parce que c'est là que la sauvegarde est lue. Le site réécrit ensuite la clé au bon format dès le premier rafraîchissement, donc la vieille sauvegarde disparaît d'elle-même. Les paniers de la version 2 continuent d'être rechargés.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R) :
- Sauvegarde `{"version":1,...}` : le panier est vide, plus de « NaN € », et la clé revient au format `{"version":2,"lignes":[],"codePromo":""}`.
- Liste sans version : panier vide.
- Panier de la version 2 (bouquet ajouté, `noel10` appliqué, puis F5) : le bouquet et la remise restent.
- Clé supprimée (`localStorage.removeItem("panier-roussel")`), rechargement : panier vide, pas d'erreur dans la Console.
- Rejeu des tickets 1 à 9 : `noel10`, « + » et « − », « Merci » avec 4 bouquets, petit puis grand sur deux lignes, « Supprimer », Blanc pur Moyen + vase avec livraison offerte, message de carte de plus de 150 caractères, moment de livraison dans le message, jours de livraison sans dimanche.
