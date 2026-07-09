# Reno Notice Board

A Notice Board assignment built with the required stack:

- Next.js Pages Router (`pages/`)
- Prisma Client for all database access
- Hosted MySQL-compatible database support, with TiDB Cloud recommended
- Tailwind CSS

## Features

- Create, read, update, and delete notices end to end
- API routes under `pages/api/` using `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`
- Server-side validation inside the API routes
- Required title/body validation and valid date validation
- Prisma-backed persistence
- Urgent notices ordered first in the Prisma database query
- Visible red `Urgent` badge
- Delete confirmation before removal
- Responsive card layout for phone and desktop
- Optional notice image URL

## API routes

All create, update, and delete operations go through Pages Router API routes.

- `GET /api/notices` returns all notices ordered by `priority`, then `publishDate`, then `createdAt`
- `POST /api/notices` creates a notice and returns `201`
- `GET /api/notices/:id` returns one notice or `404`
- `PUT /api/notices/:id` updates a notice and returns `200`
- `PATCH /api/notices/:id` updates a notice and returns `200`
- `DELETE /api/notices/:id` deletes a notice and returns `204`
- Unsupported methods return `405` with an `Allow` header
- Invalid input returns `400` with field-level errors

## Assignment checklist

- Uses Next.js Pages Router only; there is no `app/` directory
- Uses Prisma schema and Prisma Client for database reads and writes
- Uses a hosted database through `DATABASE_URL`, not local SQLite
- Uses Tailwind CSS for clean responsive styling
- Stores `title`, `body`, `category`, `priority`, `publishDate`, and optional `imageUrl`
- Shows Edit and Delete actions on every notice card
- Asks for confirmation before delete
- Loads current notice values when editing
- Keeps urgent-first ordering in the Prisma `orderBy` query, not browser sorting
- Shows a visible red `Urgent` badge

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from the example:

   ```bash
   cp .env.example .env
   ```

3. Add a free hosted database URL to `.env`.

   TiDB Cloud free tier is recommended. Use the MySQL-compatible connection string as `DATABASE_URL`.

4. Push the Prisma schema:

   ```bash
   npm run prisma:push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000`.

## Deploy on Vercel

1. Push this project to a public GitHub repository with real commit history.
2. Import the repository in Vercel using the free Hobby tier.
3. Add `DATABASE_URL` in Vercel project environment variables.
4. Deploy.
5. Confirm the live Vercel URL opens publicly without login.

## Before submitting

- The GitHub repository is public.
- The repository has multiple meaningful commits, not only one initial commit.
- The Vercel deployment is public and opens without login.
- The database is on a free hosted tier such as TiDB Cloud, Neon, or Supabase.
- No paid service or credit-card-only service is required.
- Both links are submitted through the email form: the live Vercel URL and the public GitHub repository URL.

## One thing I would improve with more time

I would add authenticated admin access and image upload storage, so only approved users can manage notices and images do not depend on external URLs.

## AI usage

AI was used to interpret the assignment requirements, generate the initial project structure, implement CRUD flows with Prisma and Next.js Pages Router, and prepare this README. The code was reviewed against the assignment checklist, especially server-side validation, API routes, database persistence, and urgent-first ordering.
