# Message pour Madame Roussel : ticket 9 (une livraison le dimanche)

Bonjour Madame Roussel,

Merci de m'avoir signalé ce problème, et je suis désolé pour ce client que vous avez dû rappeler. J'ai trouvé l'origine : le site calculait bien les jours de livraison, en laissant de côté le dimanche, mais au moment d'écrire ces jours dans la liste, il les décalait d'un jour en arrière. Le lundi s'affichait donc « dimanche », le dimanche réel était sauté comme prévu, et le dernier jour de la liste, un samedi, apparaissait comme « vendredi ». C'est pour cela que votre client voyait un dimanche et aucun samedi.

C'est corrigé : la liste affiche maintenant les vrais jours. Par exemple, pour une commande passée un samedi, elle propose du lundi au samedi suivant, sans aucun dimanche. J'ai vérifié plusieurs jours et heures de commande (samedi matin et soir, vendredi matin et soir), ainsi que le reste de la boutique.

Bien cordialement,
