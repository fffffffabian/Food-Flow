// Vercel Serverless Function — chatbot con conocimiento (grounded) de Food Flow.
// La llave de Gemini vive server-side (variable de entorno GEMINI_API_KEY), nunca en el navegador.
// Sin librerías ni build: usa fetch nativo (Node 18+).

const INFO = `Eres el asistente virtual de Food Flow, una plataforma web de pedidos de comida a
domicilio para pequeñas y medianas empresas. Responde SIEMPRE en español, de forma breve y amable,
y SOLO sobre Food Flow. Si te preguntan algo ajeno a Food Flow, dilo con amabilidad y reencauza.

Información de Food Flow:
- Es una plataforma donde una tienda muestra su menú y el cliente pide a domicilio, sin llamar ni escribir por WhatsApp.
- Tienda actual: Mr Sushi (Zona 10, Ciudad de Guatemala). Costo de envío: Q15.
- Menú: California Roll (Q45), Philadelphia Roll (Q52), Dragon Roll (Q65).
- Cómo pedir: entras al menú, abres un producto y lo agregas al carrito, revisas el carrito,
  ingresas tus datos de entrega (nombre, teléfono, dirección y método de pago) y confirmas.
- Al confirmar recibes un número de pedido (folio, formato FF-XXXXXX) y el estado "Recibido".
- Estados del pedido, en orden: Recibido, En preparación, En camino, Entregado.
- Pago: contra entrega (efectivo o tarjeta). No hay pago en línea.`;

// Modelo de Gemini a usar. Si el chatbot responde con error "model not found" (404),
// cambia SOLO esta línea por el ID exacto que aparezca en Google AI Studio
// (ej.: gemini-2.5-flash o gemini-2.0-flash).
const MODEL = "gemini-3.6-flash";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "Falta la variable de entorno GEMINI_API_KEY" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "Falta el mensaje del usuario" });
  }

  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + key;

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: INFO }] },
      contents: [{ role: "user", parts: [{ text: message }] }]
    })
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    return res.status(500).json({ error: detalle });
  }

  const data = await respuesta.json();
  const reply = (((data.candidates || [])[0] || {}).content || {}).parts?.[0]?.text
    || "Lo siento, no pude responder en este momento.";

  return res.status(200).json({ reply });
}
