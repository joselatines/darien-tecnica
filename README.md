# Prueba Técnica Darién

## Mi enfoque y proceso de desarrollo

Cuando recibí los requerimientos para esta prueba técnica, inmediatamente identifiqué que necesitaba construir un sistema CRUD completo para gestión de reservas. Mi pensamiento inicial fue: "¿Qué tecnologías me permitirán mostrar mis habilidades en arquitectura limpia y desarrollo eficiente?"

**Elección de NestJS para el Backend:**
Al analizar los requerimientos de separación de responsabilidades y escalabilidad, NestJS se presentó como la opción obvia. Su arquitectura modular basada en decoradores facilita enormemente la creación de APIs REST bien estructuradas. Además, al ser un CRUD, quería demostrar cómo NestJS acelera el desarrollo sin sacrificar la calidad del código.

**Base de Datos y ORM:**
Elegí Prisma porque ofrece type safety completo y migraciones automáticas, reduciendo errores comunes en el manejo de datos. PostgreSQL por su robustez y características avanzadas.

## 🏗️ Arquitectura Implementada

Desarrollé una arquitectura modular con separación clara de responsabilidades:

- **Backend (NestJS)**: API REST con validación, documentación automática y manejo de errores consistente
- **Frontend (React)**: Interfaz de usuario moderna con gestión de estado eficiente
- **Base de datos**: PostgreSQL con esquema bien definido y relaciones apropiadas
- **Autenticación**: Sistema basado en API keys que permite roles y control de acceso
- **Contenedorización**: Docker Compose para facilitar el desarrollo y despliegue

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS**: Elegí este framework porque su estructura modular me permitió demostrar principios SOLID y separación de responsabilidades
- **Prisma**: ORM moderno que genera tipos TypeScript automáticamente, reduciendo errores en tiempo de desarrollo
- **PostgreSQL**: Base de datos relacional robusta con excelente soporte para transacciones
- **Class Validator**: Para validación automática de DTOs, asegurando integridad de datos
- **Swagger**: Documentación automática de API para facilitar el testing y la integración

### Frontend
- **React**: La versión más reciente para mostrar conocimientos actualizados
- **TypeScript**: Tipado estático para prevenir errores en tiempo de desarrollo
- **Vite**: Herramienta de desarrollo rápida que mejora la experiencia de desarrollo
- **React Query**: Para gestión eficiente del estado del servidor y caching automático
- **Bootstrap 5**: Framework CSS que permite desarrollo rápido de interfaces responsivas
- **React Router**: Navegación declarativa del lado cliente

## 📋 Requisitos Previos

- Docker y Docker Compose
- Node.js 18+ (opcional, para desarrollo local)
- npm o yarn

## 🚀 Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd darien-tecnica
   ```

2. **Configurar variables de entorno**
   ```bash
   cp server/.env.example server/.env
   # El archivo .env.example ya contiene las configuraciones necesarias
   ```

3. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Acceder a la aplicación**
   - Frontend: http://localhost:8085
   - Backend API: http://localhost:3000
   - Backend API DOCS: http://localhost:3000/api
   - Base de datos: localhost:5499

### Opción 2: Desarrollo Local (Revisar el README.md de cada carpeta)

#### Backend
```bash
cd server
yarn install
# Correr para montar una base de datos
docker-compose up -d
# Correr migraciones
npx prisma migrate dev --name init

cp .env.example .env
# Configurar DATABASE_URL en .env si es necesario
npm yarn start:dev
```

#### Frontend
```bash
cd frontend
yarn install
yarn dev
```

## 🧪 Testing

### Backend
```bash
cd server
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Coverage
yarn test:cov
```

## 📚 API Documentation

Una vez ejecutado el servidor, acceder a:
- **Swagger UI**: http://localhost:3000/api
- **API Base URL**: http://localhost:3000/api


### Migraciones
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### Desafíos Técnicos Encontrados

**1. Gestión de Conexiones de Base de Datos en Tests**
Durante el desarrollo de tests e2e, me encontré con errores de "too many database connections". Mi solución fue:
- Implementar mocks en tests unitarios para evitar conexiones reales
- Agregar `prisma.$disconnect()` en el `afterEach` de tests e2e
- Configurar cleanup apropiado de datos de prueba

**2. Validación de Fechas y Horarios**
La validación de reservas presentó complejidades con zonas horarias. Implementé:
- Comparación de fechas en formato ISO para evitar problemas de timezone
- Validación de conflictos de horarios considerando solapamientos
- Límites de reservas por semana por cliente

**3. Integración Frontend-Backend**
Para asegurar una buena UX, implementé:
- Gestión de estado con React Query para caching y sincronización
- Formularios modales con validación en tiempo real
- Notificaciones toast para feedback de usuario
- Componentes reutilizables siguiendo principios DRY

### Soluciones Implementadas

**Arquitectura de Componentes:**
- Creé componentes modulares y reutilizables
- Implementé un sistema de hooks personalizados (como `useRole`)
- Separé la lógica de negocio de la presentación

**Manejo de Estado:**
- React Query para estado del servidor
- Form state management con validación integrada

**Testing Strategy:**
- Tests unitarios con mocks para aislamiento
- Tests e2e con cleanup automático
- Cobertura de código significativa

---

**Desarrollado con ❤️ para la prueba técnica de Darién - Demostrando habilidades full-stack modernas**
