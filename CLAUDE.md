# Project Notes

This project intentionally avoids a separate Express or Node server.

- Auth uses JWT cookies through Next.js route handlers
- Database access is Prisma + Neon Postgres
- The dashboard is optimized for Vercel's serverless deployment model
