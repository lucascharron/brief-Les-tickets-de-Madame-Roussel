# Message pour Madame Roussel : ticket 6 (la livraison facturée à 60 €)

Bonjour Madame Roussel,

Merci de m'avoir signalé ce problème, et je suis désolé pour votre cliente. J'ai trouvé l'origine : le site calculait le total en additionnant des prix avec des centimes, et l'ordinateur obtenait un résultat très légèrement inférieur à 60 €, de l'ordre d'un millionième de centime en dessous. L'écran arrondissait et affichait « 60,00 € », mais pour décider si la livraison était offerte, le site comparait le montant exact à 60 €, le trouvait un tout petit peu en dessous, et facturait la livraison. Cela ne se produisait que lorsque le total tombait pile sur 60 €.

C'est corrigé : les montants sont maintenant arrondis au centime dès le calcul. Avec le panier de votre cliente (Blanc pur en taille moyenne avec le vase, livré à Tours), la livraison est bien offerte. J'ai vérifié aussi un panier au-dessus de 60 € (livraison offerte) et un panier en dessous (livraison à 5,90 €), ainsi que le reste de la boutique.

Bien cordialement,
