# Registro de Implementación del Proyecto (SafeTech)

Este documento mantiene un registro histórico y técnico de los issues que se van completando. Su propósito es servir como un "mapa rápido" para saber qué archivos existen, qué configuración tienen y dónde agregar nuevo código sin duplicar esfuerzos.

---

## ✅ [Issue 1] Configurar Repositorios y DB (Backend/DB)
**Sprint:** 1 | **Estado:** Completado 

### 📂 Estructura y Archivos Implementados
Se creó la estructura base del backend. Todos los archivos listados están dentro de la carpeta `/backend/`.

*   **Infraestructura & Config:**
    *   `docker-compose.yml`: Levanta MongoDB en el puerto `27017` con un volumen persistente (`mongodata`).
    *   `.env`: Contiene `PORT=3000` y `MONGODB_URI=mongodb://localhost:27017/safetech`.
    *   `package.json` / `tsconfig.json`: Configurados para usar Bun y TypeScript nativo. Dependencias: `hono` y `mongoose`.

*   **Entry Point & Conexión DB:**
    *   `src/index.ts`: Punto de entrada del servidor. Inicializa la conexión a Mongoose y monta las rutas base.
    *   `src/db/connection.ts`: Función `connectDB()` para MongoDB. **Nota:** Está configurada para no romper la app si la BD se cae.

*   **Modelos de Datos (Base):**
    *   `src/models/User.ts`, `src/models/Product.ts`, `src/models/Order.ts`: Esquemas iniciales de Mongoose definidos según el diseño original.

*   **API Routes & Controllers:**
    *   `src/routes/health.routes.ts`: Sub-enrutador para la ruta de salud.
    *   `src/controllers/health.controller.ts`: Controlador que retorna estado del server y de la BD. 
        *   **Endpoint activo:** `GET /api/health`

### 💡 Contexto Importante para Futuros Issues
1.  **Framework HTTP:** Usamos Hono. Al agregar nuevas rutas (ej. `products`), debes crear un archivo en `/routes`, otro en `/controllers` y luego registrar la ruta base en `src/index.ts`.
2.  **Conexión a DB:** Mongoose se conecta automáticamente al arrancar `src/index.ts`. No necesitas volver a llamar connect en otros lados, basta con importar los modelos.

---

## ✅ [Issue 2] Configurar Vite + UI Base e Integrar Clerk (Frontend/Auth)
**Sprint:** 1 | **Estado:** Completado 

### 📂 Estructura y Archivos Implementados
Se inicializó el proyecto frontend con React y Vite, integrando el SDK de Clerk para autenticación y React Router.

*   **Configuración y Auth:**
    *   `frontend/.env.local`: Configurado para recibir la variable `VITE_CLERK_PUBLISHABLE_KEY` provista por Clerk.
    *   `frontend/src/providers/ClerkProviderWrapper.tsx`: Componente que envuelve la app con `<ClerkProvider>`, inyectando las llaves y delegando la navegación local al enrutador (React Router).

*   **Entry Point y Enrutamiento:**
    *   `frontend/src/main.tsx`: Punto de entrada que implementa `BrowserRouter` y asila a toda la app dentro del `ClerkProviderWrapper`.
    *   `frontend/src/App.tsx`: Archivo principal de rutas con `Routes`. Define la navegación genérica: `/` y `/login`.

*   **Componentes Visuales:**
    *   `frontend/src/components/Header.tsx`: Componente de navbar base. Utiliza componentes provistos por Clerk como `<SignedIn>`, `<SignedOut>`, `<UserButton>` para control de sesión automático.
    *   `frontend/src/pages/Home.tsx`: Vista Home.
    *   `frontend/src/pages/Login.tsx`: Renderiza el formulario nativo embebido de Clerk (`<SignIn />`).

### 💡 Contexto Importante para Futuros Issues
1.  **Librerías instaladas:** Se agregaron `@clerk/clerk-react` y `react-router-dom` al paquete `frontend`. Todo componente vinculado a rutas debe importar utilidades de `react-router-dom`.
2.  **Manejo de Sesión (Clerk):** No se debe construir autenticación a mano con JWT. Valida qué botones u opciones existen leyendo el "SignIn state" a través de componentes como `<SignedIn>` provistos por `@clerk/clerk-react`.
3.  **Para Levantar el Frontend:** Recuerda primero configurar una Publishable Key real en tu archivo `.env.local` antes de correr `npm run dev` en frontend.

---

