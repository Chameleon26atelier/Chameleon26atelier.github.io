"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, LoaderCircle, LogOut, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Creation } from "@/lib/creations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

type EditorState = Omit<Creation, "id"> & { id?: number };

const emptyEditor: EditorState = {
  name: "",
  category: "Tableaux",
  price: 75,
  image: "",
  imageKey: null,
  note: "",
  status: "Disponible",
  position: 99,
};

export default function AdminClient({ displayName, signOutPath }: { displayName: string; signOutPath: string }) {
  const [items, setItems] = useState<Creation[]>([]);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deleteItem, setDeleteItem] = useState<Creation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/creations", { cache: "no-store" });
      if (!response.ok) throw new Error("Impossible d’ouvrir le catalogue.");
      const data = await response.json() as { creations: Creation[] };
      setItems(data.creations);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    setSaving(true);
    setError("");
    const form = event.currentTarget;
    let image = editor.image;
    let imageKey = editor.imageKey ?? null;
    try {
      const imageFile = (form.elements.namedItem("photo") as HTMLInputElement)?.files?.[0];
      if (imageFile) {
        const upload = new FormData();
        upload.append("image", imageFile);
        const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: upload });
        const uploadData = await uploadResponse.json() as { image?: string; imageKey?: string; error?: string };
        if (!uploadResponse.ok || !uploadData.image) throw new Error(uploadData.error || "L’envoi de la photo a échoué.");
        image = uploadData.image;
        imageKey = uploadData.imageKey ?? null;
      }
      if (!image) throw new Error("Ajoute une photo à la création.");

      const method = editor.id ? "PUT" : "POST";
      const endpoint = editor.id ? `/api/admin/creations/${editor.id}` : "/api/admin/creations";
      const response = await fetch(endpoint, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...editor, image, imageKey }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "L’enregistrement a échoué.");
      setEditor(null);
      setMessage(editor.id ? "Création modifiée." : "Création ajoutée.");
      window.setTimeout(() => setMessage(""), 3000);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteItem) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/creations/${deleteItem.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("La suppression a échoué.");
      setDeleteItem(null);
      setMessage("Création supprimée.");
      window.setTimeout(() => setMessage(""), 3000);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div className="admin-brand"><span>C26</span><div><strong>CHAMELEON26</strong><small>ESPACE ADMINISTRATEUR</small></div></div>
        <div className="admin-account"><span>{displayName}</span><a href={signOutPath} target="_top"><LogOut size={16} /> Déconnexion</a></div>
      </header>

      <section className="admin-content">
        <div className="admin-toolbar">
          <div>
            <a className="back-link" href="/"><ArrowLeft size={16} /> Voir la galerie</a>
            <h1>Les créations</h1>
            <p>{items.length} modèles dans la galerie</p>
          </div>
          <button className="admin-primary" type="button" onClick={() => setEditor({ ...emptyEditor, position: items.length + 1 })}><Plus size={18} /> Ajouter une création</button>
        </div>

        {message && <div className="admin-success" role="status">{message}</div>}
        {error && <div className="admin-error" role="alert">{error}</div>}

        {loading ? (
          <div className="admin-loading"><LoaderCircle className="spin" /> Chargement du catalogue…</div>
        ) : items.length === 0 ? (
          <div className="admin-empty"><ImagePlus size={36} /><h2>La galerie est vide</h2><p>Ajoute ta première création pour commencer.</p></div>
        ) : (
          <div className="admin-list">
            {items.map((item) => (
              <article className="admin-item" key={item.id}>
                <img src={item.image} alt="" />
                <div className="admin-item-copy">
                  <div className="admin-meta"><span>{item.category}</span><span className={`status status-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></div>
                  <h2>{item.name}</h2>
                  <p>{item.note}</p>
                </div>
                <div className="admin-price">À partir de <strong>{item.price} €</strong><small>Position {item.position}</small></div>
                <div className="admin-actions">
                  <button type="button" aria-label={`Modifier ${item.name}`} onClick={() => setEditor({ ...item })}><Pencil size={18} /> Modifier</button>
                  <button className="danger" type="button" aria-label={`Supprimer ${item.name}`} onClick={() => setDeleteItem(item)}><Trash2 size={18} /></button>
                </div>
              </article>
            ))}
          </div>
        )}
        <button className="refresh-button" type="button" onClick={() => void load()} disabled={loading}><RefreshCw size={16} /> Actualiser</button>
      </section>

      <Dialog open={Boolean(editor)} onOpenChange={(open) => !open && !saving && setEditor(null)}>
        <DialogContent className="admin-dialog">
          {editor && <>
            <DialogHeader>
              <DialogTitle>{editor.id ? "Modifier la création" : "Ajouter une création"}</DialogTitle>
              <DialogDescription>Les changements apparaîtront dans la galerie dès l’enregistrement.</DialogDescription>
            </DialogHeader>
            <form className="admin-form" onSubmit={save}>
              <label>Nom<input required value={editor.name} onChange={(e) => setEditor({ ...editor, name: e.target.value })} placeholder="Nom de la création" /></label>
              <div className="admin-form-row">
                <label>Catégorie<NativeSelect value={editor.category} onChange={(e) => setEditor({ ...editor, category: e.target.value as Creation["category"] })}><NativeSelectOption>Tableaux</NativeSelectOption><NativeSelectOption>Objets détournés</NativeSelectOption><NativeSelectOption>Horloges</NativeSelectOption></NativeSelect></label>
                <label>Statut<NativeSelect value={editor.status} onChange={(e) => setEditor({ ...editor, status: e.target.value as Creation["status"] })}><NativeSelectOption>Disponible</NativeSelectOption><NativeSelectOption>Sur commande</NativeSelectOption><NativeSelectOption>Vendu</NativeSelectOption></NativeSelect></label>
              </div>
              <div className="admin-form-row">
                <label>Prix de départ (€)<input required min="0" step="1" type="number" value={editor.price} onChange={(e) => setEditor({ ...editor, price: Number(e.target.value) })} /></label>
                <label>Position<input required min="1" step="1" type="number" value={editor.position} onChange={(e) => setEditor({ ...editor, position: Number(e.target.value) })} /></label>
              </div>
              <label>Description<textarea required rows={3} value={editor.note} onChange={(e) => setEditor({ ...editor, note: e.target.value })} placeholder="Matières, technique, personnalisations possibles…" /></label>
              <label className="photo-field">Photo<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required={!editor.image} /><small>JPG, PNG ou WebP · 8 Mo maximum</small></label>
              {editor.image && <div className="current-photo"><img src={editor.image} alt="Aperçu actuel" /><span>Photo actuelle</span></div>}
              <button className="admin-primary save-button" type="submit" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={18} /> Enregistrement…</> : "Enregistrer"}</button>
            </form>
          </>}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteItem)} onOpenChange={(open) => !open && !saving && setDeleteItem(null)}>
        <AlertDialogContent className="delete-dialog">
          <AlertDialogHeader><AlertDialogTitle>Supprimer « {deleteItem?.name} » ?</AlertDialogTitle><AlertDialogDescription>Cette création disparaîtra de la galerie. Cette action est définitive.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={saving}>Annuler</AlertDialogCancel><AlertDialogAction disabled={saving} onClick={(event) => { event.preventDefault(); void confirmDelete(); }}>Supprimer</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
