// Vercel Serverless Function — back office (operador).
// Distinta de api/pedido.mjs. Lee los pedidos y cambia el estado de uno.
// Usa la llave secreta server-side (SUPABASE_SERVICE_KEY). Sin librerías ni build.

const SUPABASE_URL = "https://qwasusqlamfiueqrlhqs.supabase.co";

export default async function handler(req, res) {
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) {
    return res.status(500).json({ error: "Falta la variable de entorno SUPABASE_SERVICE_KEY" });
  }
  const headers = {
    "apikey": key,
    "Authorization": "Bearer " + key,
    "Content-Type": "application/json"
  };

  // Listar los pedidos (más recientes primero)
  if (req.method === "GET") {
    const r = await fetch(SUPABASE_URL + "/rest/v1/pedidos?select=*&order=created_at.desc", { headers });
    if (!r.ok) { return res.status(500).json({ error: await r.text() }); }
    const pedidos = await r.json();
    return res.status(200).json({ pedidos });
  }

  // Cambiar el estado de un pedido: { id, estado }
  if (req.method === "POST") {
    const { id, estado } = req.body || {};
    if (!id || !estado) {
      return res.status(400).json({ error: "Faltan id o estado" });
    }
    const r = await fetch(SUPABASE_URL + "/rest/v1/pedidos?id=eq." + encodeURIComponent(id), {
      method: "PATCH",
      headers: Object.assign({}, headers, { "Prefer": "return=minimal" }),
      body: JSON.stringify({ estado: estado })
    });
    if (!r.ok) { return res.status(500).json({ error: await r.text() }); }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
