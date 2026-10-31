# 🍰 Dulces Caseros - E-commerce

Una plataforma de e-commerce completa para la venta de dulces artesanales argentinos.

## 🚀 Características

- **Frontend**: Next.js con React y TypeScript
- **Backend**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL (Neon, plan gratuito)
- **Autenticación**: JWT
- **Panel de Administración**: Gestión completa de productos, usuarios y pedidos
- **Sección "Próximamente"**: Para mostrar productos futuros
- **Sistema de Reseñas**: Calificaciones y comentarios de usuarios
- **Carrito de Compras**: Gestión de productos favoritos
- **Soporte al Cliente**: Sistema de tickets
- **Notificaciones**: Sistema de notificaciones en tiempo real

## 📁 Estructura del Proyecto

```
├── frontend/          # Aplicación Next.js
├── backend/           # API NestJS
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Framer Motion
- React Hot Toast

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Multer (File Upload)
- Cloudinary (Image Storage)

## 🚀 Deploy

### Frontend (Vercel)
- URL: [Tu URL de Vercel]
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### Backend (Render)
- URL: [Tu URL de Render]
- Runtime: Node.js
- Build Command: `npm install && npm run build`
- Start Command: `npm run start:prod`

## 🔧 Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://dulces-caseros-api.vercel.app
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=tu-jwt-secret
CLOUDINARY_URL=tu-cloudinary-url
```

## 📝 Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Iniciar en producción
```

### Backend
```bash
npm run start:dev    # Desarrollo
npm run build        # Build para producción
npm run start:prod   # Iniciar en producción
```

## 📚 Documentación

Guías y notas del proyecto en [`docs/`](docs/):

- [Instalación](docs/INSTALACION.md) · [Resumen del proyecto](docs/RESUMEN_PROYECTO.md) · [Estado actual del sistema](docs/ESTADO_ACTUAL_SISTEMA.md)
- Configuración: [Cloudinary](docs/CLOUDINARY_SETUP.md) · [Google Maps](docs/GOOGLE_MAPS_SETUP.md)
- Pruebas: [Flujo de pedidos](docs/test-order-flow.md)
- Problemas resueltos: [servidor](docs/PROBLEMA_SERVIDOR_SOLUCIONADO.md) · [stock bajo](docs/STOCK_BAJO_SOLUCIONADO.md) · [notificaciones de stock bajo](docs/NOTIFICACIONES_STOCK_BAJO_SOLUCIONADO.md) · [notificaciones duplicadas](docs/NOTIFICACIONES_DUPLICADAS_SOLUCIONADO.md) · [limpieza de emails](docs/LIMPIEZA_EMAIL_COMPLETADA.md) · [verificación de email opcional](docs/VERIFICACION_EMAIL_OPCIONAL.md) · [verificación eliminada](docs/VERIFICACION_ELIMINADA.md) · [perfil y newsletter](docs/PERFIL_SIMPLIFICADO_NEWSLETTER.md)

## 👥 Autores

- **Hernán Parra** - Desarrollo completo

## 📄 Licencia

Este proyecto es privado y está destinado para uso comercial.
