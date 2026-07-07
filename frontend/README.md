# Agrivo Frontend

Vite + React SPA for the Agrivo agricultural marketplace.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App URL: `http://localhost:5173`

## Environment

```env
VITE_API_URL=http://localhost:5000/api
VITE_DATA_MODE=mock
```

Use `VITE_DATA_MODE=api` when connecting to the backend API.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router 7
- Leaflet maps

See the [root README](../README.md) for full-stack setup and demo accounts.
