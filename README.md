# ESEREVDOC

ESEREVDOC is a full-stack web application organized as an npm workspace monorepo. It contains a Next.js frontend and a TypeScript/Express backend for authentication, problem management, submissions, discussions, notes, topics, and support tickets.

## Project structure

```text
.
├── fe/                  # Next.js frontend
├── be/                  # Express API and Prisma database layer
├── package.json         # Root workspace scripts
└── package-lock.json
```

## Tech stack

### Frontend (`fe`)

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

### Backend (`be`)

- Node.js with TypeScript
- Express 5
- Prisma 7
- PostgreSQL
- JWT authentication
- Argon2/bcrypt/pbkdf2 utilities for password and security operations
- Swagger UI/OpenAPI documentation
- Winston logging with optional Sentry integration
- AWS S3 for file storage and presigned URLs
- Multer for multipart file uploads

## Database

The backend uses a PostgreSQL database, accessed through Prisma. Prisma schemas are in [`be/prisma/schema`](./be/prisma/schema), and database migrations are in [`be/prisma/migrations`](./be/prisma/migrations).

The main entities include users, roles, permissions, topics, problems, examples, notes, submissions, discussions, discussion messages, tickets, and ticket messages.

Set `DATABASE_URL` to a valid PostgreSQL connection string in `be/.env` before starting the backend.

## Prerequisites

- Node.js 20 or newer
- npm
- A running PostgreSQL database
- AWS credentials and an S3 bucket if file storage is required

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create the backend environment file:

```powershell
Copy-Item be/.example.env be/.env
```

Then update `be/.env`, especially:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
PORT=5000
JWT_SECRET="replace-with-a-secure-secret"
ENCRYPTION_SECRET="replace-with-a-secure-secret"
```

Generate the Prisma client and apply the development migrations:

```bash
npm run prisma:generate --workspace be
npm run prisma:migrate:dev --workspace be
```

To load the development seed data, run:

```bash
npm run prisma:seed --workspace be
```

## Run commands

Start the frontend and backend in separate terminals:

```bash
npm run dev:fe
npm run dev:be
```

The frontend is available at `http://localhost:3000`. The backend defaults to `http://localhost:5000` and exposes versioned APIs under `/webservices/v1`.

The Swagger API documentation is available at:

```text
http://localhost:5000/api-docs
```

Run both workspace development servers with one command:

```bash
npm run dev
```

## Production commands

Build both applications:

```bash
npm run build --workspace be
npm run build --workspace fe
```

Apply production database migrations:

```bash
npm run prisma:migrate:deploy --workspace be
```

Start the compiled backend and frontend:

```bash
npm run start --workspace be
npm run start --workspace fe
```

## Useful commands

```bash
# Open Prisma Studio
npm run prisma:studio --workspace be

# Check backend types
npm run typecheck --workspace be

# Lint the frontend
npm run lint --workspace fe

# Check formatting in the backend
npm run format:check --workspace be
```
