# React + Vite example

The setup from the article "API-First development": MSW handlers for `/api/distributions`,
toggled with `VITE_MSW_ENABLED`, controlled from the msw-cockpit panel.

```bash
npm install
npx msw init public --save   # generates public/mockServiceWorker.js
npm run dev
```

Open the app and click the 🎭 button:

- switch `GET /api/distributions` off to send the request to the real network (here: it fails, as there is no back end),
- open `/?scenario=empty` or `/?scenario=error` to see the other states.

The example depends on the local build (`file:../..`), so run `npm install && npm run build` in the repo root first.
