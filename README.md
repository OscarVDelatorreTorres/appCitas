<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Repositorio de Citas del Dr. Oscar De la Torre

Una aplicación web moderna para visualizar y gestionar citas académicas, conectada directamente con Google Sheets para sincronización en tiempo real. Genera reportes PDF profesionales con información detallada de las citaciones.

View your app in AI Studio: https://ai.studio/apps/drive/1Ix9gw4x100O21NqUu4tZOlCo53roOppL

## 🚀 Características

- ✅ **Conexión directa con Google Sheets** - Los datos se sincronizan automáticamente
- ✅ **Interfaz moderna y responsiva** - Construida con React 19 y Tailwind CSS v4
- ✅ **Generación de reportes PDF** - Descarga reportes profesionales con jsPDF
- ✅ **Filtrado por artículo** - Visualiza citas ordenadas por número de citaciones
- ✅ **Enlaces activos** - Acceso directo a URLs y evidencias de indexación

## 📋 Requisitos

- **Node.js** (versión 18 o superior recomendada)
- **npm** (incluido con Node.js)

## 🛠️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/OscarVDelatorreTorres/appCitas.git
   cd appCitas
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:3000`

4. **Construir para producción:**
   ```bash
   npm run build
   ```
   Los archivos optimizados se generarán en la carpeta `dist/`

5. **Previsualizar build de producción:**
   ```bash
   npm run preview
   ```

## 🌐 Despliegue en Línea

Esta aplicación está lista para desplegarse en cualquier plataforma de hosting estático. Aquí hay algunas opciones populares:

### Vercel (Recomendado)

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Vercel detectará automáticamente la configuración de Vite
4. ¡Despliega con un clic!

### Netlify

1. Crea una cuenta en [Netlify](https://www.netlify.com)
2. Conecta tu repositorio
3. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Despliega

### GitHub Pages

1. En tu repositorio, ve a Settings > Pages
2. Selecciona "GitHub Actions" como source
3. Crea un workflow file (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

### Otros Servicios

La aplicación también funciona con:
- **Cloudflare Pages**
- **AWS Amplify**
- **Firebase Hosting**
- **Render**
- Cualquier servicio que soporte archivos estáticos

## 📊 Configuración de Google Sheets

La aplicación lee datos de una hoja de Google Sheets pública. El ID de la hoja está configurado en `services/sheetService.ts`:

```typescript
const SHEET_ID = '1yg9RiDQb1FD3THr7DV9loI-5i5S4XibybvAz8hu_3tQ';
const SHEET_NAME = 'citas';
```

**Formato esperado de la hoja:**

La hoja debe contener columnas con los siguientes datos (los nombres exactos pueden variar):
- Año
- Título del artículo citado
- URL o DOI del artículo
- Índice del artículo
- Artículo que cita
- Indización máxima de la revista
- Evidencia de indización

## 🏗️ Estructura del Proyecto

```
appCitas/
├── components/          # Componentes React reutilizables
│   ├── ArticleSelector.tsx
│   └── CitationTable.tsx
├── services/           # Servicios de integración
│   ├── sheetService.ts # Conexión con Google Sheets
│   └── pdfService.ts   # Generación de PDFs
├── App.tsx             # Componente principal
├── index.tsx           # Punto de entrada
├── index.css           # Estilos globales y Tailwind
├── types.ts            # Tipos TypeScript
├── index.html          # Template HTML
├── vite.config.ts      # Configuración de Vite
└── tailwind.config.js  # Configuración de Tailwind CSS
```

## 🎨 Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS v4** - Framework de CSS utility-first
- **jsPDF** - Generación de PDFs
- **Lucide React** - Iconos modernos

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza el build de producción

## 🔧 Troubleshooting

### El sitio no carga los datos
- Verifica que la hoja de Google Sheets sea pública
- Comprueba que el SHEET_ID en `services/sheetService.ts` sea correcto
- Revisa la consola del navegador para errores de CORS

### Estilos no se aplican correctamente
- Asegúrate de haber ejecutado `npm install` después de clonar
- Verifica que el build se haya completado sin errores
- Limpia la caché del navegador

## 📄 Licencia

© 2026 Repositorio de Citas del Dr. Oscar De la Torre. Datos sincronizados con Google Drive.
