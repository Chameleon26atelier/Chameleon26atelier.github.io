import { env } from "cloudflare:workers";
import { requireAdminApi } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  if (!await requireAdminApi()) return Response.json({ error: "Accès refusé" }, { status: 403 });
  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File)) return Response.json({ error: "Photo manquante." }, { status: 400 });
  const extension = allowedTypes.get(file.type);
  if (!extension) return Response.json({ error: "Format accepté : JPG, PNG ou WebP." }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return Response.json({ error: "La photo doit faire moins de 8 Mo." }, { status: 400 });

  const key = `${crypto.randomUUID()}.${extension}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });
  return Response.json({ image: `/api/images/${key}`, imageKey: key });
}
