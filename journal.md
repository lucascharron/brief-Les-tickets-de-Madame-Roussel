# Journal de travail

Compte rendu de la session du 2026-11-19 sur la boutique Fleurs Roussel, mis à jour à chaque action.

## Sommaire

1. [Récapitulatif des dix tickets](#1-récapitulatif-des-dix-tickets)
2. [Préparation](#2-préparation)
3. [Les dix tickets en détail](#3-les-dix-tickets-en-détail)
4. [Clôture](#4-clôture)
5. [Reste à faire](#5-reste-à-faire)

---

## 1. Récapitulatif des dix tickets

| N° | Ticket | Cause | Fichier corrigé | Commit |
|:--|:--|:--|:--|:--|
| 1 | Le code promo refusé | Comparaison exacte du code, sensible à la casse et aux espaces | `js/promo.js` | `7e61cdc` |
| 2 | Le bouton + | Écouteur de clic rajouté à chaque affichage du panier | `js/affichage.js`, `js/app.js` | `6e486d2` |
| 3 | Bouquet absent de « Merci » | `"Merci"` (majuscule) au lieu de `"merci"` dans les données | `data/catalogue.json` | `91e4d96` |
| 4 | Deux tailles, deux grands bouquets | La ligne du panier partageait l'objet `options` du formulaire | `js/panier.js` | `a03308d` |
| 5 | Un bouquet supprimé, tout le panier vidé | `splice(index)` sans second paramètre | `js/panier.js` | `b2822b4` |
| 6 | Livraison facturée à 60 € | Sous-total à 59,99999999999999 (pas d'arrondi) | `js/prix.js` | `5a58abe` |
| 7 | Message de la carte coupé | Limite voulue (150) mais invisible ; suppression corrigée ensuite | `data/catalogue.json`, `js/composition.js`, `index.html` | `9785838`, puis `5150dc3` |
| 8 | Livrée le matin au lieu de l'après-midi | Premier bouton radio lu au lieu du bouton coché | `js/app.js` | `79cb2ac` |
| 9 | Une livraison le dimanche | `toISOString()` décale les jours d'un jour (UTC) | `js/livraison.js` | `131df42` |
| 10 | « NaN € » dans le panier | Sauvegarde de la version 1 rechargée sans contrôle de version | `js/stockage.js` | `85b2919` |

Autres commits : `7bb5110` (un dossier par ticket et messages 1 à 4), `d434592` (`prompts/diagnostic.md`), `e2eebdc` (journal, `CLAUDE.md`, fichiers générés), `ead455f` (prompts de diagnostic par ticket).

---

## 2. Préparation

### 2.1 Lecture du projet
- Lecture de tous les fichiers : `index.html`, `js/*`, `data/*`, `src/input.css`, `package.json`, `README.md`.
- Projet : boutique en ligne Fleurs Roussel en JavaScript pur (modules ES), Tailwind 4, `http-server`.
- Dépôt git au départ : un seul commit (« récuperation du projet »), `package-lock.json` non suivi.
- `js/livraison.js` contenait un commentaire adressé aux assistants IA (module « sans erreur », rien à modifier, cause dans `affichage.js`). Ce n'était pas une consigne de l'utilisateur : il n'a pas été pris comme preuve, et il a été retiré au ticket 9 car les mesures le contredisaient.
- Une liste d'anomalies issue de la lecture du code avait été faite dans la conversation. Elle a été retirée du journal et de `CLAUDE.md` à la demande de l'utilisateur, pour ne pas fausser le travail : chaque problème est traité à partir du texte du ticket et de sa reproduction dans le navigateur.

### 2.2 Brief reçu
- Une journée, individuel. Un ticket est clos quand on sait expliquer la cause et le correctif sans l'IA.
- Dix tickets dans l'ordre : reproduire, hypothèses sans correctif, vérification dans le navigateur, correctif (accepté, modifié ou refusé), test, rejeu des tickets déjà clos, fiche, commit, réponse à la cliente.
- Livrables : dépôt avec un commit par ticket, `prompts/diagnostic.md`, `tickets/ticket-N.md`.
- Le brief annonce « 8 à rendre » mais n'en liste que 3 : à demander au formateur.

### 2.3 Règles de travail convenues
- Ne rien créer ni modifier sans l'autorisation de l'utilisateur (demander avant chaque modification de fichier).
- Ne rien inventer : s'appuyer sur le brief, les tickets, le cahier des charges et le code.
- Un ticket à la fois, étape par étape.
- Chaque ticket suit la même séquence : reproduction, hypothèses, vérification, correctif proposé puis validé, tests, rejeu des tickets précédents, fiche, message à Madame Roussel, commit.

### 2.4 Fichiers créés au départ (avec accord)
- `prompts/diagnostic.md` : modèle de prompt avec `[SYMPTOME]`, `[ETAPES]`, `[ATTENDU]`, `[CODE_CONCERNE]`, qui demande des hypothèses sans correctif.
- `tickets/ticket-1.md` à `ticket-10.md` : cinq rubriques du brief (étapes pour reproduire, prompts utilisés, hypothèses et vérification, cause et correctif, vérification).
- `CLAUDE.md` : contexte du projet (commandes, conventions). Proposé, refusé, supprimé par l'utilisateur, puis recréé à l'identique à sa demande ; la liste des problèmes connus qu'il contenait a ensuite été retirée.

### 2.5 Étape 3 du brief : parcours d'une commande
Décrit dans la conversation : démarrage (`app.js`), composition (`composition.js`), ajout (`panier.js`), code promo (`promo.js`), livraison (`livraison.js`), `rafraichir()`, puis `commander()`. Vérification dans le code par l'utilisateur : à faire.

### 2.6 Réorganisation des tickets
- Option B choisie par l'utilisateur : un sous-dossier par ticket, `tickets/ticket-N/ticket-N.md` (fiche) et `tickets/ticket-N/message-roussel.md` (message à Madame Roussel).
- Fiches 1 à 4 déplacées avec `git mv`, fiches 5 à 10 déplacées dans leur sous-dossier. Messages des tickets 1 à 4 créés avec le texte validé.
- Le chemin des fiches ne correspond plus à `tickets/ticket-N.md` du brief : à signaler à l'évaluateur ou au formateur.
- Commit `7bb5110`.

---

## 3. Les dix tickets en détail

### Ticket 1 : le code promo refusé

#### Énoncé
Une cliente saisit NOEL10 depuis son téléphone et le site répond « ce code n'existe pas ». Sur l'ordinateur de la propriétaire, le code marche.

#### Reproduction
- `NOEL10` exact (panier à 47,80 €) : « Code NOEL10 appliqué. », remise − 4,78 €, total 43,02 €.
- `noel10`, espace avant, espace après, `Noel10` : tous refusés (« Ce code promo n'existe pas. »).
- Seule la saisie exacte `NOEL10` est acceptée.

#### Hypothèses
1. Comparaison exacte `===` dans `appliquerPromo` (`js/promo.js`) : retenue.
2. Le téléphone met une majuscule ou ajoute un espace : plausible, non vue sur un vrai téléphone. Vérifiée indirectement : le champ `#code-promo` n'a que `id`, `type="text"` et `class` (pas d'`autocapitalize`, `autocorrect`, `spellcheck`).
3. `js/promotions.js` non importé : pas la cause directe.
4. Données mal chargées : écartée.

#### Vérifications
- Point d'arrêt à `promo.js` : première pause avec `saisie = "NOEL10"` et `montant = 0` (panier vide), donc pas le bon test ; valeurs vides ensuite, vérification abandonnée.
- La capture de l'utilisateur montre `promo.code === saisie` à `promo.js`. Hypothèse 1 retenue.

#### Correctif
`appliquerPromo` compare `saisie.trim().toUpperCase()` au code. Propositions écartées : brancher `promotions.js` (signature différente, casserait `app.js`) ; `autocapitalize="none"` (traite seulement le symptôme).

#### Tests
Cinq saisies acceptées avec la même remise, `FAUX` refusé, remise conservée après rechargement.

#### Livrables
Fiche, message validés. Commit `7e61cdc`. Ticket clos.

---

### Ticket 2 : le bouton +

#### Énoncé
Un clic sur « + » ajoute plusieurs bouquets, « de pire en pire à chaque clic » ; une cliente s'est retrouvée avec une quinzaine de bouquets.

#### Reproduction
Un clic sur « + » : 1 → 6, 6 → 16, 16 → 36, 36 → 76, 76 → 156 (ajouts de 5, 10, 20, 40, 80 : doublement). Un clic sur « − » à 156 vide le panier.

#### Hypothèses
1. L'écouteur de clic de `#panier-liste` est ajouté à chaque appel de `afficherPanier` (`js/affichage.js`) : retenue.
2. `changerQuantite` ajoute trop : écartée. 3. Boutons superposés : écartée.

#### Vérification
`getEventListeners(document.querySelector('#panier-liste')).click.length` : 2 écouteurs et quantité 1, puis un clic = +2 et 4 écouteurs, puis 8. Prévision faite avant la mesure, vérifiée. L'erreur `favicon.ico 404` est sans rapport.

#### Correctif
Nouvelle fonction `preparerPanier(surAction)` dans `js/affichage.js` qui attache l'écouteur une seule fois ; `afficherPanier(lignes)` sans écouteur ; `js/app.js` l'appelle dans `demarrer()`. Propositions écartées : `liste.onclick`, retirer l'ancien écouteur, limiter la quantité.

#### Tests
« + » ajoute 1, « − » retire 1, l'écouteur reste à 1, rejeu du ticket 1.

#### Observation hors ticket
Avec plusieurs lignes, « Supprimer » sur la première supprimait aussi les suivantes. Non corrigé, repris au ticket 5.

#### Livrables
Fiche, message validés. Commit `6e486d2`. Ticket clos.

---

### Ticket 3 : un bouquet absent de l'occasion « Merci »

#### Énoncé
Avec l'occasion « Merci », « Le petit mot » n'apparaît pas, alors qu'il est là avec « Toutes ».

#### Reproduction
- Toutes : six bouquets dont « Le petit mot ». Merci : Champêtre, Soleil d'automne, Blanc pur.
- Anniversaire : Pivoine poudrée, Roses rouges. Amour : Roses rouges. Mariage : Blanc pur.
- Pour le plaisir : Pivoine poudrée, Champêtre, Soleil d'automne, Le petit mot.

#### Hypothèses
1. Les `occasions` de « Le petit mot » ne contiennent pas exactement `merci` : retenue.
2. Filtre défectueux, 3. identifiant du radio mal créé, 4. bouquet sans occasion : écartées.

#### Vérification
Console : l'identifiant est `merci` (minuscules) ; « Le petit mot » a `Merci | plaisir` (seul avec une majuscule). `['Merci','plaisir'].includes('merci')` → `false` ; avec `['merci','plaisir']` → `true`. La question de l'apostrophe manquante : non, c'est l'affichage de la console.

#### Correctif
`data/catalogue.json` : `"Merci"` remplacé par `"merci"`. Alternative écartée : filtre insensible à la casse (masquerait l'erreur de données).

#### Tests
« Merci » affiche 4 bouquets, autres occasions inchangées, « Toutes » 6, rejeu des tickets 1 et 2.

#### Livrables
Fiche, message validés. Commit `91e4d96`. Ticket clos.

---

### Ticket 4 : deux tailles, deux grands bouquets

#### Énoncé
Une cliente ajoute une Pivoine poudrée « Petit », puis choisit « Grand » et ajoute encore : le panier contient deux grandes.

#### Reproduction
Petit ajouté à 34,90 € ; formulaire en « Grand » : 50,50 € ; second ajout : 2 « Grand » à 101,00 €. Les prix sont corrects (34,90 + 15,60 = 50,50).

#### Hypothèses
1. La ligne du panier partage le même objet `options` que le formulaire : retenue.
2. La fusion des lignes en découle (un objet comparé à lui-même) : non testée séparément.
3. Calcul du prix faux : écartée.

#### Vérification
- Premier relevé non concluant : `'petit'` avant et après (on ignorait si « Grand » était coché et si la page avait été rechargée).
- Second relevé, sans rechargement : `l[0].options.taille` = `'petit'` après l'ajout, `'grand'` après avoir coché « Grand » sans ajouter. Hypothèse 1 confirmée.

#### Correctif
`js/panier.js`, `ajouterAuPanier` copie les options : `options: { ...options }`. Alternatives écartées : copier seulement dans `composition.js` ; recréer `options` à l'ouverture du formulaire.

#### Tests
Petit puis Grand sur deux lignes, pas de modification après ajout, fusion des lignes identiques, options distinctes, rejeu des tickets 1 à 3.

#### Livrables
Fiche, message validés. Commit `a03308d`. Ticket clos.

---

### Ticket 5 : un bouquet supprimé, tout le panier vidé

#### Énoncé
Une cliente avait trois bouquets ; « Supprimer » sur le premier a tout supprimé, et elle est partie sans commander.

#### Reproduction
Trois lignes (Pivoine poudrée, Champêtre, Roses rouges) : supprimer la 1ère supprime tout, la 2ème supprime la 2ème et la 3ème, la 3ème se supprime seule. La ligne cliquée disparaît avec toutes les suivantes.

#### Hypothèses
1. `splice(index)` sans second paramètre dans `supprimerLigne` (`js/panier.js`) : retenue.
2. Mauvais `data-index` : écartée, non relevé. 3. Action déclenchée plusieurs fois : écartée (ticket 2).

#### Vérification
Console : `[10,20,30].splice(1)` retire `[20, 30]` ; `[10,20,30].splice(1, 1)` retire `[20]`. La ligne `lignes.splice(index);` a été lue par l'assistant, non relevée par l'utilisateur.

#### Correctif
`lignes.splice(index, 1);`. Même défaut pour « − » sur une ligne de quantité 1 (corrigé aussi). Alternative écartée : `lignes = lignes.filter(...)`.

#### Tests
Suppression de la 1ère, 2ème, dernière ligne, « − » à quantité 1, sous-total, rejeu des tickets 1 à 4.

#### Livrables
Fiche, message validés. Commit `b2822b4`. Ticket clos.

---

### Ticket 6 : la livraison facturée à 60 €

#### Énoncé
Une cliente de Tours a commandé un Blanc pur Moyen avec le vase : sous-total 60,00 € mais 5,90 € de livraison comptés ; la propriétaire l'a remboursée.

#### Reproduction
Code postal 37000 :
- Moyen + vase : 60,00 €, livraison 5,90 € (devrait être offerte), total 65,90 €.
- Grand + vase : 67,40 €, livraison offerte.
- Grand + carte : 57,00 €, livraison 5,90 €, total 62,90 €.

Le défaut n'apparaît que pile à 60,00 €. Erreur de l'assistant corrigée : Blanc pur « Grand » sans option vaut 54,50 € (moins de 60 €), et non plus de 60 €.

#### Hypothèses
1. Le sous-total n'est pas exactement 60 : 38,90 + 8,20 + 12,90 donne 59,99999999999999 : retenue.
2. Comparaison `>` au lieu de `>=` : écartée (`>=` lu par l'assistant, non relevé par l'utilisateur).
3. Zone ou frais mal choisis : écartée.

#### Vérification
Console `[s, s === 60, s >= 60]` : avant `59.99999…, false, false` ; après `60, true, true`. Le commentaire en tête de `js/livraison.js` n'a pas été pris comme preuve.

#### Correctif
`js/prix.js` importe `arrondir` (déjà dans `js/outils.js`, inutilisé) et l'applique dans `prixUnitaire`, `prixLigne`, `sousTotal`. Alternative écartée : marge de tolérance dans `fraisLivraison`.

#### Tests
Moyen + vase offerte à 60,00 €, Grand + vase offerte, Grand + carte 5,90 €, prix inchangés, rejeu des tickets 1 à 5.

#### Livrables
Fiche, message validés. Commit `5a58abe`. Ticket clos.

---

### Ticket 7 : le message de la carte coupé

#### Énoncé
Une cliente voulait écrire un long message de mariage, le site l'a bloquée. La propriétaire demande d'enlever la limite (« mes clientes doivent pouvoir écrire ce qu'elles veulent »).

#### Reproduction
Le texte s'arrête à exactement 150 caractères, sans avertissement ni compteur. Le panier affiche « Petit, carte ».

#### Hypothèses
1. La limite est une valeur de configuration (`options.carte.longueurMax` dans `data/catalogue.json`) appliquée par `js/composition.js` : retenue (`maxlength="150"` relevé, `longueurMax` = 150).
2. Appliquée deux fois (`maxlength` et `slice`) : retenue d'après le code, non mesurée.
3. Panier ou stockage qui coupe : écartée.
4. La limite est voulue : confirmée plus tard par le cahier des charges.

#### Première décision (corrigée)
- Options présentées : A supprimer, B relever, C garder avec un compteur. L'assistant recommandait de demander d'abord pourquoi 150.
- L'utilisateur a choisi A, pour respecter la demande. La limite a été supprimée (commit `9785838`), avant la lecture du cahier des charges.

#### Découverte du cahier des charges
« Le message de la carte compte 150 caractères au plus. La carte imprimée mesure 8 × 5 cm : au-delà, le texte ne tient pas. Ce choix a été fait par Madame Roussel avec son imprimeur. » La suppression contredisait donc une règle validée.

#### Décision finale
Rétablir la limite de 150 et la rendre visible (option C). La lever reste possible mais seulement avec l'accord de Madame Roussel, ce que le message lui explique.

#### Correctif final
- `data/catalogue.json` : `longueurMax: 150` rétabli.
- `js/composition.js` : ligne `maxLength` et `slice` rétablis, nouvelle fonction `afficherCompteur` appelée dans `remplirFormulaire` et `lireFormulaire`.
- `index.html` : paragraphe « x / 150 caractères. La carte imprimée mesure 8 × 5 cm : au-delà de la limite, le texte ne tient pas. », avec des classes Tailwind déjà présentes dans `dist/output.css`.

#### Tests
Compteur, limite à 150, `maxLength` à 150, message conservé, nouveau bouquet à « 0 / 150 », rejeu des tickets 1 à 10 : tout marche.

#### Livrables
Fiche, diagnostic et message réécrits et validés. Commit `5150dc3` « la limite de 150 caractères est rétablie et rendue visible ». L'historique déjà poussé n'est pas réécrit (le commit `9785838` reste). Ticket clos.

---

### Ticket 8 : livrée le matin au lieu de l'après-midi

#### Énoncé
Une cliente avait choisi l'après-midi ; le message de confirmation disait « matin », le livreur est passé le matin, personne.

#### Reproduction
Dans tous les essais (Après-midi, Matin, changements de moment) : « Merci ! Votre commande est enregistrée pour le lundi 23 novembre (matin). ».

#### Hypothèses
1. `commander` (`js/app.js`) cherche `input[name=moment]` sans `:checked` : retenue.
2. Radios mal reliés : écartée. 3. Moment perdu avant la commande : écartée.

#### Vérification
Console, « Après-midi » coché : sans `:checked` → `'matin'` ; avec `:checked` → `'apres-midi'`.

#### Correctif
`input[name=moment]:checked`. Alternative écartée : mémoriser le moment dans l'état. La réserve sur l'envoi de la commande n'a pas été reprise dans la fiche, à la demande de l'utilisateur.

#### Tests
Après-midi, Matin, changements de moment, messages d'erreur inchangés, rejeu des tickets 1 à 7.

#### Livrables
Fiche, message validés. Commit `79cb2ac`. Ticket clos.

---

### Ticket 9 : une livraison le dimanche

#### Énoncé
La boutique ne livre jamais le dimanche. Un client commandant un samedi soir s'est vu proposer le « dimanche 15 novembre » et ne voyait aucun samedi.

#### Reproduction
Avec `?maintenant=2026-11-14T19:30` et `?maintenant=2026-11-14T10:00` : dimanche 15 à vendredi 20 novembre, sans samedi. La liste attendue (six jours, dimanches exclus) est lundi 16 à samedi 21 : la liste affichée est décalée d'un jour en arrière.

#### Hypothèses
1. `joursDeLivraison` convertit avec `toISOString()` (UTC) : en France en novembre, le lundi 16 devient `"2026-11-15"` : retenue.
2. `afficherJours` lit aussi la date en UTC : non confirmée, raisonnement seulement.
3. `joursFermes` mal réglé : écartée.

#### Vérification
Console : `joursDeLivraison(new Date('2026-11-14T10:00'))` → premier jour `'2026-11-15'` ; `new Date(2026, 10, 16).toISOString()` → `'2026-11-15T23:00:00.000Z'` ; `new Date(2026, 10, 16).getDay()` → `1`.

#### Correctif
`js/livraison.js` construit le texte du jour avec `getFullYear()`, `getMonth() + 1` et `getDate()` locaux. Le commentaire erroné en tête du fichier est supprimé (accord de l'utilisateur). Alternatives écartées : ajouter un jour dans `affichage.js`, changer `joursFermes`.

#### Tests
Samedi soir et matin, vendredi matin et soir, date réelle, console, commande avec un jour choisi, rejeu des tickets 1 à 8. Les relevés vendredi soir, vendredi matin et date réelle n'ont pas été faits avant le correctif.

#### Livrables
Fiche, message validés. Commit `131df42`. Ticket clos.

---

### Ticket 10 : « NaN € » dans le panier

#### Énoncé
Une cliente fidèle, qui commandait avant la nouvelle version, voit « NaN € » et ne peut plus commander. Chez la propriétaire et les autres clientes, tout fonctionne.

#### Information du cahier des charges
« La version 2, mise en ligne en septembre 2026, a ajouté la composition des bouquets (tailles et options) et un nouveau panier. Les paniers enregistrés par la version 1 ne sont pas repris. »

#### Reproduction
- Valeur actuelle de la clé `panier-roussel` : `{"version":2,"lignes":[],"codePromo":""}`.
- Première simulation d'une ancienne sauvegarde `[{ nom, prix, quantite }]` : rien ne change visiblement (le terminal prévoyait un prix de 0, non « NaN »).
- Deuxième simulation, avec `version: 1` : l'utilisateur ne voit d'abord rien, puis le « NaN € » après des étapes plus précises (`location.reload()`, contrôle de la valeur avant et après). L'assistant n'a pas d'outil pour piloter un navigateur.

#### Hypothèses
1. `chargerPanier` (`js/stockage.js`) ne contrôle pas la version et accepte même une simple liste : retenue.
2. « NaN » dû à un champ manquant dans une ancienne ligne (`prixLigne` multiplie par `quantite`) : retenue comme mécanisme, non confirmée pour la cliente.
3. Problème de calcul de la version 2 : écartée.

#### Vérifications
- Terminal (script `simul.mjs` dans le dossier temporaire, fausse mémoire de navigateur, code du projet non modifié) : sauvegarde A (`nom`, `prix`, `quantite`) → 0, 0 ; sauvegarde B (`version: 1`, `bouquetId` sans quantité) → NaN, NaN ; sauvegarde C (liste sans version) → NaN, NaN.
- Navigateur : « NaN € » confirmé avec la sauvegarde `version: 1`.

#### Limites
Format réel de la version 1 inconnu (sauvegarde de test construite) ; « elle ne peut plus commander » non reproduit ni expliqué.

#### Correctif
`js/stockage.js`, `chargerPanier` : si `donnees.version !== VERSION`, renvoie un panier vide ; sinon lit `lignes` et `codePromo`. Alternatives écartées : calcul tolérant dans `prix.js`, nettoyage ligne par ligne.

#### Tests
Sauvegarde `version: 1` → panier vide, liste sans version → panier vide, panier de la version 2 conservé, clé supprimée, rejeu des tickets 1 à 9.

#### Livrables
Fiche, message validés (une première écriture avait échoué en silence ; fichiers réécrits et vérifiés). Commit `85b2919`. Ticket clos. Les dix tickets sont traités.

---

## 4. Clôture

### 4.1 Commits de clôture
- `d434592` : `prompts/diagnostic.md`.
- `e2eebdc` : `CLAUDE.md`, `journal.md`, `package-lock.json`, `dist/output.css` (modifié par une recompilation Tailwind, pas par l'assistant).
- `ead455f` : dix `tickets/ticket-N/diagnostic.md` avec les hypothèses trouvées.

### 4.2 Prompts de diagnostic par ticket
Créés à la demande de l'utilisateur : le modèle de `prompts/diagnostic.md` rempli (symptôme, étapes, résultat attendu, code concerné), avec la demande d'hypothèses, puis une rubrique « Hypothèses trouvées » (retenues ou écartées et leur vérification) reprise des fiches.

### 4.3 Vérification de conformité au cahier des charges
PDF fourni par l'utilisateur, lu avec `pdftotext`.

**Conforme** :
- Catalogue : six bouquets, filtres, trois tailles et leurs suppléments, vase, carte, données dans `data/`.
- Panier : lignes identiques fusionnées, boutons +, −, Supprimer, conservation dans le navigateur, paniers de la version 1 non repris.
- Codes promo : casse et espaces ignorés, remise sur le sous-total avant livraison, NOEL10 10 %, BIENVENUE5 5 € dès 30 €.
- Livraison : zones et frais, offerte dès 60 € (sous-total avant remise), pas de livraison hors zone, fermé le dimanche, avant 14 h le lendemain sinon le surlendemain, six jours, matin ou après-midi.

**Non conforme** :
1. Ticket 7 : la limite de 150 avait été supprimée. Corrigé ensuite (voir ticket 7, commit `5150dc3`).
2. « Le site enregistre la commande et la transmet à la boutique » : le bouton « Commander » affiche seulement un message et vide le panier, rien n'enregistre ni ne transmet la commande dans le code du projet. Hors périmètre des dix tickets, non corrigé.

### 4.4 Dépôt distant
Premier push vers `origin/main` (14 commits, de `bcee762` à `ead455f`) fait à la demande de l'utilisateur. Dépôt : `https://github.com/lucascharron/brief-Les-tickets-de-Madame-Roussel`. Le commit `5150dc3` n'est pas encore poussé.

---

## 5. Reste à faire

- Commiter ce journal réorganisé, puis pousser `5150dc3` et le journal vers `origin/main` (en attente de l'accord de l'utilisateur).
- Relire les fiches et les reformuler avec les mots de l'utilisateur : le brief demande de savoir expliquer chaque cause sans l'IA.
- Demander au formateur ce que sont les cinq livrables « à rendre » qui manquent dans le brief, et lui signaler le nouveau chemin des fiches (`tickets/ticket-N/ticket-N.md`).
- Étape 3 du brief (parcours d'une commande) : vérification dans le code par l'utilisateur, à faire.
- Décider de la suite avec Madame Roussel pour le ticket 7 (lever la limite seulement avec son accord) et pour l'enregistrement de la commande (écart avec le cahier des charges).
