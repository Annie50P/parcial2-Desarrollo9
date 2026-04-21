# Plan: Arquitectura y Backlog SafeTech

## Fases del Proyecto
1. **MVP (Producto Mínimo Viable):** Catálogo, Autenticación (Clerk), Carrito, Checkout Básico (Stripe), Gestión de Inventario simple y Base de Datos (PostgreSQL via Bun).
2. **Mejoras (Postventa):** Módulo de Garantía Sólido (reportes, subida a S3 de evidencias), Panel Administrativo extendido para técnicos, Notificaciones y transacciones refinadas.
3. **Escalabilidad:** Caché (Redis), CDN para S3, Pipelines de CI/CD avanzados, Observabilidad.

## Módulos del Sistema
- **Auth:** Integración Clerk (Google, Microsoft, OTP), RBAC (Admin vs User).
- **Productos:** Catálogo público, Detalle (Grados A/B/C), Búsqueda/Filtros.
- **Pagos:** Carrito en Frontend temporal (Local Storage/Context), Stripe Checkout Sessions, Webhooks para confirmación.
- **Garantía:** Historial de compras, Flujo para reportar problema, Subida de imágenes a AWS S3.
- **Admin:** CRUD Productos, Dashboard de Órdenes, Gestión de Tickets de Garantía.

## Estructura Sugerida
**Frontend (React + Vite)**
- `/src/components` (reusables)
- `/src/pages` (vistas completas)
- `/src/hooks` (custom hooks)
- `/src/services` (api calls)
- `/src/store` (estado global - zustand/context)

**Backend (Bun)**
- `/src/controllers` (lógica de negocio)
- `/src/routes` (definición de endpoints)
- `/src/models` (esquemas DB)
- `/src/middlewares` (auth verification)
- `/src/services` (stripe, clerk, s3)
- `/src/db` (configuración postgres)

## Modelos de Base de Datos Sugeridos
- `users`: id, email, role (user/admin), created_at.
- `products`: id, name, description, price, stock, condition (A/B/C), image_urls (array), created_at.
- `orders`: id, user_id, total_amount, status (pending/paid/shipped), stripe_session_id.
- `order_items`: id, order_id, product_id, price, quantity.
- `warranty_reports`: id, order_item_id, user_id, description, status (pending/review/resolved), repair_notes, evidence_urls.

---

## 🔥 ESPECIFICACIÓN TÉCNICA DE ENDPOINTS (API REST)

### 1. Dominio: Productos (`/api/products`)
- **`GET /api/products`**
  - *Descripción:* Lista los productos disponibles.
  - *Query Params:* `?condition=A` (Opcional).
  - *Respuesta (200 OK):* `[{ id, name, price, stock, condition, image_urls }]`
- **`GET /api/products/:id`**
  - *Respuesta (200 OK):* Objeto completo del producto.
- **`POST /api/products` (Protegido: Admin)**
  - *Body Requerido:* `{ name, description, price, stock, condition, image_urls }`
  - *Respuesta (201 Created):* Producto creado.
- **`PUT /api/products/:id` (Protegido: Admin)**
  - *Body:* Campos a actualizar (ej. `{ stock: 10 }`)
- **`DELETE /api/products/:id` (Protegido: Admin)**

### 2. Dominio: Pagos y Órdenes (`/api/orders` & `/api/checkout`)
- **`POST /api/checkout` (Protegido: User)**
  - *Body Requerido:* `{ items: [{ productId: string, quantity: number }] }`
  - *Descripción:* Genera sesión con Stripe validando precios en DB.
  - *Respuesta (200 OK):* `{ checkoutUrl: "https://checkout.stripe.com/..." }`
- **`POST /api/webhooks/stripe` (Público)**
  - *Body:* Stripe Event Object (`checkout.session.completed`).
  - *Acción:* Crea `Orden`, `Order Items` y reduce `stock` atómicamente.
- **`GET /api/orders/mine` (Protegido: User)**
  - *Descripción:* Historial de compras del usuario autenticado.
  - *Respuesta (200 OK):* `[{ id, total_amount, status, created_at, items: [...] }]`
- **`GET /api/orders` (Protegido: Admin)**
  - *Descripción:* Ver todas las órdenes de la plataforma.

### 3. Dominio: Subidas / Assets (`/api/uploads`)
- **`POST /api/uploads` (Protegido: User/Admin)**
  - *Headers:* `Content-Type: multipart/form-data`
  - *Body:* Archivo binario (campo `file`).
  - *Respuesta (200 OK):* `{ url: "https://s3.amazonaws.com/bucket/file.jpg" }`

### 4. Dominio: Garantías (`/api/warranties`)
- **`POST /api/warranties` (Protegido: User)**
  - *Body Requerido:* `{ orderItemId: string, description: string, evidenceUrls: string[] }`
  - *Acción:* Valida que hayan pasado menos de 90 días desde la creación del `Order`.
  - *Respuesta (201 Created):* Ticket de garantía creado.
- **`GET /api/warranties` (Protegido: Admin)**
  - *Descripción:* Dashboard de soporte.
  - *Respuesta (200 OK):* Lista de tickets con status `pending`, `review`, `resolved`.
