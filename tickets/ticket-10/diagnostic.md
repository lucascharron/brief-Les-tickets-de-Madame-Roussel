# Prompt de diagnostic : ticket 10 (« NaN € » dans le panier)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Le panier d'une cliente qui commandait avant la version 2 affiche « NaN € » à la place des prix, et elle ne peut plus commander. Les autres clientes n'ont aucun problème.

## Étapes pour reproduire
Le navigateur de la cliente contient une sauvegarde de la version 1 (clé `panier-roussel`) ; l'ouverture de la boutique la recharge.

## Résultat attendu
Une sauvegarde de la version 1 est ignorée (cahier des charges) et le panier démarre vide.

## Code concerné
`js/stockage.js` (`chargerPanier`, `VERSION`) ; `js/prix.js` (`prixUnitaire`, `prixLigne`) ; `js/app.js` (`demarrer`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **La sauvegarde est rechargée sans contrôle de version** : retenue. `chargerPanier` (`js/stockage.js`) ne compare pas la `version` enregistrée à `VERSION` et accepte même une simple liste. Vérifiée dans le navigateur avec une sauvegarde de test `{"version":1,"lignes":[{"bouquetId":"pivoine-poudree"}],"codePromo":""}` : le panier affiche « NaN € ». Cette sauvegarde est une construction, pas le panier réel de la cliente. Vérification complémentaire de l'IA dans un terminal, pas dans le navigateur.
2. **« NaN » vient d'un champ manquant dans une ancienne ligne** : retenue comme mécanisme, non confirmée pour la cliente. `prixLigne` multiplie le prix par `ligne.quantite`, et une valeur manquante donne `NaN`. Le vrai format de la version 1 est inconnu.
3. **Problème de calcul de la version 2** : écartée, les autres clientes n'ont pas le problème.
