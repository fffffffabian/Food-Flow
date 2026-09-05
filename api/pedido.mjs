// Vercel Serverless Function — guarda un pedido en Supabase.
// La llave SECRETA nunca vive en el código: se lee de la variable de entorno
// SUPABASE_SERVICE_KEY (configurada en el .env local y en Vercel).
// Usa fetch nativo (Node 18+), sin librerías ni paso de build.

const SUPABASE_URL = "https://qwasusqlamfiueqrlhqs.supabase.co"; // dirección pública del proyecto

export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) {
    return res.status(500).json({ error: "Falta la variable de entorno SUPABASE_SERVICE_KEY" });
  }

  const { nombre, telefono, direccion, metodo_pago, pedido, total } = req.body || {};

  // La función genera el folio y el estado inicial (una sola vuelta):
  // se guardan en la fila y se devuelven al cliente para la confirmación.
  const folio = "FF-" + String(Date.now()).slice(-6);
  const estado = "Recibido";

  const respuesta = await fetch(SUPABASE_URL + "/rest/v1/pedidos", {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": "Bearer " + key,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ nombre, telefono, direccion, metodo_pago, pedido, total, folio, estado })
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    return res.status(500).json({ error: detalle });
  }

  // Devolvemos folio y estado para que la pantalla de confirmación los muestre
  // sin volver a preguntarle a la base de datos.
  return res.status(200).json({ folio, estado });
}
