This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project structure

Application code lives under `src/`, separated from root-level config files:

```
src/
├── app/                    # App Router routes
│   ├── (auth)/             # Public auth routes: login, registro/*
│   ├── (dashboard)/        # Authenticated routes: /, voluntariados
│   ├── layout.tsx          # Root layout (shared by every route)
│   └── globals.css
├── components/             # UI components, grouped by feature
│   ├── home/ · icons/ · navigation/ · ui/ · voluntariados/
├── lib/
│   ├── actions/            # Server Actions
│   ├── auth/                # Session helpers
│   ├── constants/           # Shared constants (e.g. role ids)
│   ├── data/                 # Data-fetching functions
│   └── validations/          # Zod schemas and form state types
├── types/                   # Domain types, split by area, re-exported from index.ts
└── proxy.ts                 # Route protection, rate limiting and security headers
```

The `(auth)` and `(dashboard)` folders are [route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — they organize routes without affecting the URL path.

> **Note:** Starting with Next.js 16, `middleware.ts` was renamed to `proxy.ts` (same behavior, clearer purpose). This project already uses the new convention.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the home page by modifying `src/app/(dashboard)/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
