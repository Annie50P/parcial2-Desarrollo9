# Plan: Arquitectura y Backlog SafeTech

## Fases del Proyecto
1. **MVP (Producto MÃ­nimo Viable):** CatÃ¡logo, AutenticaciÃ³n (Clerk), Carrito, Checkout BÃ¡sico (Stripe), GestiÃ³n de Inventario simple y Base de Datos (MongoDB via Bun).
2. **Mejoras (Postventa):** MÃ³dulo de GarantÃ­a SÃ³lido (reportes, subida a S3 de evidencias), Panel Administrativo extendido para tÃ©cnicos, Notificaciones y transacciones refinadas.
3. **Escalabilidad:** CachÃ© (Redis), CDN para S3, Pipelines de CI/CD avanzados, Observabilidad.

## MÃ³dulos del Sistema
- **Auth:** IntegraciÃ³n Clerk (Google, Microsoft, OTP), RBAC (Admin vs User).
- **Productos:** CatÃ¡logo pÃºblico, Detalle (Grados A/B/C), BÃºsqueda/Filtros.
- **Pagos:** Carrito en Frontend temporal (Local Storage/Context), Stripe Checkout Sessions, Webhooks para confirmaciÃ³n.
- **GarantÃ­a:** Historial de compras, Flujo para reportar problema, Subida de imÃ¡genes a AWS S3.
- **Admin:** CRUD Productos, Dashboard de Ã“rdenes, GestiÃ³n de Tickets de GarantÃ­a.

## Estructura Sugerida
**Frontend (React + Vite)**
- `/src/components` (reusables)
- `/src/pages` (vistas completas)
- `/src/hooks` (custom hooks)
- `/src/services` (api calls)
- `/src/store` (estado global - zustand/context)

**Backend (Bun)**
- `/src/controllers` (lÃ³gica de negocio)
- `/src/routes` (definiciÃ³n de endpoints)
- `/src/models` (esquemas DB)
- `/src/middlewares` (auth verification)
- `/src/services` (stripe, clerk, s3)
- `/src/db` (configuraciÃ³n mongodb)

## Modelos de Base de Datos Sugeridos
- `users`: id, email, role (user/admin), created_at.
- `products`: id, name, description, price, stock, condition (A/B/C), image_urls (array), created_at.
- `orders`: id, user_id, total_amount, status (pending/paid/shipped), stripe_session_id.
- `order_items`: id, order_id, product_id, price, quantity.
- `warranty_reports`: id, order_item_id, user_id, description, status (pending/review/resolved), repair_notes, evidence_urls.

---

## ðŸ”¥ ESPECIFICACIÃ“N TÃ‰CNICA DE ENDPOINTS (API REST)

### 1. Dominio: Productos (`/api/products`)
- **`GET /api/products`**
  - *DescripciÃ³n:* Lista los productos disponibles.
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

### 2. Dominio: Pagos y Ã“rdenes (`/api/orders` & `/api/checkout`)
- **`POST /api/checkout` (Protegido: User)**
  - *Body Requerido:* `{ items: [{ productId: string, quantity: number }] }`
  - *DescripciÃ³n:* Genera sesiÃ³n con Stripe validando precios en DB.
  - *Respuesta (200 OK):* `{ checkoutUrl: "https://checkout.stripe.com/..." }`
- **`POST /api/webhooks/stripe` (PÃºblico)**
  - *Body:* Stripe Event Object (`checkout.session.completed`).
  - *AcciÃ³n:* Crea `Orden`, `Order Items` y reduce `stock` atÃ³micamente.
- **`GET /api/orders/mine` (Protegido: User)**
  - *DescripciÃ³n:* Historial de compras del usuario autenticado.
  - *Respuesta (200 OK):* `[{ id, total_amount, status, created_at, items: [...] }]`
- **`GET /api/orders` (Protegido: Admin)**
  - *DescripciÃ³n:* Ver todas las Ã³rdenes de la plataforma.

### 3. Dominio: Subidas / Assets (`/api/uploads`)
- **`POST /api/uploads` (Protegido: User/Admin)**
  - *Headers:* `Content-Type: multipart/form-data`
  - *Body:* Archivo binario (campo `file`).
  - *Respuesta (200 OK):* `{ url: "https://s3.amazonaws.com/bucket/file.jpg" }`

### 4. Dominio: GarantÃ­as (`/api/warranties`)
- **`POST /api/warranties` (Protegido: User)**
  - *Body Requerido:* `{ orderItemId: string, description: string, evidenceUrls: string[] }`
  - *AcciÃ³n:* Valida que hayan pasado menos de 90 dÃ­as desde la creaciÃ³n del `Order`.
  - *Respuesta (201 Created):* Ticket de garantÃ­a creado.
- **`GET /api/warranties` (Protegido: Admin)**
  - *DescripciÃ³n:* Dashboard de soporte.
  - *Respuesta (200 OK):* Lista de tickets con status `pending`, `review`, `resolved`.
- **`PUT /api/warranties/:id/status` (Protegido: Admin)**
  - *Body Requerido:* `{ status: "resolved", repairNotes: "Cambio de pantalla" }`

---

## Backlog por Sprints (SelecciÃ³n Principal)

