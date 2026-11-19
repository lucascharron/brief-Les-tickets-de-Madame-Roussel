# Ticket 7 : le message de la carte coupé

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080 (Ctrl+Maj+R pour recharger sans cache), panier vide.
2. Cliquer sur « Composer » sur un bouquet et cocher « Carte avec votre message » : la zone « Votre message » apparaît.
3. Taper ou coller un texte de plus de 150 caractères.
4. Cliquer sur « Ajouter au panier » et regarder la ligne du panier.

Résultat observé :
- Le texte s'arrête à exactement 150 caractères, au milieu de la phrase.
- Aucun avertissement, aucun compteur.
- Le panier affiche « Petit, carte » : la carte est signalée, mais le contenu du message n'est pas visible.

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : dans la zone « Votre message » de la carte, le texte s'arrête à 150 caractères, sans avertissement. La cliente ne peut pas finir sa phrase.
- Étapes : cocher « Carte avec votre message », taper ou coller plus de 150 caractères.
- Attendu : la cliente comprend pourquoi elle est bloquée, ou peut écrire plus, selon la décision de Madame Roussel.
- Code concerné : `js/composition.js` (`preparerComposition`, `lireFormulaire`), `data/catalogue.json` (`options.carte.longueurMax`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **La limite est une valeur de configuration appliquée par `composition.js`** : retenue.
   Vérifications :
   - Onglet Éléments : `<textarea id="message-carte">` a `maxlength="150"`.
   - Console, `(await (await fetch('data/catalogue.json')).json()).options.carte` : `longueurMax` vaut `150`.
2. **La limite est appliquée deux fois** : retenue d'après la lecture du code, non mesurée dans le navigateur : l'attribut `maxlength` du champ (`preparerComposition`) et une coupure `message.slice(0, longueurMax)` dans `lireFormulaire`.
3. **Le panier ou le stockage coupe le message** : écartée, le panier n'affiche simplement pas le texte du message.

## Analyse et décision

Ce n'est pas un bug de calcul : la limite de 150 caractères est écrite dans les données, de façon voulue. La raison du choix de 150 n'est pas connue. Le défaut réel est qu'elle est invisible : pas de compteur, pas d'avertissement, donc la cliente croit à une panne.

Trois options ont été présentées :
- **A. Supprimer la limite** (la demande de Madame Roussel).
- **B. La relever** à une valeur choisie par Madame Roussel.
- **C. La garder en la rendant visible** (compteur « 120 / 150 »).

Ma recommandation était de demander à Madame Roussel pourquoi 150 avant de la retirer, et de proposer le compteur dans tous les cas. J'ai choisi l'option A, pour respecter sa demande. Cette décision et ses conséquences (plus aucune borne sur la longueur du message) sont à sa charge : le message à Madame Roussel le lui rappelle et lui propose le compteur.

## Cause et correctif expliqués

**Cause** : la limite de 150 caractères est écrite dans `data/catalogue.json` (`options.carte.longueurMax`) et appliquée à deux endroits de `js/composition.js` : en fixant `maxLength` sur le champ du message, et en coupant le texte avec `slice` à chaque modification.

**Correctif** : retirer la limite aux trois endroits, ensemble :
1. `data/catalogue.json` : `"longueurMax": 150` est retiré de l'option `carte`.
2. `js/composition.js`, `preparerComposition` : la ligne `document.querySelector("#message-carte").maxLength = reglesOptions.carte.longueurMax;` est supprimée.
3. `js/composition.js`, `lireFormulaire` : `options.message = options.carte ? message : "";` remplace la version avec `slice`.

Il faut les trois ensemble : si on retirait seulement la donnée du catalogue, la ligne du point 2 donnerait `maxLength = undefined`, interprété comme 0, et plus personne ne pourrait rien taper.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R), panier vide :
- Un texte de plus de 150 caractères s'affiche en entier, sans blocage, et on peut continuer à taper.
- `document.querySelector('#message-carte').maxLength` renvoie `-1` (aucune limite).
- Au panier : « Petit, carte », avec les 2,50 € de la carte inclus dans le prix.
- Le message est conservé : `(await import('/js/panier.js')).lignesPanier()[0].options.message.length` donne la longueur du texte saisi.
- Rejeu des tickets 1 à 6 : `noel10`, « + » et « − », « Merci » avec 4 bouquets, petit puis grand sur deux lignes, « Supprimer », Blanc pur Moyen + vase avec livraison offerte.
