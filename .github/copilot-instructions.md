# SafeTech Project Instructions

### Reglas de Planificación e Implementación
Cada vez que el usuario te pida **crear un plan** para un nuevo Issue o desarrollar una nueva feature, OBLIGATORIAMENTE debes:
1. Leer el archivo `PROGRESS.md` para entender el estado actual del proyecto, la estructura de carpetas implementada y los archivos ya creados (para evitar duplicidad).
2. Leer el archivo `PLAN.md` para entender el contexto global y asegurarte de que el issue encaje correctamente en la arquitectura y el sprint correspondiente.

### Reglas de Documentación Post-Implementación
Cada vez que **termines de implementar un Issue** o código funcional, OBLIGATORIAMENTE debes:
1. Abrir y editar el archivo `PROGRESS.md`.
2. Añadir una nueva sección al final del documento siguiendo el esquema histórico, detallando:
   - El nombre, sprint y estado del issue completado.
   - 📂 Los archivos específicos creados o modificados y su propósito.
   - 💡 Contexto importante: librerías instaladas, cambios en `.env` o decisiones arquitectónicas clave.

### Reglas de Git y Pull Requests (El comando "Súbelo" o "Subalo")
Cada vez que el usuario te pida "subir los cambios", "súbelo", "subalo", "haz un PR" o términos similares, OBLIGATORIAMENTE debes proceder usar los comandos en terminal de la siguiente forma automática:
1. Usar el comando `git status` para ver los cambios pendientes.
2. Si estás en la rama `main` o `master`, crea una nueva rama lógica (ej. `git checkout -b feature/issue-N-nombre-feature`). Puedes basar el nombre leyendo la última entrada en `PROGRESS.md`.
3. Prepara los archivos con `git add .`.
4. Crea un commit resumiendo muy claramente los cambios hechos (usa el contexto de `PROGRESS.md` para el cuerpo del commit).
5. Sube la rama con `git push -u origin nombre-de-la-rama`.
6. Crea el Pull Request usando el comando de Github CLI: `gh pr create --title "feature: Nombre claro" --body "## Resumen de Cambios:..."`.
7. Si llegas a notar que el CLI devuelve error por no tener Github configurado, le darás las instrucciones al usuario para que se autentique con `gh auth login`.
