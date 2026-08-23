# Functional Requirements Document (FRD)

## Funcionalidad

Realizar un pedido en línea para entrega a domicilio y darle seguimiento hasta la entrega.

Este documento describe, pantalla por pantalla, las tres funcionalidades Must del PRD:

1. Realizar pedidos en línea → Pantallas 1, 2, 3 y 4.
2. Confirmación inmediata del pedido → Pantalla 5.
3. Seguimiento del estado del pedido → Pantalla 6.

### Estado de implementación (D3)

- **Construidas y funcionando:** Pantalla 1 (Menú), Pantalla 2 (Detalle de producto), Pantalla 3 (Carrito) y Pantalla 4 (Datos de entrega).
- **Pendientes (próximas entregas):** Pantalla 5 (Confirmación) y Pantalla 6 (Seguimiento).

La Pantalla 4 (Datos de entrega) es un formulario que **guarda el pedido en una base de datos** (tabla `pedidos` en Supabase): al confirmar, se escribe una fila con nombre, teléfono, dirección, método de pago, el detalle del pedido y el total.

---

## Pantalla 1 – Menú

### Usuario visualiza

- Nombre de la tienda, su zona de entrega y su costo de envío
- Productos con nombre, descripción, categoría y precio
- Imagen de cada producto
- Botón Ver detalle

### Entrada

- Selección de un producto (Ver detalle)

### Salida

- Abre el detalle del producto elegido

### Casos borde

- Si el menú no tiene productos, se muestra "Este menú todavía no tiene productos."

---

## Pantalla 2 – Detalle de producto

### Usuario visualiza

- Nombre, descripción, categoría y precio del producto
- Imagen del producto
- De qué tienda es y su costo de envío
- Botón Agregar al carrito
- Enlace Volver al menú

### Entrada

- Botón Agregar al carrito

### Salida

- Producto agregado al carrito (el contador del carrito se actualiza)
- Mensaje de confirmación con un enlace para ver el carrito

### Casos borde

- Si el producto está agotado, el botón muestra "No disponible" y queda deshabilitado.
- Si el producto no existe, se muestra "No encontramos ese producto."

---

## Pantalla 3 – Carrito

### Usuario visualiza

- Productos seleccionados con su cantidad y precio por unidad
- Total de cada línea
- Subtotal, Envío y Total

### Entrada

- Modificar cantidad (+ / −)
- Eliminar producto
- Vaciar carrito
- Botón Continuar

### Salida

- Total actualizado

### Casos borde

- Si el carrito está vacío, se muestra "Tu carrito está vacío" y el botón Continuar queda deshabilitado.
- Si la cantidad de un producto se reduce a 0, el producto se elimina del carrito.

---

## Pantalla 4 – Datos de entrega

### Usuario visualiza

- Resumen del pedido (productos y total, tomados del carrito)
- Formulario con: Nombre, Teléfono, Dirección, Método de pago

### Entrada

Información del cliente y envío del formulario.

### Salida

- El pedido se guarda en la base de datos (tabla `pedidos`).
- Se muestra un mensaje de confirmación (agradecimiento).

### Casos borde

- Si la dirección de entrega está vacía, se muestra "La dirección de entrega es obligatoria." y el botón Confirmar permanece deshabilitado.
- Si el teléfono no tiene un formato válido, se muestra "Ingresa un teléfono válido."
- Si la dirección está fuera de la zona de cobertura, se muestra "Lo sentimos, aún no llegamos a tu zona." y no se permite continuar.

---

## Pantalla 5 – Confirmación

### Usuario visualiza

Resumen del pedido.

### Entrada

Botón Confirmar.

### Salida

Número de pedido.
Estado "Pedido recibido".

### Casos borde

- Si se pierde la conexión al confirmar, el pedido no se envía y se muestra "No pudimos enviar tu pedido, intenta de nuevo."

---

## Pantalla 6 – Seguimiento del pedido

### Usuario visualiza

- Número de pedido
- Estado actual con los pasos: Recibido → En preparación → En camino → Entregado
- Tiempo estimado de entrega

### Entrada

- Número de pedido (o acceso directo desde la pantalla de confirmación)

### Salida

- Estado del pedido actualizado en tiempo real

### Casos borde

- Si el número de pedido no existe, se muestra "No encontramos ese pedido."
- Si el pedido ya fue entregado, se muestra el estado final "Entregado" con la fecha y hora.
