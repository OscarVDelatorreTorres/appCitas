# Repositorio de Citas del Dr. Oscar De la Torre

Esta aplicación visualiza citas académicas desde un archivo de Google Sheets y permite generar reportes en PDF.

## Instalación y Ejecución

Este proyecto utiliza **Vite** y **React**. Para ejecutarlo localmente o en un entorno de desarrollo:

1.  Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre el navegador en la URL que se muestra (usualmente `http://localhost:5173`).

## Despliegue en GitHub Pages

1.  Crea un repositorio en GitHub.
2.  Sube estos archivos.
3.  En GitHub, ve a **Settings > Pages**.
4.  Configura la fuente de despliegue (puedes usar GitHub Actions para construir el proyecto Vite).

## Estructura del Proyecto

-   `src/`: Código fuente de React (App.tsx, componentes, servicios).
-   `index.html`: Punto de entrada HTML.
-   `vite.config.ts`: Configuración del empaquetador.
