"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Mail, Palette, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Creation, defaultCreations } from "@/lib/creations";

const categories = ["Toutes", "Tableaux", "Objets détournés", "Horloges"] as const;

export default function Home() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Toutes");
  const [creations, setCreations] = useState<Creation[]>(defaultCreations);
  const [selected, setSelected] = useState<Creation | null>(null);

  const filtered = useMemo(
    () => category === "Toutes" ? creations : creations.filter((item) => item.category === category),
    [category],
  );

  useEffect(() => {
    void fetch("/api/creations", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { creations: Creation[] }) => setCreations(data.creations))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "open_creation_customization",
      title: "Personnaliser une création",
      description: "Ouvre le formulaire de personnalisation d’une création de la galerie.",
      inputSchema: { type: "object", properties: { creationId: { type: "number", minimum: 1 } }, required: ["creationId"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const id = Number((input as { creationId?: number })?.creationId);
        const creation = creations.find((item) => item.id === id);
        if (!creation) throw new Error("Création introuvable");
        setSelected(creation);
        return { opened: true, creationId: id, name: creation.name };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [creations]);

  async function prepareRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const data = new FormData(event.currentTarget);
    const message = [
      `Demande Chameleon26 Atelier — ${selected.name}`,
      `Couleurs : ${data.get("colors") || "à définir"}`,
      `Dimensions : ${data.get("dimensions") || "format du modèle"}`,
      `Modifications : ${data.get("details") || "aucune précision"}`,
      `Nom : ${data.get("name") || ""}`,
      `Contact : ${data.get("contact") || ""}`,
    ].join("\n");

    const subject = `Demande de personnalisation — ${selected.name}`;
    window.location.href = `mailto:chameleon26atelier@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#galerie" aria-label="Chameleon26 Atelier — galerie">
          <span className="brand-mark">C<span>26</span></span>
          <span className="brand-copy"><strong>CHAMELEON26</strong><small>ATELIER</small></span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#galerie">Galerie</a>
          <a href="#atelier">L’atelier</a>
          <a className="nav-cta" href="#galerie">Créer la vôtre <ArrowUpRight size={16} /></a>
        </nav>
      </header>

      <section className="intro" id="galerie">
        <div className="intro-kicker"><Sparkles size={17} /> Pièces uniques & créations sur mesure</div>
        <h1>L’objet change.<br /><em>Votre intérieur aussi.</em></h1>
        <p>Choisissez un modèle, imaginez vos couleurs et racontez-nous la pièce qui vous ressemble.</p>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="gallery-topline">
          <h2 id="gallery-title">Les créations <sup>{creations.length}</sup></h2>
          <div className="filters" aria-label="Filtrer les créations">
            {categories.map((item) => (
              <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </div>

        <div className="gallery-grid">
          {filtered.map((item, index) => (
            <article className={`creation-card ${item.status === "Vendu" ? "sold" : ""}`} key={item.id} style={{ "--delay": `${index * 55}ms` } as React.CSSProperties}>
              <button type="button" className="image-button" onClick={() => setSelected(item)} aria-label={`Découvrir et personnaliser ${item.name}`}>
                <img src={item.image} alt={item.name} loading={index < 4 ? "eager" : "lazy"} />
                <span className="hover-label"><Palette size={18} /> {item.status === "Vendu" ? "Voir le modèle" : "Personnaliser"}</span>
              </button>
              <div className="card-copy">
                <div><span>{item.category} · {item.status}</span><h3>{item.name}</h3></div>
                <strong>À partir de {item.price} €</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="atelier" id="atelier">
        <p className="section-index">01 — LA DÉMARCHE</p>
        <div>
          <h2>Rien ne se perd.<br />Tout se <span>réinvente.</span></h2>
          <p>Chameleon26 Atelier détourne, assemble et colore des objets ordinaires pour en faire des pièces décoratives singulières. Chaque modèle peut devenir le point de départ d’une création qui vous appartient.</p>
          <p className="atelier-manifesto">Je récupère ce qu’on oublie, je détourne ce qu’on connaît. Entre essais, accidents heureux et idées un peu décalées.</p>
        </div>
        <ol>
          <li><span>1</span><div><strong>Choisissez</strong><small>Un modèle dans la galerie</small></div></li>
          <li><span>2</span><div><strong>Imaginez</strong><small>Couleurs, format et détails</small></div></li>
          <li><span>3</span><div><strong>Échangeons</strong><small>Votre projet est confirmé sur devis</small></div></li>
        </ol>
      </section>

      <footer>
        <div className="footer-mark">C26</div>
        <div><strong>CHAMELEON26 ATELIER</strong><p>Décorer ou détourner ? Nous avons choisi les deux.</p></div>
        <div className="footer-links"><a href="#galerie">Voir la galerie <ArrowUpRight size={18} /></a><a href="mailto:chameleon26atelier@gmail.com">chameleon26atelier@gmail.com</a><a className="admin-link" href="/admin">Administration</a></div>
      </footer>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="custom-dialog">
          {selected && (
            <>
              <DialogHeader>
                <div className="dialog-eyebrow">Création personnalisable · À partir de {selected.price} €</div>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.note} Le tarif final dépend du format et des modifications demandées.</DialogDescription>
              </DialogHeader>
              <form onSubmit={prepareRequest} className="custom-form">
                <label>Couleurs souhaitées<input name="colors" placeholder="Ex. bleu nuit, orange et doré" /></label>
                <label>Dimensions souhaitées<input name="dimensions" placeholder="Ex. 50 × 70 cm ou format du modèle" /></label>
                <label>Votre idée<textarea name="details" rows={3} placeholder="Décrivez les changements que vous imaginez…" /></label>
                <div className="form-row">
                  <label>Votre nom<input name="name" required placeholder="Prénom et nom" /></label>
                  <label>Votre contact<input name="contact" required placeholder="E-mail ou téléphone" /></label>
                </div>
                <button className="submit-button" type="submit"><Mail size={18} /> Envoyer ma demande par e-mail</button>
                <p className="form-note">Aucun paiement immédiat. L’atelier confirme la faisabilité, le prix et le délai avant toute commande.</p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
