# Taller1_PPE — Videojuegos

Taller #1 de Plataformas de Programación Empresarial (UPB).
CRUD de videojuegos con NestJS + Prisma + SQLite en el backend, y Vue 3 en el frontend, con autenticación JWT.

## Estructura

- `backend/` — API REST en NestJS (incluye el módulo de autenticación en `backend/src/auth/`)
- `frontend/` — SPA en Vue 3 (Vite + Pinia + Vue Router)

## Requisitos

- Node.js 20 o superior
- npm

## 1. Levantar el backend

Abre una terminal en VS Code (Terminal → New Terminal) y ejecuta:

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

El backend queda en `http://localhost:3000`. Ya trae un `.env` con valores de desarrollo listos para usar (no necesitas crearlo).

### Probar que funciona (opcional)

En otra terminal:

```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}"

curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}"
```

El login debe devolver algo como `{"access_token":"..."}`.

## 2. Levantar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre la URL que te muestre Vite (normalmente `http://localhost:5173`).

## Endpoints de autenticación (módulo C)

| Método | Ruta             | Body                    | Respuesta            |
|--------|------------------|--------------------------|------------------------|
| POST   | `/auth/register` | `{ email, password }`   | `{ id, email }`        |
| POST   | `/auth/login`    | `{ email, password }`   | `{ access_token }`     |

Los endpoints de escritura del CRUD de juegos (crear, editar, eliminar) deben protegerse con `JwtAuthGuard` (ya está creado en `backend/src/auth/jwt-auth.guard.ts`, listo para importar en el módulo de juegos).

## Si algo falla

- **Error de CORS**: ya está habilitado en `backend/src/main.ts` (`app.enableCors()`).
- **Error de Prisma / base de datos**: vuelve a correr `npx prisma migrate dev --name init` dentro de `backend/`.
- **Puerto ocupado**: cambia `PORT` en `backend/.env`.
