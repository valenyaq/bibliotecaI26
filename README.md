# Biblioteca Virtual

Una aplicación web para gestionar una biblioteca virtual, permitiendo a los usuarios explorar libros, ver detalles y dejar valoraciones.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Backend**: API REST desarrollada con Node.js y Express
- **Frontend**: Aplicación web desarrollada con React y Tailwind CSS

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## Configuración

### Backend

1. Navega a la carpeta del backend:
   ```
   cd backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` basado en `.env.example`:
   ```
   cp .env.example .env
   ```

4. Edita el archivo `.env` con tus credenciales de base de datos y configuración:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=biblioteca_virtual
   JWT_SECRET=tu_clave_secreta
   ```

5. Crea la base de datos y las tablas necesarias:
   - Ejecuta el script SQL proporcionado en `backend/valoraciones.sql` en tu servidor MySQL

6. Inicia el servidor:
   ```
   npm start
   ```

### Frontend

1. Navega a la carpeta del frontend:
   ```
   cd frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia la aplicación:
   ```
   npm start
   ```

4. Abre tu navegador y visita:
   ```
   http://localhost:3000
   ```

## Características

- Exploración de libros por categoría
- Búsqueda de libros por título o autor
- Visualización detallada de libros
- Sistema de valoraciones y comentarios
- Panel de administración para gestionar libros

## Despliegue

### Backend

Para desplegar el backend en un servidor de producción:

1. Configura las variables de entorno en el servidor
2. Instala las dependencias: `npm install --production`
3. Inicia el servidor con PM2 o similar: `pm2 start src/index.js`

### Frontend

Para desplegar el frontend:

1. Crea una versión optimizada: `npm run build`
2. Sube los archivos de la carpeta `build` a tu servidor web
3. Configura el servidor web para servir la aplicación y redirigir las solicitudes de API al backend

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu característica: `git checkout -b feature/nueva-caracteristica`
3. Haz commit de tus cambios: `git commit -m 'Añadir nueva característica'`
4. Sube la rama: `git push origin feature/nueva-caracteristica`
5. Envía un pull request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
