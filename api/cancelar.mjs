// Vercel Serverless Function — tercera transacción: cancelar un pedido por folio.
// Distinta de api/pedido.mjs y api/admin.mjs. Cambia el estado a "Cancelado".
// Usa la llave secreta server-side (SUPABASE_SERVICE_KEY). Sin librerías ni build.

const SUPABASE_URL = "https://qwasusqlamfiueqrlhqs.supabase.co";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) {
    return res.status(500).json({ error: "Falta la variable de entorno SUPABASE_SERVICE_KEY" });
  }

  const { folio } = req.body || {};
  if (!folio) {
    return res.status(400).json({ error: "Falta el folio del pedido" });
  }

  const r = await fetch(SUPABASE_URL + "/rest/v1/pedidos?folio=eq." + encodeURIComponent(folio), {
    method: "PATCH",
    headers: {
      "apikey": key,
      "Authorization": "Bearer " + key,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ estado: "Cancelado" })
  });

  if (!r.ok) {
    return res.status(500).json({ error: await r.text() });
  }

  const filas = await r.json();
  if (!filas || filas.length === 0) {
    return res.status(404).json({ error: "No encontramos un pedido con ese folio" });
  }

  return res.status(200).json({ folio: folio, estado: "Cancelado" });
}
