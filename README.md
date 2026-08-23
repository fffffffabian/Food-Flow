# Food Flow

Food Flow es una plataforma web donde pequeñas y medianas empresas (PyMEs) ofrecen su propio servicio de pedidos y entrega a domicilio. El cliente entra al menú de la tienda, abre un producto, lo agrega a su carrito y revisa su total, sin tener que llamar ni escribir por WhatsApp.

## Prototipo en vivo

🔗 **https://proyecto-ashen-gamma.vercel.app/**

Se abre directo en el navegador (publicado con Vercel). No hay que instalar nada; simplemente abre el enlace.

## Qué hace hoy (D3)

- **Menú (home):** muestra los productos de la tienda leídos desde `data/products.json`.
- **Detalle de producto:** abre un producto y permite **agregarlo al carrito**.
- **Carrito:** pantalla con los productos elegidos, cantidades, subtotal, envío y total; se puede modificar la cantidad, quitar productos y vaciar el carrito. El carrito se mantiene al moverse entre pantallas.
- **Datos de entrega:** formulario que **guarda el pedido en una base de datos** (tabla `pedidos` en Supabase) y muestra un mensaje de confirmación.

## Cómo está construido

HTML, CSS y JavaScript plano, con **Bootstrap 5** y **Bootstrap Icons** cargados desde CDN. El catálogo se lee de archivos locales en `/data` (`products.json` y `businesses.json`). El formulario de pedido escribe en una tabla de **Supabase** usando su librería cargada desde CDN. Sin framework y sin paso de build.

## Pantallas

- `index.html` — Menú (home)
- `product.html` — Detalle de producto
- `cart.html` — Carrito
- `pedido.html` — Datos de entrega (formulario que guarda el pedido)

## Los tres Must

- Realizar pedidos en línea.
- Confirmación inmediata del pedido.
- Seguimiento del estado del pedido.
