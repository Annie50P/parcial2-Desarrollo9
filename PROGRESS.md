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
