# Instrucciones de Instalación y Ejecución

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd dulces-caseros
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/dulces_caseros
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Configurar Base de Datos PostgreSQL

```bash
# Crear base de datos
createdb dulces_caseros

# Ejecutar migraciones (si usas TypeORM con sincronización automática, esto se hace automáticamente)
npm run start:dev
```

### 4. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env.local
```

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=tu_mercado_pago_public_key
```

## 🏃‍♂️ Ejecución

### Backend
```bash
cd backend
npm run start:dev
```
El backend estará disponible en: http://localhost:3001
Documentación API: http://localhost:3001/api

### Frontend
```bash
cd frontend
npm run dev
```
El frontend estará disponible en: http://localhost:3000

## 📋 Verificación

1. **Backend**: Visita http://localhost:3001/api para ver la documentación de Swagger
2. **Frontend**: Visita http://localhost:3000 para ver la aplicación
3. **Base de datos**: Verifica que las tablas se hayan creado correctamente

## 🛠️ Comandos Útiles

### Backend
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Migraciones
npm run migration:generate
npm run migration:run
npm run migration:revert

# Linting
npm run lint
npm run format
```

### Frontend
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🔧 Configuración Adicional

### Mercado Pago (Opcional)
Para habilitar pagos con Mercado Pago:

1. Crear cuenta en Mercado Pago
2. Obtener credenciales de prueba
3. Agregar al archivo `.env` del backend:
```env
MERCADO_PAGO_ACCESS_TOKEN=tu_access_token
MERCADO_PAGO_PUBLIC_KEY=tu_public_key
```

### Email (Opcional)
Para habilitar envío de emails:

1. Configurar servicio de email (SendGrid, Mailgun, etc.)
2. Agregar variables de entorno correspondientes

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verificar que PostgreSQL esté ejecutándose
- Verificar credenciales en DATABASE_URL
- Verificar que la base de datos exista

### Error de CORS
- Verificar que FRONTEND_URL esté configurado correctamente
- Verificar que el frontend esté ejecutándose en el puerto correcto

### Error de dependencias
```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📁 Estructura del Proyecto

```
dulces-caseros/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Autenticación
│   │   ├── products/       # Gestión de productos
│   │   ├── orders/         # Gestión de pedidos
│   │   ├── users/          # Gestión de usuarios
│   │   └── config/         # Configuraciones
│   ├── package.json
│   └── env.example
├── frontend/               # NextJS Frontend
│   ├── src/
│   │   ├── app/           # Páginas NextJS 13+
│   │   ├── components/    # Componentes React
│   │   ├── stores/        # Stores Zustand
│   │   ├── lib/           # Utilidades y servicios
│   │   └── types/         # Tipos TypeScript
│   ├── package.json
│   └── .env.local
└── README.md
```

## 🌐 Despliegue

### Frontend (Vercel)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Backend (Render/Heroku)
1. Conectar repositorio a Render
2. Configurar variables de entorno
3. Configurar base de datos PostgreSQL

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
