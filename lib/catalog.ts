import { env } from "cloudflare:workers";
import { Creation, defaultCreations } from "@/lib/creations";

type CreationRow = {
  id: number;
  name: string;
  category: Creation["category"];
  price: number;
  description: string;
  image_url: string;
  image_key: string | null;
  status: Creation["status"];
  position: number;
};

function mapRow(row: CreationRow): Creation {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    image: row.image_url,
    imageKey: row.image_key,
    note: row.description,
    status: row.status,
    position: row.position,
  };
}

async function seedCatalogIfEmpty() {
  const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM creations").first<{ count: number }>();
  if (Number(count?.count ?? 0) > 0) return;
  const statements = defaultCreations.map((item) =>
    env.DB.prepare(
      "INSERT OR IGNORE INTO creations (id, name, category, price, description, image_url, image_key, status, position) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)"
    ).bind(item.id, item.name, item.category, item.price, item.note, item.image, item.status, item.position)
  );
  await env.DB.batch(statements);
}

async function applyCatalogUpdates() {
  const migrationKey = "add-joyeux-bazar-v1";
  const applied = await env.DB.prepare(
    "SELECT key FROM catalog_migrations WHERE key = ?"
  ).bind(migrationKey).first<{ key: string }>();
  if (applied) return;

  const item = defaultCreations.find((creation) => creation.id === 11);
  if (!item) return;

  await env.DB.batch([
    env.DB.prepare(
      "INSERT OR IGNORE INTO creations (id, name, category, price, description, image_url, image_key, status, position) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)"
    ).bind(item.id, item.name, item.category, item.price, item.note, item.image, item.status, item.position),
    env.DB.prepare(
      "INSERT OR IGNORE INTO catalog_migrations (key) VALUES (?)"
    ).bind(migrationKey),
  ]);
}

export async function listCreations(): Promise<Creation[]> {
  await seedCatalogIfEmpty();
  await applyCatalogUpdates();
  const result = await env.DB.prepare(
    "SELECT id, name, category, price, description, image_url, image_key, status, position FROM creations ORDER BY position ASC, id ASC"
  ).all<CreationRow>();
  return result.results.map(mapRow);
}
