import { listCreations } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ creations: await listCreations() });
  } catch (error) {
    console.error("catalog_load_failed", error);
    return Response.json({ error: "La galerie est momentanément indisponible." }, { status: 503 });
  }
}
