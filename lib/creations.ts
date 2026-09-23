export type Creation = {
  id: number;
  name: string;
  category: "Tableaux" | "Objets détournés" | "Horloges";
  price: number;
  image: string;
  imageKey?: string | null;
  note: string;
  status: "Disponible" | "Sur commande" | "Vendu";
  position: number;
};

export const defaultCreations: Creation[] = [
  { id: 1, name: "Équilibre sauvage", category: "Tableaux", price: 85, image: "/gallery/equilibre-sauvage.webp", note: "Cadre relief, personnages articulés et motif graphique.", status: "Sur commande", position: 1 },
  { id: 2, name: "Fragments d’atelier", category: "Tableaux", price: 160, image: "/gallery/abstractions.webp", note: "Peinture abstraite encadrée, composition originale.", status: "Sur commande", position: 2 },
  { id: 3, name: "Les clefs du temps", category: "Tableaux", price: 110, image: "/gallery/clefs-du-temps.webp", note: "Assemblage en relief de clefs anciennes sur fond peint.", status: "Sur commande", position: 3 },
  { id: 4, name: "Cabinet de curiosités", category: "Objets détournés", price: 80, image: "/gallery/cabinet-curiosites.webp", note: "Boîte métallique détournée en vitrine murale colorée.", status: "Sur commande", position: 4 },
  { id: 5, name: "Constellation verte", category: "Tableaux", price: 70, image: "/gallery/constellation-verte.webp", note: "Relief graphique sur toile texturée, coloris personnalisable.", status: "Sur commande", position: 5 },
  { id: 6, name: "Havana Time", category: "Horloges", price: 120, image: "/gallery/havana-time.webp", note: "Horloge murale assemblée à partir d’objets inattendus.", status: "Sur commande", position: 6 },
  { id: 7, name: "Banana Smash", category: "Objets détournés", price: 95, image: "/gallery/banana-smash.webp", note: "Raquette détournée et banane miroir, pièce pop en relief.", status: "Sur commande", position: 7 },
  { id: 8, name: "Face à face", category: "Objets détournés", price: 90, image: "/gallery/face-a-face.webp", note: "Planche en bois et figurines revisitées, couleurs au choix.", status: "Sur commande", position: 8 },
  { id: 9, name: "Pomme Pop", category: "Tableaux", price: 85, image: "/gallery/pomme-pop.webp", note: "Composition minimaliste en relief, cadre bicolore.", status: "Sur commande", position: 9 },
  { id: 10, name: "Minuit glacé", category: "Horloges", price: 95, image: "/gallery/minuit-glace.webp", note: "Plateau décoratif transformé en horloge murale.", status: "Disponible", position: 10 },
  { id: 12, name: "Les Trois Font la Paire", category: "Objets détournés", price: 190, image: "/gallery/les-trois-font-la-paire.webp", note: "Trois nains aux couleurs pastel réunis sur un socle transparent parsemé de boutons. Une pièce décalée qui détourne les codes du jardin pour en faire un objet de décoration intérieure.", status: "Disponible", position: 11 },
  { id: 11, name: "Joyeux Bazar", category: "Objets détournés", price: 240, image: "/gallery/joyeux-bazar.webp", note: "À contre-courant, ça déborde : un assemblage sculptural de céramiques détournées, de couleur laquée et de billes en verre.", status: "Disponible", position: 12 },
];
