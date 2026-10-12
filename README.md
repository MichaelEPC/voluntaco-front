This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project structure

Application code lives under `src/`, separated from root-level config files:

```
src/
├── app/                    # App Router routes
│   ├── (auth)/             # Public auth routes: login, registro/*
│   ├── (dashboard)/        # Authenticated routes: /, voluntariados, proyectos/*
│   ├── layout.tsx          # Root layout (shared by every route)
│   └── globals.css
├── components/             # UI components, grouped by feature
│   ├── home/ · icons/ · navigation/ · proyectos/ · ui/ · voluntariados/
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

## Responsive sizing

Auth screens use dynamic viewport height (`dvh`) with their outer padding deducted.
Dashboard panels also deduct the navigation height, with compact spacing and typography.
Content remains scrollable when it exceeds the available space; forms and lists are
never clipped to force a screen fit. Volunteer creation and editing dialogs are
limited to 90% of the dynamic viewport height, including on mobile.

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

## Foundation projects

The foundation navigation includes **Proyectos**. The module provides:

- `/proyectos`: the authenticated foundation's project list.
- `/proyectos/nuevo`: a form to create a project.
- `/proyectos/{id}`: a profile-style view with photo, description, state,
  creation date and project ID.

Set the server-only `API_URL` to the backend base URL. Requests use the session
cookie as a Bearer token; the backend determines the foundation from that token.
The module calls `GET /fundaciones/proyectos`, `POST /fundaciones/proyectos/{id}` (without a body),
and `POST /fundaciones/proyectos/crear`. Creation uses `multipart/form-data`
with `nombre` (1-150 characters), optional `descripcion`, `fecha_creacion`,
and the optional image files `foto` and `foto_cabeza`. No URL fields are submitted;
the backend uploads the files and returns `foto_url` and `foto_cabeza_url`.
The calendar date is required in the UI, cannot be in the future, and is sent as
an ISO datetime at midnight UTC. State is assigned by the backend.

Both image fields support selection, drag-and-drop, preview and removal.
Accepted formats are JPEG, PNG, WebP, GIF and AVIF, up to 2 MiB per file.
Type, size and file signatures are checked before sending the upload.
The Next.js Server Action request limit is 5 MiB to accommodate both images
and multipart overhead. Restart the development server after changing this limit.

The list expects an array and the detail expects a project object or `null`.
Each project contains `id`, `nombre`, `descripcion`, `foto_url`, `foto_cabeza_url`, `estado` and
`fecha_creacion`. The detail shows `foto_url` as the circular profile photo and
`foto_cabeza_url` as the cover. The backend must resolve storage keys to browser-accessible
HTTP(S) URLs, including presigned URLs for private buckets. Images load directly
from those URLs without the Next.js image optimization proxy; signed query parameters
are preserved. Missing or failed images display the project's initials.
Each list card uses the main photo, or the cover when no main photo is provided.
The `id` is a UUID string, used unchanged in detail links and
API requests (for example `/proyectos/550e8400-e29b-41d4-a716-446655440000`).
Invalid UUIDs display the not-found view without querying the API.
A missing detail (`null` or HTTP 404) displays a not-found view.
API failures display a retry screen rather than a misleading empty list.
Volunteers cannot access the module, and creation verifies the role server-side.

Run `npm run test:proyectos` for validation, authenticated API requests,
missing/error responses and the creation action tests. These tests use Node's
built-in runner and the existing TypeScript dependency, without calling the backend.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
