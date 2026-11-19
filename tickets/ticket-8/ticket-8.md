# Ticket 8 : livrée le matin au lieu de l'après-midi

## Étapes pour reproduire le problème

1. Lancer `npm run serve` et ouvrir http://localhost:8080 (Ctrl+Maj+R pour recharger sans cache), panier vide.
2. Ajouter un bouquet au panier (par exemple Pivoine poudrée).
3. Dans « Livraison », saisir le code postal `37000`, choisir un jour, cocher « Après-midi » dans « Moment ».
4. Cliquer sur « Commander » et lire le message de confirmation.
5. Refaire avec « Matin » coché, puis en changeant plusieurs fois de moment (Après-midi, Matin, Après-midi) avant de commander.

Résultat observé, pour tous les essais : « Merci ! Votre commande est enregistrée pour le lundi 23 novembre (matin). ». Le message dit « matin » quel que soit le moment coché.

## Prompts utilisés

Prompt de diagnostic (modèle de `prompts/diagnostic.md`) :

- Symptôme : le message de confirmation indique toujours « matin », même quand « Après-midi » est coché.
- Étapes : bouquet au panier, code postal 37000, jour choisi, « Après-midi » coché, clic sur « Commander ».
- Attendu : le message indique « après-midi ».
- Code concerné : `js/app.js` (`commander`), `js/affichage.js` (`afficherMoments`), `index.html` (`#choix-moment`).
- Demande : des hypothèses sur la cause, sans correctif, avec la façon de les vérifier.

## Hypothèses de l'IA (retenues ou écartées) et comment je les ai vérifiées

1. **Le moment est lu sur le mauvais bouton** : retenue. Dans `commander`, le code cherchait un bouton radio « moment » sans demander lequel est coché : le navigateur renvoie le premier de la liste, toujours « Matin ».
   Vérification dans la console, avec « Après-midi » coché :
   - `document.querySelector("input[name=moment]").value` donne `'matin'`.
   - `document.querySelector("input[name=moment]:checked").value` donne `'apres-midi'`.
2. **Les boutons radio ne sont pas bien reliés entre eux** : écartée, « Après-midi » se coche et « Matin » se décoche à l'écran.
3. **Le moment choisi est perdu avant la commande** : écartée, l'hypothèse 1 suffit à expliquer tous les relevés, et la valeur du bouton coché est bien `'apres-midi'`.

Proposition de l'IA écartée :
- Mémoriser le moment dans l'état de la page à chaque changement : cela ajouterait du code et un second endroit où le moment pourrait se désynchroniser du formulaire.

## Cause et correctif expliqués

**Cause** : dans `commander` (`js/app.js`), le moment était lu avec `document.querySelector("input[name=moment]")`. Sans précision, `querySelector` renvoie le **premier** élément qui correspond, ici le bouton « Matin », même si « Après-midi » est coché. Le message de confirmation lisait donc toujours le texte de « Matin ».

**Correctif** : demander explicitement le bouton coché :

```js
const moment = document.querySelector("input[name=moment]:checked");
```

La suite du code lit le texte qui suit ce bouton (`moment.nextSibling.textContent`), qui est bien « Matin » ou « Après-midi » pour le bouton coché. Le correctif est à cet endroit parce que c'est la seule ligne qui lit le moment choisi.

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R) :
- « Après-midi » coché : le message finit par « (après-midi). ».
- « Matin » coché : « (matin). ».
- Après plusieurs changements de moment avant de commander : le message suit le dernier choix.
- Cas d'erreur inchangés : panier vide, code postal non livré, jour non choisi.
- Rejeu des tickets 1 à 7 : `noel10`, « + » et « − », « Merci » avec 4 bouquets, petit puis grand sur deux lignes, « Supprimer », Blanc pur Moyen + vase avec livraison offerte, message de carte de plus de 150 caractères.
