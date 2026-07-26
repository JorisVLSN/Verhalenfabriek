import "server-only";

function getDatabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseConfig());
}

export async function databaseRequest<T>(
  resource: string,
  init: RequestInit = {}
): Promise<T> {
  const config = getDatabaseConfig();
  if (!config) throw new Error("DATABASE_NOT_CONFIGURED");

  const response = await fetch(
    `${config.url}/rest/v1/${resource.replace(/^\//, "")}`,
    {
      ...init,
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Database error ${response.status}: ${details}`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
