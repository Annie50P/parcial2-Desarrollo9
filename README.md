# SafeTech - E-commerce de Tecnología Premium Refurbished

SafeTech es una plataforma de comercio electrónico orientada a la economía circular. Permite a los usuarios explorar, comprar y gestionar garantías de dispositivos tecnológicos reacondicionados (Premium Refurbished) con calidad garantizada.

## 🚀 Tecnologías Principales

**Frontend:**
- React 19 + Vite
- TypeScript
- Clerk (Autenticación)
- Zustand (Manejo de estado global - Carrito)
- TanStack React Query (Gestión de peticiones HTTP y caché)
- React Router Dom

**Backend:**
- Bun (Entorno de ejecución)
- Hono (Framework web ultrarrápido)
- MongoDB & Mongoose (Base de datos y ORM)
- Zod + Hono Validator (Validación de esquemas y datos)

**Infraestructura:**
- Docker & Docker Compose (Para el motor de base de datos local)

---

## 📋 Requisitos Previos

Para ejecutar este proyecto localmente, necesitas tener instalado:
1. **[Docker](https://www.docker.com/products/docker-desktop/)** (Para levantar la base de datos MongoDB).
2. **[Bun](https://bun.sh/)** (Para ejecutar y gestionar dependencias del backend).
3. **[Node.js / npm](https://nodejs.org/)** (Para el frontend, aunque también puede usarse Bun).
4. Una cuenta en **[Clerk](https://clerk.com/)** (Para obtener tus API Keys de autenticación).

---

## ⚙️ Pasos de Instalación y Ejecución

El proyecto está dividido en dos partes principales: `backend` y `frontend`. Debes abrir **dos terminales distintas** para ejecutarlos en paralelo.

### 1. Levantar la Base de Datos y el Backend
Desde la raíz del proyecto, abre una terminal y ejecuta:

```bash
# Entrar a la carpeta del backend
cd backend

# 1. Levantar MongoDB mediante Docker
docker-compose up -d

# 2. Instalar las dependencias de Bun
bun install

# 3. Iniciar el servidor de desarrollo
bun run dev
```
*El backend quedará levantado escuchando peticiones en el puerto `3000` (se conecta automáticamente a mongodb://localhost:27017/safetech).*

### 2. Configurar y Levantar el Frontend
Abre otra terminal (dejando la del backend corriendo), y ejecuta:

```bash
# Entrar a la carpeta del frontend
cd frontend

# 1. Instalar las dependencias
npm install
```

**Configuración de Variables de Entorno (Importante):**
Antes de iniciar el frontend, debes crear un archivo `.env` en la raíz de la carpeta `frontend/` y añadir tu Publishable Key de Clerk:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
```

**Iniciar la UI:**
```bash
# 2. Iniciar el servidor web
npm run dev
```

*Se levantará Vite (usualmente en `http://localhost:5173`). Al navegar allí verás la Landing Page principal y el sistema estará completamente funcional.*

---

## 📖 Documentación del Proyecto
Para conocer los detalles sobre los endpoints, los sprints finalizados y la arquitectura del código, revisa los siguientes archivos incluidos en el repositorio:
- `PLAN.md`: Contiene la arquitectura del sistema, el diseño de la API y el backlog principal.
- `PROGRESS.md`: Es la bitácora histórica de los issues completados y los archivos clave generados por cada feature.
