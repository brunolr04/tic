# Proyecto TIC

Este repositorio contiene una aplicación web completa, separada en un entorno Backend y un entorno Frontend, diseñada para el monitoreo y gestión de configuraciones de guantes inteligentes.

## Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:

- **Frontend**: Desarrollado con Vite, que provee un entorno de construcción moderno y ultrarrápido para aplicaciones web.
- **Backend**: Desarrollado con Node.js y Express, encargado de manejar la lógica de la aplicación y la conexión con la base de datos PostgreSQL alojada en NEON.

## Requisitos Previos

Para ejecutar este proyecto, es necesario tener instalado en el sistema:

- Node.js (versión 18 o superior recomendada).
- Una cuenta en NEON (neon.tech) para alojar la base de datos PostgreSQL.

## Configuración de la Base de Datos

El backend requiere una conexión a una base de datos PostgreSQL para almacenar la información de usuarios, guantes, configuraciones y mediciones de temblores.

1. Ingrese a su cuenta en la consola de NEON.
2. Seleccione su proyecto y copie la cadena de conexión (Connection String) que aparece en el panel principal.
3. Diríjase a la carpeta `backend` de este proyecto y cree un archivo llamado `.env`.
4. Dentro del archivo `.env`, agregue la siguiente línea, reemplazando el valor con la cadena de conexión que copió:

   ```
   DATABASE_URL="postgres://usuario:contraseña@servidor.neon.tech/neondb?sslmode=require"
   ```

## Instalación

Hemos configurado comandos globales para facilitar la instalación y ejecución de ambas partes del proyecto al mismo tiempo.

Desde la carpeta raíz del proyecto, abra una terminal y ejecute el siguiente comando para instalar todas las dependencias requeridas (tanto del frontend como del backend y la raíz):

```bash
npm run install:all
```

## Ejecución en Entorno Local

Para iniciar tanto el servidor backend como la aplicación frontend simultáneamente en modo de desarrollo, ejecute el siguiente comando desde la carpeta raíz:

```bash
npm run dev
```

Este comando hará uso de la herramienta `concurrently` para levantar:
- El servidor Node.js en el backend, escuchando cambios de forma automática gracias a `nodemon`.
- El servidor de desarrollo de Vite para el frontend.

## Despliegue en Producción

- **Frontend**: Puede ser desplegado fácilmente en plataformas como Vercel o Netlify. El comando `npm run build` dentro de la carpeta `frontend` generará los archivos estáticos necesarios.
- **Backend**: Puede ser alojado en servicios como Render. Asegúrese de configurar la variable de entorno `DATABASE_URL` en el panel de control de la plataforma con la misma cadena de conexión proporcionada por NEON.
