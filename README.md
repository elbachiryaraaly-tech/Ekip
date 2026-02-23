# 💍 Web de Boda - Celia y Alejandro

Web de boda premium con sistema completo de RSVP, panel de administración y funcionalidades avanzadas.

## 🎨 Características

- **Landing pública espectacular** con cuenta atrás en tiempo real
- **Sistema RSVP multi-step** con validación completa y confirmación por email
- **Panel de administración** completo con dashboard, estadísticas y gestión de RSVPs
- **Guestbook público** con moderación por admin
- **Diseño premium** con paleta verde eucalipto (#2F5D50) y blanco roto (#F6F1E8)
- **Responsive** y accesible
- **SEO optimizado** con metadatos, sitemap y robots.txt
- **Seguridad** con rate limiting, honeypot anti-spam y validación server-side
- **Cumplimiento RGPD** con política de privacidad

## 🛠️ Stack Tecnológico

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Prisma ORM** + PostgreSQL
- **NextAuth** para autenticación
- **Zod** para validación
- **Resend** para envío de emails
- **Recharts** para gráficos en admin

## 📋 Requisitos Previos

- Node.js 18+ y npm/yarn/pnpm
- Base de datos PostgreSQL (Neon, Supabase, Vercel Postgres, etc.)

## 🚀 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 2. Configurar variables de entorno

Copia el contenido de `ENV_EXAMPLE.md` a un archivo `.env` en la raíz del proyecto, o crea `.env` con al menos:

```env
DATABASE_URL="postgresql://usuario:contraseña@host:5432/nombre_db?sslmode=require"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera-uno-con-openssl-rand-base64-32
```

**Importante**: 
- Genera un `NEXTAUTH_SECRET` seguro: `openssl rand -base64 32`
- Crea una base PostgreSQL en [Neon](https://neon.tech), [Supabase](https://supabase.com) o [Vercel Postgres](https://vercel.com/storage/postgres) y usa su URL en `DATABASE_URL`

### 3. Configurar la base de datos

```bash
# Aplicar migraciones (crea tablas en PostgreSQL)
npx prisma migrate deploy

# Crear usuario admin y datos iniciales
npm run db:seed
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### 5. Acceder al panel de administración

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Email por defecto: `admin@boda.com`
- Contraseña por defecto: `admin123`

**⚠️ IMPORTANTE**: Cambia estas credenciales en producción.

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint

# Formateo de código
npm run format

# Type checking
npm run type-check

# Base de datos
npm run db:push        # Aplicar cambios del schema
npm run db:migrate     # Crear migración
npm run db:studio      # Abrir Prisma Studio
npm run db:seed        # Ejecutar seed
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API routes
│   ├── rsvp/              # Páginas RSVP
│   ├── guestbook/         # Guestbook público
│   ├── privacy/           # Política de privacidad
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── admin/             # Componentes del panel admin
│   └── ui/                # Componentes UI (shadcn/ui)
├── lib/                   # Utilidades y helpers
├── prisma/                # Schema y seed de Prisma
├── types/                 # Tipos TypeScript
└── public/                # Archivos estáticos
```

## 🎯 Funcionalidades Principales

### Landing Pública

- Hero con fecha visible y cuenta atrás
- Secciones: historia, agenda, ubicación, dress code, alojamiento, regalos, galería, FAQ
- Navegación suave y responsive
- Botones para añadir al calendario (Google Calendar + .ics)

### Sistema RSVP

- Formulario multi-step (4 pasos)
- Validación completa con Zod
- Confirmación por email con enlace de edición
- Edición de RSVP mediante token seguro
- Protección anti-spam (honeypot + rate limiting)
- Guardado en base de datos con timestamps

### Panel de Administración

- **Dashboard**: KPIs, estadísticas de menús, alergias, niños
- **Gestión de RSVPs**: Listado, búsqueda, filtros, paginación, vista detalle
- **Export CSV**: Descarga de todos los RSVPs
- **Moderación de Guestbook**: Aprobar/rechazar/eliminar mensajes
- **Ajustes**: Edición de contenidos (nombres, fechas, ubicaciones, etc.)

### Guestbook

- Formulario público para dejar mensajes
- Moderación por admin antes de publicar
- Protección anti-spam

## 🔒 Seguridad

- Autenticación con NextAuth (Credentials)
- Rate limiting en endpoints públicos
- Honeypot anti-spam
- Validación server-side con Zod
- Soft delete para RSVPs y mensajes
- Hash de IPs (respetando privacidad)
- Tokens de edición con expiración

## 📧 Configuración de Emails

El proyecto usa Resend para el envío de emails. Para configurarlo:

1. Crea una cuenta en [resend.com](https://resend.com)
2. Obtén tu API key
3. Configura un dominio verificado (o usa el dominio de prueba)
4. Añade `RESEND_API_KEY` y `EMAIL_FROM` en `.env`

Los emails se envían automáticamente cuando:
- Un usuario completa el RSVP
- Un usuario edita su RSVP

## 🗄️ Base de Datos

### Desarrollo (SQLite)

Por defecto, el proyecto usa SQLite para desarrollo. La base de datos se crea automáticamente en `prisma/dev.db`.

### Producción (PostgreSQL)

Para producción, se recomienda usar PostgreSQL:

1. Crea una base de datos PostgreSQL
2. Actualiza `DATABASE_URL` en `.env`
3. Cambia el provider en `prisma/schema.prisma` a `postgresql`
4. Ejecuta `npm run db:push`

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel detectará Next.js automáticamente
4. El build ejecutará `prisma generate` y `prisma migrate deploy`

### Otros proveedores

Asegúrate de:
- Configurar todas las variables de entorno
- Ejecutar `prisma generate` y `prisma migrate deploy` en el build
- Tener acceso a una base de datos PostgreSQL

## 📝 Suposiciones y Placeholders

El proyecto incluye datos placeholder que puedes editar desde el panel de administración:

- **Nombres de la pareja**: Celia y Alejandro (editable en admin)
- **Ubicaciones**: Direcciones de ejemplo en Madrid (editables)
- **Horarios**: Horarios de ejemplo (editables)
- **Contacto**: Email y teléfono de ejemplo (editables)

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

- Verifica que `DATABASE_URL` esté correctamente configurado
- Ejecuta `npx prisma db push` para crear/actualizar la base de datos

### Emails no se envían

- Verifica que `RESEND_API_KEY` esté configurado
- Comprueba que el dominio esté verificado en Resend
- Revisa los logs del servidor para ver errores

### Error de autenticación

- Verifica que `NEXTAUTH_SECRET` esté configurado
- Asegúrate de que el usuario admin exista (ejecuta `npm run db:seed`)

## 📄 Licencia

Este proyecto es privado y está destinado únicamente para uso en la boda de Celia y Alejandro.

## 👥 Créditos

Desarrollado con ❤️ para Celia y Alejandro

---

**Fecha de la boda**: 10 de octubre de 2026







