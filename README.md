# Todo App

React + Vite frontend for the Todo API.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` in `.env`:

```env
VITE_API_URL=https://your-todo-api.onrender.com
```

## Production

Set `VITE_API_URL` in Vercel to your deployed Render backend URL, for example:

```env
VITE_API_URL=https://your-todo-api.onrender.com
```

This app uses `BrowserRouter`, so Vercel needs the included `vercel.json` rewrite for direct visits to routes like `/login` or `/tasks`.