## ✅ [Issue 69] Zod Validaciones y Hono CRUD Mongo (/api/products)
**Sprint:** 1 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[backend/package.json]*: Nuevas dependencias instaladas (`zod`, `@hono/zod-validator`).
- *[backend/src/validators/product.validator.ts]*: Esquemas de validación de Zod para la creación y actualización de productos.
- *[backend/src/controllers/product.controller.ts]*: Controladores para ejecutar operaciones CRUD en la BD a través del modelo Mongoose.
- *[backend/src/routes/product.routes.ts]*: Enrutador de productos implementando middleware de validación `zValidator` de Hono.
- *[backend/src/index.ts]*: Ruta base `/api/products` registrada en el backend.

### 💡 Contexto Importante
- Se instalaron las librerías `zod` y `@hono/zod-validator`.
- Los datos de entrada POST y PUT son procesados por el middleware intermedio que detiene la ejecución y envía status 400 automáticamente si no cumplen las condiciones definidas.

---

## ✅ [Issue 70] Consumo API via TanStack (Products)
**Sprint:** 1 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[frontend/package.json]*: Se instaló `@tanstack/react-query` como dependencia y cliente para manejar requests HTTP y caché.
- *[frontend/src/main.tsx]*: Se importó `QueryClient` y `QueryClientProvider` para habilitar el uso de tanstack en la app.
- *[frontend/src/types/product.ts]*: Interfaz `Product` basada en el modelo de base de datos.
- *[frontend/src/services/products.service.ts]*: Función `fetch` genérica para `/api/products`.
- *[frontend/src/hooks/useProducts.ts]*: Custom hook mapeado con `useQuery` de TanStack.
- *[frontend/src/components/ProductList.tsx]*: Componente de UI que mapea el hook para manejar los estados `isLoading`, `isError` y mostrar la grilla de datos.
- *[frontend/src/pages/Home.tsx]*: Se agregó el componente `<ProductList />` a la vista principal.

### 💡 Contexto Importante
- Para todo nuevo llamado a la API, debes crear su servicio correspondiente dentro de `services/` y un custom hook que implemente `@tanstack/react-query` en `hooks/` antes de utilizarlo en el UI.

---

## ✅ [Issue 71] Arquitectura Estado Carrito (Zustand)
**Sprint:** 2 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[frontend/package.json]*: Instalación de `zustand`.
- *[frontend/src/types/cart.ts]*: Interfaces `CartItem` y `CartState`.
- *[frontend/src/store/cart.store.ts]*: Store global para manejar la lógica del carrito (agregar, remover, actualizar, limpiar).
- *[frontend/src/components/Header.tsx]*: Se integró el store para leer la cantidad de items en el carrito.

### 💡 Contexto Importante
- Se introdujo `zustand` para el manejo de estado global ligero. El store administra únicamente el estado del cliente (UI) del carrito antes de procesar una orden y persiste la sesión en localStorage del navegador.

---

## ✅ [Issue 79] Desarrollo de Landing Page E-commerce
**Sprint:** 1 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[frontend/src/App.tsx]*: Se agregó la nueva ruta `/landing`.
- *[frontend/src/index.css]*: Nuevas clases y estilos para Hero, Beneficios y grid.
- *[frontend/src/components/HeroSection.tsx]*: Componente de Hero con título y call-to-action reutilizando clases globales actuales (tipografías, stagger, botones).
- *[frontend/src/components/BenefitsGrid.tsx]*: Componente que muestra beneficios clave: garantía de 90 días, productos certificados, envíos y soporte.
- *[frontend/src/components/FeaturedProducts.tsx]*: Reutiliza el listado base y `useProducts` de TanStack para mostrar solo 6 productos destacados optimizando la visualización en la landing.
- *[frontend/src/pages/Landing.tsx]*: Vista final que ensambla los componentes del Hero, Beneficios y Destacados.

### 💡 Contexto Importante
- Implementación diseñada para reciclar toda la estética visual actual del proyecto sin afectar el layout en la ruta default (`/` o `Home.tsx`).
- No fue necesario instalar librerías extras ni variables de entorno adicionales.

---

## ✅ [Fix] Enrutamiento de Landing Page y Variable Clerk
**Sprint:** 1 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[frontend/src/App.tsx]*: Se actualizaron las rutas para que la raíz `/` apunte a `Landing` y el catálogo pase a `/home`.
- *[frontend/src/components/HeroSection.tsx]*: Clic explícito para navegar de `/` a `/home`.
- *[frontend/.env]*: Se creó el archivo con la variable vacía indicativa de `VITE_CLERK_PUBLISHABLE_KEY` para iniciar el Auth.

### 💡 Contexto Importante
- El landing ahora es la página por defecto.
- Requiere reemplazar la variable de entorno real en `frontend/.env` para arrancar Vite sin errores del SDK de Clerk.

---

## ✅ [Issue 73] Webhooks de Stripe y Creaciòn de Orden (Backend/DB)
**Sprint:** 2 | **Estado:** Completado

