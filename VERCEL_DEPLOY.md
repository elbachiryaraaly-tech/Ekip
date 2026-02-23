# Despliegue en Vercel

El proyecto está configurado para **PostgreSQL** y listo para Vercel.

## Variables de entorno en Vercel

En **Project → Settings → Environment Variables** añade:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de PostgreSQL | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `NEXTAUTH_URL` | URL pública de la app | `https://tu-proyecto.vercel.app` |
| `NEXTAUTH_SECRET` | Secreto para sesiones | Generar con `openssl rand -base64 32` |

Opcional: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` si usas emails.

## Base de datos PostgreSQL

Crea una base en:

- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

Copia la URL de conexión en `DATABASE_URL` en Vercel.

## Build

El script de build ya incluye:

- `prisma generate` – genera el cliente Prisma
- `prisma migrate deploy` – aplica migraciones en la base de producción
- `next build` – construye la app

No hace falta cambiar nada en `package.json`.

## Después del primer despliegue

1. Crear usuario admin y datos iniciales (una sola vez):
   ```bash
   DATABASE_URL="postgresql://..." npm run db:seed
   ```
2. Credenciales por defecto: `admin@boda.com` / `admin123`. Cambia la contraseña desde el panel.
3. Comprueba que `NEXTAUTH_URL` sea exactamente la URL de la app (con `https://`, sin barra final).

## Resumen

| Tarea | Estado |
|-------|--------|
| PostgreSQL en Prisma | ✅ |
| Migración inicial | ✅ |
| Params como Promise (Next 15) | ✅ |
| Configurar env en Vercel | Tú |
| Crear DB Postgres y poner DATABASE_URL | Tú |
| Ejecutar seed una vez en prod | Tú |

Cuando tengas `DATABASE_URL`, `NEXTAUTH_URL` y `NEXTAUTH_SECRET` en Vercel, puedes desplegar.
