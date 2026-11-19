# Message pour Madame Roussel : ticket 4 (deux tailles, deux grands bouquets)

Bonjour Madame Roussel,

Merci de m'avoir signalé ce problème, et merci à votre cliente pour la précision de son récit. J'ai trouvé l'origine : quand on ajoute un bouquet au panier, le site gardait un lien avec le formulaire de composition au lieu d'en garder une copie. Si la cliente changeait ensuite la taille dans le formulaire, elle changeait aussi la taille du bouquet déjà dans le panier. Le site croyait alors que les deux bouquets étaient identiques, et il en comptait deux grands.

C'est corrigé : le panier garde maintenant sa propre copie. Votre cliente peut mettre une petite Pivoine poudrée et une grande dans le même panier, chacune à son prix (34,90 € et 50,50 €). J'ai vérifié que deux bouquets identiques sont bien regroupés sur une ligne, que des bouquets différents (taille, vase) restent sur des lignes séparées, et que le reste du site fonctionne toujours.

Bien cordialement,