- **`PUT /api/warranties/:id/status` (Protegido: Admin)**
  - *Body Requerido:* `{ status: "resolved", repairNotes: "Cambio de pantalla" }`

---

## Backlog por Sprints (Selección Principal)

### Sprint 1: Cimientos y Catálogo
- **`[Issue 1]` Configurar Repositorios y DB (Backend/DB)**
  - *Descripción:* Configurar la base de datos PostgreSQL, ORM, y entorno de Bun.
  - *Criterios de Aceptación:* Base de datos funcionando, migraciones básicas ejecutables.
  - *Prioridad:* Alta | *Etiquetas:* backend, db
- **`[Issue 2]` Configurar Vite + UI Base e Integrar Clerk (Frontend/Auth)**
  - *Descripción:* Montar proyecto en React/Vite e implementar login/registro.
  - *Criterios de Aceptación:* Usuario puede registrarse e iniciar sesión con Google/OTP.
  - *Prioridad:* Alta | *Etiquetas:* frontend, auth
- **`[Issue 3]` Crear CRUD de Productos (Backend)**
  - *Descripción:* Crear esquemas de bd para productos y rutas HTTP.
  - *Criterios de Aceptación:* Endpoints GET, POST, PUT, DELETE funcionando.
  - *Prioridad:* Alta | *Etiquetas:* backend, API, db
- **`[Issue 4]` Listado y Detalle de Productos en UI (Frontend)**
  - *Descripción:* Implementar diseño de tienda exhibiendo datos del API.
  - *Criterios de Aceptación:* Views navegables del catálogo y detalles del producto.
  - *Prioridad:* Alta | *Etiquetas:* frontend

### Sprint 2: Pagos y Órdenes
- **`[Issue 5]` Implementar Carrito en local (Frontend)**
  - *Descripción:* Gestión de estado global para carrito.
  - *Criterios de Aceptación:* Usuario puede agregar y retirar items, ver suma total.
  - *Prioridad:* Media | *Etiquetas:* frontend
- **`[Issue 6]` Integrar Stripe Checkout (Backend/Pagos)**
  - *Descripción:* Generar sesiones Checkout desde el servidor.
  - *Criterios de Aceptación:* Endpoint que devuelve URL de Stripe válida.
  - *Prioridad:* Alta | *Etiquetas:* backend, payments
- **`[Issue 7]` Webhooks de Stripe y Creación de Orden (Backend/DB)**
  - *Descripción:* Manejar eventos `checkout.session.completed`.
  - *Criterios de Aceptación:* Se crea registro en `Orders` con status *paid* y se reduce stock.
  - *Prioridad:* Alta | *Etiquetas:* backend, payments, db
- **`[Issue 8]` Vista de Historial de Órdenes (Frontend)**
  - *Descripción:* Pantalla "Mis Pedidos" para usuarios.
  - *Criterios de Aceptación:* Lista de órdenes pertenecientes al user logged in.
  - *Prioridad:* Media | *Etiquetas:* frontend

### Sprint 3: Garantía y Admin MVP
- **`[Issue 9]` Integrar AWS S3 para Imágenes (Backend)**
  - *Descripción:* Configurar AWS SDK para subir imágenes (productos, evidencias).
  - *Criterios de Aceptación:* Función que sube foto y devuelve URL (bucket privado o público).
  - *Prioridad:* Alta | *Etiquetas:* backend, cloud
- **`[Issue 10]` Formulario de Reporte de Garantía UI (Frontend/Garantía)**
  - *Descripción:* Interface para que usuarios hagan efectivos reclamos dentro de 90 días.
  - *Criterios de Aceptación:* Form sube imagen y texto y crea ticket exitoso.
  - *Prioridad:* Media | *Etiquetas:* frontend
- **`[Issue 11]` Endpoints para Tickets de Garantía (Backend)**
  - *Descripción:* API para manejo de reportes.
  - *Criterios de Aceptación:* Endpoint POST para usuario, GET/PUT para admins.
  - *Prioridad:* Alta | *Etiquetas:* backend, db
- **`[Issue 12]` Panel Admin Dashboard (Frontend/Admin)**
  - *Descripción:* Vista protegida solo para rol admin.
  - *Criterios de Aceptación:* Mostrar lista de órdenes y reportes de garantía activos para gestionar.
  - *Prioridad:* Media | *Etiquetas:* frontend, auth

## Trabajo en Equipo y Paralelización
- **Persona A (Frontend):** Configuración de Vite, Clerk Auth, UI de Catálogo, Carrito.
- **Persona B (Backend):** Esquemas DB en PostgreSQL, Bun Server, Rutas de Productos, Clerk Webhooks (sync DB).
*Dependencias clave:* Frontend puede mockear datos (o usar Swagger) mientras Backend desarrolla. Integración S3 (Backend) bloquea la Subida de Evidencia (Frontend).

## Riesgos y Mejores Prácticas
- **Riesgos:** Consistencia de Stock concurrente (usar transacciones en DB).
- **Prácticas:** Usar migraciones en vez de SQL manual. Tipado fuerte con Zod/TypeScript. Variables de entorno estrictas.