### 📂 Archivos Creados/Modificados
- *[backend/src/controllers/webhook.controller.ts]*: Controlador que recibe y valida el webhook firmado proveniente de Stripe comprobando `stripe-signature`. Implementa la lógica transaccional de Mongoose para cambiar el estatus de la Orden, persistir los Ítems y reducir el Stock de Productos.
- *[backend/src/routes/webhook.routes.ts]*: Enrutador expuesto para ser consumido públicamente, registrando que la ruta debe procesar el payload sin middlewares bloqueantes. 
- *[backend/src/index.ts]*: Ruta base `/api/webhooks` registrada apuuntando a `webhookRoutes`.

### 💡 Contexto Importante
- Para poder testear el script localmente se asume la inclusión de `STRIPE_WEBHOOK_SECRET` generada por la herramienta nativa de `stripe listen`.
- Se requiere que MongoDB soporte Replica Sets para que `mongoose.startSession()` sea apto para Transaction, por lo cual se recomienda validar el setup Docker de MongoDB, de lo contrario la transacción fallbackeará en standalone.

---

## ✅ [Issue 76] Lógica de Garantías y Validación 90 Días (Backend)
**Sprint:** 3 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[backend/src/validators/warranty.validator.ts]*: Creación de esquema Zod para validar `orderId` (ObjectId), `description` (min 10 chars) y `evidenceUrls`.
- *[backend/src/controllers/warranty.controller.ts]*: Refactorización completa de `createWarrantyReport`. Se implementó lógica de "Preventivo de Fraude" (validando que la orden pertenezca al usuario) y la validación técnica de "90 días tras la compra" comparando `Date.now()` con `order.createdAt`.
- *[backend/src/routes/warranty.routes.ts]*: Protección de rutas con `clerkAuthMiddleware` e integración de `zValidator` para la creación de reportes.

### 💡 Contexto Importante
- El endpoint `POST /api/warranties` ahora es estrictamente seguro y cumple con las reglas de negocio de MongoDB requeridas.
- Se utiliza el `userId` inyectado por el middleware de Clerk para todas las validaciones de propiedad.

## ✅ [Issue 77] UI Subida de Imágenes Evidenciales de Garantía
**Sprint:** 3 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[frontend/src/pages/NewWarranty.tsx]*: Nueva página con formulario validado por Zod y React Hook Form para reportar garantías con subida de archivos múltiples.
- *[frontend/src/pages/WarrantySuccess.tsx]*: Vista de confirmación tras envío exitoso del ticket.
- *[frontend/src/pages/Orders.tsx]*: Refactorización visual de la lista de pedidos con lógica de validación de 90 días para el botón de garantía.
- *[frontend/src/App.tsx]*: Registro de las nuevas rutas de garantías protegidas por Clerk.

### 💡 Contexto Importante
- Se implementó un flujo de dos pasos: primero se suben las evidencias al storage y luego se envía el payload al backend.
- Se mantuvo la estética "brutalist premium" con sombras marcadas y colores vibrantes.
- El botón de garantía se inhabilita automáticamente si la orden supera los 90 días de antigüedad.

## ⏳ Template para futuros issues (Copiar y pegar)
<!--
## [Issue X] Nombre del Issue
**Sprint:** X | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[Ruta del archivo]*: Breve descripción de qué hace.

### 💡 Contexto Importante
- Explicar si se instaló alguna librería nueva.
- Explicar si se cambió alguna variable de entorno.
-->

## ? [Issue 71] Implementar Carrito en local (Frontend)
**Sprint:** 2 | **Estado:** Completado 

### ?? Archivos Creados/Modificados
- *[frontend/src/store/cart.store.ts]*: Se actualizaron los m�todos de a�adir y modificar cantidad validando que el user nunca pueda sobrepasar el stock provisto por el backend. Tambi�n se agreg� estado local para manejar si el Drawer est� abierto o no.
- *[frontend/src/components/CartIcon.tsx]*: Se cre� este componente para el navar que mapea el contador y aplica un keyframe bounce cada vez que salta (+1).
- *[frontend/src/components/CartDrawer.tsx]*: Componente principal estilo sidebar/offcanvas. Itera sobre los items procesando el precio Subtotal y renderizando cada control para cambiar stock y remover.
- *[frontend/src/components/Header.tsx]*: A�adido el componente <CartIcon /> y el componente <CartDrawer /> inyectado para que viva de manera global disponible en cualquier vista.
- *[frontend/src/index.css]*: Se a�adieron los estilos responsivos del Drawer, Backdrop y animaciones usando CSS puro para que respete el guideline "brutalist premium".

### ?? Contexto Importante
- Todo reside en LocalStorage gracias al middleware persist() instanciado previamente de Zustand evitando p�rdida temporal de sesi�n (refress no borra los items).
- No hubo necesidad de librer�as extras (framer o gsap).

