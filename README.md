# Reno Notice Board

A small notice board app built for the Reno web development assignment. It supports creating, viewing, editing, and deleting notices, with urgent notices shown first.

## Tech Stack

- Next.js Pages Router
- Prisma
- MySQL-compatible hosted database, tested with TiDB Cloud
- Tailwind CSS
- Vercel for deployment

## Features

- List all notices as responsive cards
- Add a new notice
- Edit an existing notice with pre-filled values
- Delete a notice after confirmation
- Server-side validation in API routes
- Urgent notices sorted first using Prisma `orderBy`
- Optional image URL for notices

## How To Run Locally

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your hosted database URL in `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/reno_notice_board?sslaccept=strict"
```

Push the Prisma schema to the database:

```bash
npm run prisma:push
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API Routes

- `GET /api/notices`
- `POST /api/notices`
- `GET /api/notices/:id`
- `PUT /api/notices/:id`
- `PATCH /api/notices/:id`
- `DELETE /api/notices/:id`

Create, update, and delete all go through `pages/api`. Validation is handled on the server before saving data.

## One Thing I Would Improve

With more time, I would add authentication for admin users and proper image uploads instead of depending on external image URLs. That would make the notice management flow safer and more reliable in production.

## AI Usage

I used AI as a development assistant while building this assignment. It helped me cross-check the requirements, review edge cases such as server-side validation and urgent-first ordering, and improve the README wording. The implementation choices, database setup, testing, and final review were done by me while keeping the required stack and assignment rules in mind.
