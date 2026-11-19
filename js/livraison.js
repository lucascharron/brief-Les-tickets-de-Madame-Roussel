// Livraison : zones, frais et jours de livraison possibles.

let regles = null;

// Garde les règles de livraison en mémoire.
export function chargerReglesLivraison(donnees) {
  regles = donnees;
}

// Renvoie la zone d'un code postal, ou undefined si la boutique n'y livre pas.
export function zonePour(codePostal) {
  return regles.zones.find((zone) => zone.codesPostaux.includes(codePostal.trim()));
}

// Frais de livraison ; la livraison est offerte dès 60 € d'achat.
// Renvoie null si la boutique ne livre pas ce code postal.
export function fraisLivraison(codePostal, montant) {
  const zone = zonePour(codePostal);
  if (!zone) return null;
  if (montant >= regles.seuilGratuite) return 0;
  return zone.frais;
}

// Les six prochains jours de livraison, au format "2026-11-16".
// Commande passée avant l'heure limite : livraison possible dès le lendemain.
export function joursDeLivraison(depuis) {
  const jours = [];
  const premier = depuis.getHours() < regles.heureLimite ? 1 : 2;
  for (let ecart = premier; jours.length < 6; ecart++) {
    const jour = new Date(depuis.getFullYear(), depuis.getMonth(), depuis.getDate() + ecart);
    if (regles.joursFermes.includes(jour.getDay())) continue;
    const mois = String(jour.getMonth() + 1).padStart(2, "0");
    const numero = String(jour.getDate()).padStart(2, "0");
    jours.push(jour.getFullYear() + "-" + mois + "-" + numero);
  }
  return jours;
}

// Les moments de livraison (matin, après-midi).
export function momentsDeLivraison() {
  return regles.moments;
}