## ? [Issue 71] Implementaci�n UI Carrito y Mocks
**Sprint:** 2 | **Estado:** Completado 

### ?? Archivos Creados/Modificados
- *[frontend/src/components/CartDrawer.tsx]*: Componente de UI tipo offcanvas renderizado con React Portals para evadir el contexto del header. C�lculos de subtotales en tiempo real y validaci�n visual contra stock m�ximo.
- *[frontend/src/components/CartIcon.tsx]*: Bot�n de navbar animado con un badge de notificaciones din�mico asociado al store de Zustand.
- *[frontend/src/index.css]*: Estilos del drawer, el bot�n del carrito y animaciones (slideInRight, ubbleBounce). Reparaci�n de conflictos de z-index con el header.
- *[frontend/src/data/mockProducts.ts]*: Datos Mocks para pruebas visuales en base a la interfaz \Product\.
- *[frontend/src/services/products.service.ts]*: Servicio actualizado temporalmente para retornar la lista mockeada con retraso de red simulado (500ms).

### ?? Contexto Importante
- Se utiliz� la t�cnica de React Portals para inyectar el Drawer al nivel de \document.body\ garantizando el control absoluto del layout y el fondo oscuro sin heredar z-indexes problem�ticos del \#root\ o NavBar.
- Se mantienen datos mockeados en \products.service.ts\ temporalmente a fines de depuraci�n visual de la interfaz.

## ? [Issue 72] Integrar Stripe Checkout (Backend/Pagos)
**Sprint:** 2 | **Estado:** Completado

### ?? Archivos Creados/Modificados
- **backend/package.json**: Instaladas librer�as stripe y @clerk/backend.
- **backend/.env**: Variables de entorno STRIPE y CLERK a�adidas.
- **backend/src/middlewares/auth.middleware.ts**: Creado middleware para parsear JWT de Clerk y transferir auth.userId de forma segura.
- **backend/src/models/OrderItem.ts**: Creado nuevo formato Mongoose temporal para cruzar Orders con Products de Mongo.

---

## ✅ [Issue 75] Garantías y Evidencias con Cloudflare R2
**Sprint:** 2 | **Estado:** Completado 

### 📂 Archivos Creados/Modificados
- *[backend/src/services/r2.service.ts]*: Cliente de S3 configurado para Cloudflare R2.
- *[backend/src/models/WarrantyReport.ts]*: Modelo Mongoose para reportes de garantía con soporte para múltiples URLs de evidencia.
- *[backend/src/controllers/upload.controller.ts]*: Controlador para procesar y subir archivos binarios a R2.
- *[backend/src/controllers/warranty.controller.ts]*: CRUD para la gestión de tickets de garantía.
- *[backend/src/routes/upload.routes.ts]* / *[backend/src/routes/warranty.routes.ts]*: Nuevos enrutadores para la API.
- *[backend/src/index.ts]*: Registro de rutas `/api/uploads` y `/api/warranties`.
- *[frontend/src/types/warranty.ts]*: Definición de interfaces para el cliente.
- *[frontend/src/services/warranty.service.ts]*: Servicio para subida de archivos y creación de reportes.
- *[frontend/src/components/EvidenceUploader.tsx]*: Componente UI para selección y subida automática de imágenes a R2.

### 💡 Contexto Importante
- Se utilizaron las librerías `@aws-sdk/client-s3` y `@aws-sdk/s3-request-presigner` en el backend.
- Se requiere configuración de 5 variables de entorno `R2_*` en el `backend/.env`.
- Cloudflare R2 fue seleccionado como alternativa a AWS S3 por compatibilidad de API y costos.
- **backend/src/models/User.ts**: Creado clerk_id de enlace string mapping.
- **backend/src/validators/checkout.validator.ts**: Creada validacion Zod {items: []} confirmando ObjectID y amounts validos > 1.
- **backend/src/controllers/checkout.controller.ts**: Endpoint creado. Chequea y rechaza DB stocks vs payloads fake con error 400. Mapea precios propios, crea Orden pending con clerkId, y arranca Checkout create de Stripe.
- **backend/src/routes/checkout.routes.ts**: Creada inyeccion de checkout integrando Zod validator y auth.
- **backend/src/index.ts**: Inyectado en root router /api/checkout.
- **frontend/src/services/checkout.service.ts**: Creado custom fetch client al backend inyectando el token JWT Clerk.
- **frontend/src/components/CartDrawer.tsx**: Reemplazado boton por handleCheckout interactuando as�ncronamente con Clerk y redirigiendo al front checkout session res.

### ?? Contexto Importante
- Validaciones estricas protegen MongoDB frente datos fakes del cliente y previenen stock en negativo con Http 400 Bad Request.
- El checkout crea un User fallback en BD si no se hallaba previo via Clerk.
