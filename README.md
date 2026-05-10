# Premium Full Stack Portfolio

Portfolio personale premium in un unico progetto deployabile su Vercel.

## Stack

- Next.js 16+ App Router, compatibile con il requisito Next.js 15+
- TypeScript
- Tailwind CSS v4
- Framer Motion
- shadcn/ui
- Prisma 7 + PostgreSQL
- Auth admin con cookie HttpOnly e JWT firmato via `jose`
- Server Actions e Route Handlers per backend, CRUD, contatti e chat

## Setup locale

```bash
npm install
copy .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Configura `.env` con un database PostgreSQL reale:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/portfolio?sslmode=require"
ADMIN_EMAIL="admin@portfolio.dev"
ADMIN_PASSWORD="ChangeMe123!"
SESSION_SECRET="replace-with-a-32-byte-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

La seed crea contenuti demo curati e un utente admin usando `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

## Area admin

- URL: `/login`
- Dashboard: `/admin`
- CRUD: progetti, skills, categorie, esperienze, notes, impostazioni generali
- Gestione contatti ricevuti
- Gestione conversazioni chat e risposte admin

## Deploy su Vercel

1. Crea un database PostgreSQL.
2. Aggiungi le env var in Vercel: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`.
3. Deploya il repo su Vercel.
4. Esegui `npm run db:push` e `npm run db:seed` localmente contro lo stesso database, oppure dal tuo flusso CI.

Il progetto resta monolitico: frontend, backend, API, Server Actions, admin e database schema vivono nella stessa applicazione Next.js.
