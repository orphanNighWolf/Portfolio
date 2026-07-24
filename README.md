# Portfolio Platform Monorepo

This project is a monorepo setup for a portfolio platform, structured into a client-server architecture using **npm workspaces**.

## Folder Structure

```
portfolio/
├── package.json (Monorepo root)
├── README.md
├── .gitignore
├── client/          # Frontend application (React + Vite + TS)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx  # Layout Shell (Navbar, Footer, Route Outlet)
│   │   ├── routes.tsx
│   │   ├── lib/
│   │   └── store/
│   └── .env.example
└── server/          # Backend API server (Express + Node + TS + MongoDB)
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   ├── index.ts # Process runner & server initialization
    │   ├── app.ts   # Express application middleware & module registry
    │   ├── config/  # db connection with retry, resend & cloudinary wrappers
    │   ├── middleware/
    │   └── modules/ # Feature-based modules (health, auth schemas)
    └── .env.example
```

## Running the Applications

1. Install dependencies from the root directory:
   ```bash
   npm install
   ```

2. Start both the client and server development environments simultaneously:
   ```bash
   npm run dev
   ```
   - Frontend runs on: `http://localhost:5173`
   - Backend API runs on: `http://localhost:5000`

3. Build the applications:
   ```bash
   npm run build
   ```

4. Lint the codebase:
   ```bash
   npm run lint
   ```

5. Run test suites:
   ```bash
   npm run test
   ```

## Environment Setup

Ensure you configure the `.env` files in both the `client/` and `server/` directories using their respective `.env.example` templates as guides.
