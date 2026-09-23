import { env } from "cloudflare:workers";
import { requireAdminApi } from "@/lib/admin-auth";
import { listCreations } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!await requireAdminApi()) return Response.json({ error: "Accès refusé" }, { status: 403 });
  return Response.json({ creations: await listCreations() });
}

export async function POST(request: Request) {
  if (!await requireAdminApi()) return Response.json({ error: "Accès refusé" }, { status: 403 });
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

  const result = await env.DB.prepare(
    "INSERT INTO creations (name, category, price, description, image_url, image_key, status, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(name, category, Math.round(price), description, imageUrl, imageKey, status, Math.round(position)).run();
  return Response.json({ id: Number(result.meta.last_row_id) }, { status: 201 });
}
