# Prompt de diagnostic : ticket 8 (livrée le matin au lieu de l'après-midi)

Je travaille sur la boutique en ligne Fleurs Roussel (JavaScript, modules ES, Tailwind, sans framework).

## Symptôme
Le message de confirmation indique toujours « matin », même quand « Après-midi » est coché.

## Étapes pour reproduire
Bouquet au panier, code postal 37000, jour choisi, « Après-midi » coché, clic sur « Commander ».

## Résultat attendu
Le message indique « après-midi ».

## Code concerné
`js/app.js` (`commander`) ; `js/affichage.js` (`afficherMoments`) ; `index.html` (`#choix-moment`).

## Ce que je te demande
Donne-moi des hypothèses sur la cause, classées de la plus à la moins probable.
Ne propose pas de correctif pour l'instant.
Pour chaque hypothèse, dis-moi comment la vérifier dans le navigateur (console, point d'arrêt, stockage).

### Hypothèses trouvées
1. **Le moment est lu sur le mauvais bouton** : retenue. `commander` (`js/app.js`) cherchait `input[name=moment]` sans demander lequel est coché : le navigateur renvoie le premier, « Matin ». Vérifiée dans la console avec « Après-midi » coché : `document.querySelector("input[name=moment]").value` donne `'matin'` et `document.querySelector("input[name=moment]:checked").value` donne `'apres-midi'`.
2. **Les boutons radio ne sont pas bien reliés entre eux** : écartée, « Après-midi » se coche et « Matin » se décoche à l'écran.
3. **Le moment choisi est perdu avant la commande** : écartée, l'hypothèse 1 explique tous les relevés.
