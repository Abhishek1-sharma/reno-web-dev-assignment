# Reno Notice Board

A Notice Board assignment built with the required stack:

- Next.js Pages Router (`pages/`)
- Prisma Client for all database access
- Hosted MySQL-compatible database support, with TiDB Cloud recommended
- Tailwind CSS

## Features

- Create, read, update, and delete notices end to end
- API routes under `pages/api/` using `GET`, `POST`, `PUT`/`PATCH`, and `DELETE`
- Server-side validation inside the API routes
- Required title/body validation and valid date validation
- Prisma-backed persistence
- Urgent notices ordered first in the Prisma database query
- Visible red `Urgent` badge
- Delete confirmation before removal
- Responsive card layout for phone and desktop
- Optional notice image URL

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

## One thing I would improve with more time

I would add authenticated admin access and image upload storage, so only approved users can manage notices and images do not depend on external URLs.

## AI usage

AI was used to interpret the assignment requirements, generate the initial project structure, implement CRUD flows with Prisma and Next.js Pages Router, and prepare this README. The code was reviewed against the assignment checklist, especially server-side validation, API routes, database persistence, and urgent-first ordering.
