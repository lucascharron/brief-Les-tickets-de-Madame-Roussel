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

Prompt de diagnostic (modèle de `prompts/diagnostic.md`, rempli dans `diagnostic.md`) :

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
2. **La limite est appliquée deux fois** : retenue d'après la lecture du code, non mesurée dans le navigateur. L'attribut `maxlength` du champ (`preparerComposition`) et une coupure `message.slice(0, longueurMax)` dans `lireFormulaire`.
3. **Le panier ou le stockage coupe le message** : écartée, le panier n'affiche simplement pas le texte du message.
4. **La limite est voulue** : confirmée plus tard par le cahier des charges (voir ci-dessous).

## Analyse et décision

Ce n'est pas un bug de calcul : la limite de 150 caractères est écrite dans les données, de façon voulue. Le défaut réel est qu'elle est invisible : pas de compteur, pas d'avertissement, donc la cliente croit à une panne.

Trois options avaient été présentées : A supprimer la limite (la demande de Madame Roussel), B la relever, C la garder en la rendant visible (compteur).

**Première décision, corrigée.** J'avais d'abord choisi l'option A pour respecter la demande de Madame Roussel, et supprimé la limite (commit `9785838`). À ce moment-là, je n'avais pas lu le cahier des charges (le PDF a été fourni après la clôture des dix tickets). Ma recommandation avait pourtant été de demander d'abord pourquoi 150, et de proposer le compteur.

**Ce que dit le cahier des charges** : « Le message de la carte compte 150 caractères au plus. La carte imprimée mesure 8 × 5 cm : au-delà, le texte ne tient pas. Ce choix a été fait par Madame Roussel avec son imprimeur. » Supprimer la limite contredisait donc une règle qu'elle a elle-même validée, avec un risque réel : des messages qui ne tiennent pas sur la carte imprimée.

**Décision finale** : rétablir la limite de 150 caractères et la rendre visible (option C). La suppression de la limite reste possible, mais seulement avec l'accord explicite de Madame Roussel : le message le lui explique et lui demande comment traiter les messages longs (par exemple une carte plus grande, à voir avec son imprimeur).

Proposition de l'IA écartée :
- Supprimer la limite, comme le demandait le ticket : contraire au cahier des charges, risque d'impression.

## Cause et correctif expliqués

**Cause** : la limite de 150 caractères est une règle du cahier des charges (carte de 8 × 5 cm), écrite dans `data/catalogue.json` (`options.carte.longueurMax`) et appliquée à deux endroits de `js/composition.js` : en fixant `maxLength` sur le champ du message, et en coupant le texte avec `slice` à chaque modification. Ce qui posait problème n'est pas la limite, mais qu'elle était invisible : le texte s'arrêtait sans explication.

**Correctif** (après rétablissement de la limite, le commit `9785838` n'étant pas réécrit) :
1. `data/catalogue.json` : `"longueurMax": 150` est de retour dans l'option `carte`.
2. `js/composition.js`, `preparerComposition` : la ligne `document.querySelector("#message-carte").maxLength = reglesOptions.carte.longueurMax;` est rétablie.
3. `js/composition.js`, `lireFormulaire` : `options.message = options.carte ? message.slice(0, reglesOptions.carte.longueurMax) : "";` est rétabli.
4. `js/composition.js` : une nouvelle fonction `afficherCompteur` affiche « nombre de caractères / 150 » ; elle est appelée à l'ouverture du formulaire (`remplirFormulaire`) et à chaque changement (`lireFormulaire`).
5. `index.html` : sous le champ du message, la phrase « x / 150 caractères. La carte imprimée mesure 8 × 5 cm : au-delà de la limite, le texte ne tient pas. », avec des classes Tailwind déjà présentes dans `dist/output.css`.

La limite n'est pas dupliquée dans le texte : le nombre vient de `longueurMax`, donc un changement de la règle se fait à un seul endroit (le catalogue).

## Vérification

Après correctif, après rechargement (Ctrl+Maj+R), panier vide, résultats confirmés par moi :
- La carte cochée affiche « 0 / 150 caractères. » avec la phrase sur la carte de 8 × 5 cm.
- Le compteur suit la saisie.
- Un texte de plus de 150 caractères collé s'arrête à exactement 150, le compteur affiche « 150 / 150 ».
- `document.querySelector('#message-carte').maxLength` renvoie `150`.
- Au panier : « Petit, carte », avec 2,50 € de plus ; le message conservé fait 150 caractères au plus.
- Un autre bouquet ouvert dans « Composer » : le compteur repart à « 0 / 150 ».
- Rejeu des tickets 1 à 10 : tout fonctionne.
