const creations = [
  { name: "Équilibre sauvage", category: "Tableaux", price: 85, image: "gallery/equilibre-sauvage.webp", note: "Cadre relief, personnages articulés et motif graphique.", status: "Sur commande" },
  { name: "Fragments d’atelier", category: "Tableaux", price: 160, image: "gallery/abstractions.webp", note: "Peinture abstraite encadrée, composition originale.", status: "Sur commande" },
  { name: "Les clefs du temps", category: "Tableaux", price: 110, image: "gallery/clefs-du-temps.webp", note: "Assemblage en relief de clefs anciennes sur fond peint.", status: "Sur commande" },
  { name: "Cabinet de curiosités", category: "Objets détournés", price: 80, image: "gallery/cabinet-curiosites.webp", note: "Boîte métallique détournée en vitrine murale colorée.", status: "Sur commande" },
  { name: "Constellation verte", category: "Tableaux", price: 70, image: "gallery/constellation-verte.webp", note: "Relief graphique sur toile texturée, coloris personnalisable.", status: "Sur commande" },
  { name: "Havana Time", category: "Horloges", price: 120, image: "gallery/havana-time.webp", note: "Horloge murale assemblée à partir d’objets inattendus.", status: "Sur commande" },
  { name: "Banana Smash", category: "Objets détournés", price: 95, image: "gallery/banana-smash.webp", note: "Raquette détournée et banane miroir, pièce pop en relief.", status: "Sur commande" },
  { name: "Face à face", category: "Objets détournés", price: 90, image: "gallery/face-a-face.webp", note: "Planche en bois et figurines revisitées, couleurs au choix.", status: "Sur commande" },
  { name: "Pomme Pop", category: "Tableaux", price: 85, image: "gallery/pomme-pop.webp", note: "Composition minimaliste en relief, cadre bicolore.", status: "Sur commande" },
  { name: "Minuit glacé", category: "Horloges", price: 95, image: "gallery/minuit-glace.webp", note: "Plateau décoratif transformé en horloge murale.", status: "Disponible" },
  { name: "Les Trois Font la Paire", category: "Objets détournés", price: 190, image: "gallery/les-trois-font-la-paire.webp", images: ["gallery/les-trois-font-la-paire.webp", "gallery/les-trois-font-la-paire-detail.webp"], note: "Trois nains aux couleurs pastel réunis sur un socle transparent parsemé de boutons. Une pièce décalée qui détourne les codes du jardin pour en faire un objet de décoration intérieure.", status: "Disponible" },
  { name: "Joyeux Bazar", category: "Objets détournés", price: 240, image: "gallery/joyeux-bazar.webp", note: "À contre-courant, ça déborde : un assemblage sculptural de céramiques détournées, de couleur laquée et de billes en verre.", status: "Disponible" }
];

const grid = document.querySelector("#gallery-grid");
const dialog = document.querySelector("#custom-dialog");
const form = document.querySelector("#custom-form");
let selected = null;

function render(category = "Toutes") {
  const visible = category === "Toutes" ? creations : creations.filter((item) => item.category === category);
  grid.innerHTML = visible.map((item, index) => `
    <article class="creation-card" style="--delay:${index * 55}ms">
      <button type="button" class="image-button" data-name="${item.name.replaceAll('"', '&quot;')}" aria-label="Découvrir et personnaliser ${item.name}">
        <img src="${item.image}" alt="${item.name}" ${index < 4 ? "fetchpriority=\"high\"" : "loading=\"lazy\""}>
        <span class="hover-label">✦ Personnaliser</span>
      </button>
      <div class="card-copy">
        <div><span>${item.category} · ${item.status}</span><h3>${item.name}</h3></div>
        <strong>À partir de ${item.price} €</strong>
      </div>
    </article>`).join("");

  grid.querySelectorAll(".image-button").forEach((button) => {
    button.addEventListener("click", () => openCreation(button.dataset.name));
  });
}

function openCreation(name) {
  selected = creations.find((item) => item.name === name);
  if (!selected) return;
  document.querySelector("#dialog-price").textContent = `Création personnalisable · À partir de ${selected.price} €`;
  document.querySelector("#dialog-title").textContent = selected.name;
  document.querySelector("#dialog-description").textContent = `${selected.note} Le tarif final dépend du format et des modifications demandées.`;
  document.querySelector("#dialog-photos").innerHTML = selected.images ? selected.images.map((src, index) => `<img src="${src}" alt="${selected.name} — vue ${index + 1}" loading="lazy">`).join("") : "";
  dialog.showModal();
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render(button.dataset.filter);
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selected) return;
  const data = new FormData(form);
  const message = [
    `Demande Chameleon26 Atelier — ${selected.name}`,
    `Couleurs : ${data.get("colors") || "à définir"}`,
    `Dimensions : ${data.get("dimensions") || "format du modèle"}`,
    `Modifications : ${data.get("details") || "aucune précision"}`,
    `Nom : ${data.get("name") || ""}`,
    `Contact : ${data.get("contact") || ""}`
  ].join("\n");
  const subject = `Demande de personnalisation — ${selected.name}`;
  location.href = `mailto:chameleon26atelier@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
});

render();
