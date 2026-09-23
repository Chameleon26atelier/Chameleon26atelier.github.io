import { env } from "cloudflare:workers";

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const key = (await context.params).key;
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(key)) return new Response("Introuvable", { status: 404 });
  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Introuvable", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  return new Response(object.body, { headers });
}
