# Message pour Madame Roussel : ticket 10 (« NaN € » dans le panier)

Bonjour Madame Roussel,

Merci de m'avoir signalé ce problème, et merci à votre cliente pour sa capture d'écran. J'ai trouvé l'origine : quand une cliente ajoute des bouquets, le site garde son panier dans son navigateur, pour le retrouver à sa prochaine visite. Votre cliente fidèle avait encore dans son navigateur un panier enregistré avec l'ancienne version du site, avant septembre. Le site le rechargeait tel quel, alors que ce panier n'a pas la même forme que ceux de la nouvelle version : il lui manquait des informations, le calcul des prix n'y arrivait pas et affichait « NaN € » (« pas un nombre »). Les autres clientes n'ont pas ce vieux panier, c'est pourquoi chez vous et chez elles tout fonctionnait.

C'est corrigé : le site ne reprend plus un panier enregistré par l'ancienne version, comme le prévoit le cahier des charges. Votre cliente retrouvera un panier vide, qu'elle pourra remplir normalement. Les paniers de la nouvelle version, eux, sont toujours conservés d'une visite à l'autre.

Une réserve : je n'ai pas pu retrouver exactement la forme de l'ancien panier de votre cliente, je l'ai donc reproduite avec un panier d'ancienne version fabriqué pour le test. De plus, vous m'indiquez qu'elle ne pouvait plus commander : je n'ai constaté que l'affichage « NaN € », pas ce blocage. Si le problème persistait chez elle après la mise à jour, dites-le-moi et je regarderai de plus près.

Bien cordialement,
