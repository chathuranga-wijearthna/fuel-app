## Fuel App – Frontend

### Project Overview
This is the frontend for a fuel order management application. It provides authentication, order creation, order listing, and status updates for managers/operators. The app is built with React and Vite, compiled to static assets, and served via nginx in Docker. The backend API runs separately and is already containerized.

### Tech Stack / Tools Used
- **React**: for building a fast, modular, and maintainable UI.
- **Vite**: for lightning‑fast dev server and optimized production builds.
- **TypeScript**: for type‑safe, maintainable code.
- **React Router (v7)**: for client‑side routing and protected routes.
- **Tailwind CSS (v4)**: for utility‑first styling and rapid UI development.
- **@tailwindcss/vite**: to integrate Tailwind v4 with Vite.
- **jwt-decode**: to decode and work with JWTs on the client.
- **nginx**: to serve the built static site in production Docker images.
- **Node.js 20 (Alpine)**: minimal base image for building production assets.

### Project Setup Instructions (Docker)
The app ships with a multi‑stage Dockerfile that builds the frontend and serves it with nginx.

1) Clone the repository
```bash
git clone https://github.com/chathuranga-wijearthna/fuel-app.git
cd fuel-app
```

2) Build the Docker image
```bash
docker build -t fuel-app .
```

3) Run the container
```bash
docker run -p 5173:80 --name fuel-app fuel-app
```

4) Open the app
```text
http://localhost:5173
```

### Local Development (Optional)
You can run the app locally with Node.js for faster iteration.

Prerequisites: Node.js 20+, npm 10+

1) Install dependencies
```bash
npm install
```

2) Start the dev server
```bash
npm run dev
```

3) Open the app
```text
http://localhost:5173
```

Useful scripts:
- `npm run build` – type‑check and build for production
- `npm run preview` – preview the production build locally

### Folder Structure (Optional)
```text
fuel-app/
  src/
    components/        # Reusable UI components
    interfaces/        # TypeScript interfaces and types
    pages/             # Route-level pages (Login, Manager/Operator flows)
    routes/            # Route guards and helpers
    utils/             # API client and auth helpers
  Dockerfile           # Multi-stage build (Node build -> nginx serve)
  nginx.conf           # nginx config for SPA routing
  vite.config.ts       # Vite + React + Tailwind configuration
  package.json         # Scripts and dependencies
```

Note: The backend API runs separately and should be reachable from the browser at the configured base URL.

### Author & License
- **Author**: Chathuranga Wijerathna
- **License**: MIT
