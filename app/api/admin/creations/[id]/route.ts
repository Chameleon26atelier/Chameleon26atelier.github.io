import { env } from "cloudflare:workers";
import { requireAdminApi } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await requireAdminApi()) return Response.json({ error: "Accès refusé" }, { status: 403 });
  const id = parseId((await context.params).id);
  if (!id) return Response.json({ error: "Identifiant invalide" }, { status: 400 });

  const input = await request.json() as Record<string, unknown>;
  const name = String(input.name ?? "").trim();
  const category = String(input.category ?? "");
  const description = String(input.note ?? "").trim();
  const imageUrl = String(input.image ?? "").trim();
  const imageKey = input.imageKey ? String(input.imageKey) : null;
  const status = String(input.status ?? "Disponible");
  const price = Number(input.price);
  const position = Number(input.position ?? 999);

  if (!name || !description || !imageUrl || !Number.isFinite(price) || price < 0 ||
      !["Tableaux", "Objets détournés", "Horloges"].includes(category) ||
      !["Disponible", "Sur commande", "Vendu"].includes(status)) {
    return Response.json({ error: "Informations incomplètes ou invalides." }, { status: 400 });
  }

  await env.DB.prepare(
    "UPDATE creations SET name = ?, category = ?, price = ?, description = ?, image_url = ?, image_key = ?, status = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(name, category, Math.round(price), description, imageUrl, imageKey, status, Math.round(position), id).run();
  return Response.json({ updated: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await requireAdminApi()) return Response.json({ error: "Accès refusé" }, { status: 403 });
  const id = parseId((await context.params).id);
  if (!id) return Response.json({ error: "Identifiant invalide" }, { status: 400 });

  const row = await env.DB.prepare("SELECT image_key FROM creations WHERE id = ?").bind(id).first<{ image_key: string | null }>();
  await env.DB.prepare("DELETE FROM creations WHERE id = ?").bind(id).run();
  if (row?.image_key) await env.BUCKET.delete(row.image_key);
  return Response.json({ deleted: true });
}
