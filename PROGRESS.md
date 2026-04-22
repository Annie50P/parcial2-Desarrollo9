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