### Sprint 1: Cimientos y CatÃ¡logo
- **`[Issue 1]` Configurar Repositorios y DB (Backend/DB)**
  - *DescripciÃ³n:* Configurar la base de datos MongoDB, ORM, y entorno de Bun.
  - *Criterios de AceptaciÃ³n:* Base de datos funcionando, migraciones bÃ¡sicas ejecutables.
  - *Prioridad:* Alta | *Etiquetas:* backend, db
- **`[Issue 2]` Configurar Vite + UI Base e Integrar Clerk (Frontend/Auth)**
  - *DescripciÃ³n:* Montar proyecto en React/Vite e implementar login/registro.
  - *Criterios de AceptaciÃ³n:* Usuario puede registrarse e iniciar sesiÃ³n con Google/OTP.
  - *Prioridad:* Alta | *Etiquetas:* frontend, auth
- **`[Issue 3]` Crear CRUD de Productos (Backend)**
  - *DescripciÃ³n:* Crear esquemas de bd para productos y rutas HTTP.
  - *Criterios de AceptaciÃ³n:* Endpoints GET, POST, PUT, DELETE funcionando.
  - *Prioridad:* Alta | *Etiquetas:* backend, API, db
- **`[Issue 4]` Listado y Detalle de Productos en UI (Frontend)**
  - *DescripciÃ³n:* Implementar diseÃ±o de tienda exhibiendo datos del API.
  - *Criterios de AceptaciÃ³n:* Views navegables del catÃ¡logo y detalles del producto.
  - *Prioridad:* Alta | *Etiquetas:* frontend

### Sprint 2: Pagos y Ã“rdenes
- **`[Issue 5]` Implementar Carrito en local (Frontend)**
  - *DescripciÃ³n:* GestiÃ³n de estado global para carrito.
  - *Criterios de AceptaciÃ³n:* Usuario puede agregar y retirar items, ver suma total.
  - *Prioridad:* Media | *Etiquetas:* frontend
- **`[Issue 6]` Integrar Stripe Checkout (Backend/Pagos)**
  - *DescripciÃ³n:* Generar sesiones Checkout desde el servidor.
  - *Criterios de AceptaciÃ³n:* Endpoint que devuelve URL de Stripe vÃ¡lida.
  - *Prioridad:* Alta | *Etiquetas:* backend, payments
- **`[Issue 7]` Webhooks de Stripe y CreaciÃ³n de Orden (Backend/DB)**
  - *DescripciÃ³n:* Manejar eventos `checkout.session.completed`.
  - *Criterios de AceptaciÃ³n:* Se crea registro en `Orders` con status *paid* y se reduce stock.
  - *Prioridad:* Alta | *Etiquetas:* backend, payments, db
- **`[Issue 8]` Vista de Historial de Ã“rdenes (Frontend)**
  - *DescripciÃ³n:* Pantalla "Mis Pedidos" para usuarios.
  - *Criterios de AceptaciÃ³n:* Lista de Ã³rdenes pertenecientes al user logged in.
  - *Prioridad:* Media | *Etiquetas:* frontend

### Sprint 3: GarantÃ­a y Admin MVP
- **`[Issue 9]` Integrar AWS S3 para ImÃ¡genes (Backend)**
  - *DescripciÃ³n:* Configurar AWS SDK para subir imÃ¡genes (productos, evidencias).
  - *Criterios de AceptaciÃ³n:* FunciÃ³n que sube foto y devuelve URL (bucket privado o pÃºblico).
  - *Prioridad:* Alta | *Etiquetas:* backend, cloud
- **`[Issue 10]` Formulario de Reporte de GarantÃ­a UI (Frontend/GarantÃ­a)**
  - *DescripciÃ³n:* Interface para que usuarios hagan efectivos reclamos dentro de 90 dÃ­as.
  - *Criterios de AceptaciÃ³n:* Form sube imagen y texto y crea ticket exitoso.
  - *Prioridad:* Media | *Etiquetas:* frontend
- **`[Issue 11]` Endpoints para Tickets de GarantÃ­a (Backend)**
  - *DescripciÃ³n:* API para manejo de reportes.
  - *Criterios de AceptaciÃ³n:* Endpoint POST para usuario, GET/PUT para admins.
  - *Prioridad:* Alta | *Etiquetas:* backend, db
- **`[Issue 12]` Panel Admin Dashboard (Frontend/Admin)**
  - *DescripciÃ³n:* Vista protegida solo para rol admin.
  - *Criterios de AceptaciÃ³n:* Mostrar lista de Ã³rdenes y reportes de garantÃ­a activos para gestionar.
  - *Prioridad:* Media | *Etiquetas:* frontend, auth

## Trabajo en Equipo y ParalelizaciÃ³n
- **Persona A (Frontend):** ConfiguraciÃ³n de Vite, Clerk Auth, UI de CatÃ¡logo, Carrito.
- **Persona B (Backend):** Esquemas DB en MongoDB, Bun Server, Rutas de Productos, Clerk Webhooks (sync DB).
*Dependencias clave:* Frontend puede mockear datos (o usar Swagger) mientras Backend desarrolla. IntegraciÃ³n S3 (Backend) bloquea la Subida de Evidencia (Frontend).

## Riesgos y Mejores PrÃ¡cticas
- **Riesgos:** Consistencia de Stock concurrente (usar transacciones/sesiones en MongoDB).
- **PrÃ¡cticas:** usar validación de esquemas (ej. Mongoose o Zod). Tipado fuerte con Zod/TypeScript. Variables de entorno estrictas.

