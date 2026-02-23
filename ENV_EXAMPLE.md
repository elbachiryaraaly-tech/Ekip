# Variables de Entorno

Copia este contenido a un archivo `.env` en la raíz del proyecto (nunca subas `.env` al repositorio).

```env
# Base de datos PostgreSQL (obligatorio)
# Ejemplos: Vercel Postgres, Neon, Supabase, Railway
DATABASE_URL="postgresql://usuario:contraseña@host:5432/nombre_db?sslmode=require"

# NextAuth (obligatorio)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera-uno-con-openssl-rand-base64-32

# Email (Resend) - opcional
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@tudominio.com
EMAIL_FROM_NAME="Boda Celia"

# Opcional: Rate limiting
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000

# Opcional: Cloudflare Turnstile (anti-bot)
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## Explicación

- **DATABASE_URL**: URL de PostgreSQL. En local puedes usar [Neon](https://neon.tech) o [Supabase](https://supabase.com) gratis; en producción la misma o [Vercel Postgres](https://vercel.com/storage/postgres).
- **NEXTAUTH_URL**: En local `http://localhost:3000`; en producción la URL de tu app (ej. `https://tu-app.vercel.app`).
- **NEXTAUTH_SECRET**: Genera uno con `openssl rand -base64 32`.
- **RESEND_***: Solo si usas envío de emails (confirmación RSVP, etc.).

## Primer uso

1. Crea una base PostgreSQL y copia `DATABASE_URL` en `.env`.
2. Ejecuta las migraciones: `npm run build` (incluye `prisma migrate deploy`) o `npx prisma migrate deploy`.
3. Crea el usuario admin y datos iniciales: `npm run db:seed`.
