# Frontend - Gestión de Reservas

Interfaz de usuario moderna para el sistema de gestión de reservas de espacios, construida con React 19, TypeScript y Bootstrap 5.

## 🚀 Tecnologías Utilizadas

- **React 19**: La versión más reciente con las últimas características
- **TypeScript**: Tipado estático para mayor robustez
- **Vite**: Build tool ultrarrápido para desarrollo moderno
- **React Query**: Gestión eficiente del estado del servidor
- **Bootstrap 5**: Framework CSS responsivo y moderno
- **React Router**: Navegación declarativa del lado cliente
- **React Hot Toast**: Notificaciones elegantes
- **Axios**: Cliente HTTP para comunicación con la API

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Backend corriendo en http://localhost:3000 (ver README del servidor)

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

El archivo `.env` debe contener:
```env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your-api-key-here
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Construir para producción
npm run build

# Vista previa de la build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 🔧 Configuración 

### Variables de Entorno
- `VITE_API_URL`: URL base de la API del backend
- `VITE_API_KEY`: Clave de API para autenticación (desarrollo)

### Build de Producción
```bash
npm run build
```