# Lumina CRM

Lumina CRM is a React + TypeScript CRM MVP for agencies, with lead management, a visual pipeline board, and analytics dashboards.

## What It Includes

- Dashboard with KPI cards and opportunity highlights
- Leads management with create, update, delete, search, and status filter
- Drag-and-drop pipeline board built with dnd-kit
- Analytics page with industry and pipeline distribution charts
- Zustand store with selectors and persisted UI state
- Supabase integration with realtime updates when configured
- Automatic mock-mode fallback when Supabase credentials are missing

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (+ persist middleware)
- Supabase JS client
- Recharts
- Framer Motion
- dnd-kit
- Lucide React

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:5173
```

4. Build for production:

```bash
npm run build
```

5. Preview production build:

```bash
npm run preview
```

## Supabase Configuration (Optional)

The app runs without Supabase using mock data.

To enable live persistence + realtime, create a `.env` file in project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

When not configured, the UI shows: `Running in Mock Mode (Connect Supabase for persistence)`.

## Project Structure

```text
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components
    │   └── Layout.tsx
    ├── lib
    │   └── supabase.ts
    ├── pages
    │   ├── Dashboard.tsx
    │   ├── Leads.tsx
    │   ├── Pipelines.tsx
    │   └── Analytics.tsx
    ├── store
    │   └── useStore.ts
    └── types
        └── index.ts
```

## Data Model

Core lead fields (`src/types/index.ts`):

- `id`, `name`, `company`, `email`, `phone`
- `value`, `score`, `industry`, `notes`
- `status`: `new | contacted | qualified | proposal | negotiation | won | lost`
- `contactDate`, `createdAt`, `updatedAt`

## Current App Flow

- `App.tsx` initializes leads via `fetchLeads()` and subscribes to Supabase realtime updates when available.
- `Layout.tsx` controls page navigation and global search query updates.
- `Leads.tsx` uses store selectors for filtered leads and modal-based CRUD actions.
- `Pipelines.tsx` provides stage-based drag-and-drop movement between statuses.
- `Analytics.tsx` and `Dashboard.tsx` use computed selectors from the store.

## Notes

- State is persisted using `zustand/persist` with key `lumina-crm-storage`.
- In mock mode, data changes are local/in-memory (plus persisted UI state) and do not sync to Supabase.
