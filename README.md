# Dobby Drive

A polished, single-repo Drive workspace built with Next.js App Router, Prisma, Neon Postgres, Vercel Blob, and Tailwind CSS. The structure mirrors the clean root-level setup from your reference and is ready to deploy on Vercel without maintaining a separate backend service.

## What Changed From The Reference

- MongoDB was replaced with **Neon Postgres**
- Mongoose was replaced with **Prisma**
- Separate client/server folders were collapsed into **one Next.js repo**
- Auth is handled through **Next.js route handlers + HTTP-only JWT cookies**
- Image uploads are handled through **Vercel Blob**

## Project Structure

```text
app/
components/
contexts/
lib/
models/
prisma/
public/
```

## Features Included

- Email/password authentication with JWT cookies
- Nested folders with breadcrumb navigation
- Folder creation from the dashboard
- Real image uploads with required name + image fields
- Recursive folder size calculation based on uploaded image sizes
- Dark premium UI tuned for desktop and mobile
- Vercel-friendly architecture with no extra Node server

## Environment Variables

Create a `.env.local` file:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"
```

## Local Setup

```bash
npm install
npm run db:push
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deploying To Vercel

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Add `DATABASE_URL` and `JWT_SECRET` in the Vercel project settings.
4. Run `npx prisma db push` against your Neon database once, or add it to your deployment workflow.

## Notes

- This starter stores **metadata** in Neon. If you want production-grade binary uploads next, the clean add-on is Vercel Blob or UploadThing.
- Neon stores app data and folder structure, while Vercel Blob stores the actual uploaded images.
- Folder deletion is intentionally conservative in this starter and only allows deleting empty folders.
