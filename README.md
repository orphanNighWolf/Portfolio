# 🚀 Mercer // Intelligence Portfolio Platform

A high-premium, modular, and feature-rich portfolio management platform structured as a monorepo. It features a full-stack **React + Vite** frontend and an **Express + MongoDB** backend with integrated AI assistant capabilities, an administrative dashboard, and an elegant Apple Keynote-inspired floating navigation system.

---

## 📸 Key Design & UI Features

* **Apple Keynote Navigation Aesthetic**:
  * Centered floating, pill-shaped navbar (`rounded-[20px]`) built with a matte dark gradient (`#17181C` to `#0B0C0F`).
  * Surrounded by a 1px thin border (`rgba(255,255,255,0.08)`) and a soft, large-blur drop shadow (`shadow-[0_20px_40px_rgba(0,0,0,0.45)]`).
  * Features a glossy logo icon (vivid blue gradient with a top light reflection highlight) next to a bold sans-serif wordmark.
  * Nav link items configured with a matte `text-white/60` baseline and smooth hover transition to full white.
  * Pill-shaped off-white CTA button (`SYSTEM`) featuring an embedded vector Apple logo.
* **Energetic Light Theme Canvas**:
  * Base page background configured to `#F8FAFC` and panel surfaces styled in pure white (`#FFFFFF`) with a `1px` border (`#E2E8F0`) and `12-16px` rounded corners.
  * Typography hierarchy uses Inter/Manrope (`400` body / `600` headings) for sans-serif text, and monospace (JetBrains Mono) for labels, tags, nav paths, and indicators.
  * Mapped high-contrast badge systems with 8-10% opacity backgrounds matching their corresponding categories.
  * Smooth translation hover effects (`translateY(-2px)`) on all interactive cards and list triggers.

---

## 📁 Repository Structure

The project is structured as a monorepo workspace for clean separation of concerns between client and server architectures.

```
portfolio-platform/
├── client/                     # Frontend Workspace (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/         # Shared components (floating elements, loaders)
│   │   ├── features/           # Sliced feature modules (about, projects, admin)
│   │   ├── lib/                # Third-party configurations (Axios clients)
│   │   ├── store/              # State stores (Zustand auth logs)
│   │   ├── index.css           # Global Tailwind and light theme variable rules
│   │   └── App.tsx             # App shell holding floating header and layouts
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Backend Workspace (Express + Node + Mongoose)
│   ├── src/
│   │   ├── config/             # DB, Cloudinary, and Resend mail integrations
│   │   ├── middleware/         # Auth verification, Zod parsing, error handlers
│   │   ├── modules/            # Domain APIs (about, contact, assistant)
│   │   └── index.ts            # Entry process runner
│   ├── package.json
│   └── tsconfig.json
│
└── package.json                # Monorepo Workspace Configuration
```

---

## 🛠️ Technology Stack

### Frontend (`client`)
* **Core Framework**: React 19, TypeScript, Vite v6
* **Styling**: Tailwind CSS v4 (Alpha), CSS Custom Properties, Lucide Icons
* **Data Fetching**: TanStack React Query v5, Axios
* **State Management**: Zustand
* **Components**: `@uiw/react-md-editor` (Markdown Editor)
* **Testing**: Vitest, React Testing Library, JSDOM

### Backend (`server`)
* **Core Framework**: Node.js, Express, TypeScript, `tsx`
* **Database & ORM**: MongoDB, Mongoose ORM
* **Security & Auth**: JSON Web Tokens (`jsonwebtoken`), bcryptjs, Helmet, Express Rate Limit
* **Integrations**: 
  * **OpenAI SDK**: Vector chunking and streaming RAG assistant replies.
  * **Cloudinary**: Cloud image uploads and asset organization.
  * **Resend**: Transactional contact mail notifications.
  * **PDFKit**: Server-side dynamic PDF compilation for resume downloads.
  * **Zod**: Robust request body validation.

---

## 🚀 Quick Start

### Prerequisites
* Node.js (v18+)
* MongoDB running locally or a MongoDB Atlas URI
* Cloudinary & OpenAI API keys (optional, for helper/media uploads)

### 1. Install Dependencies
Run from the root directory to install packages for all workspaces:
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env` files in both the `client/` and `server/` directories based on the `.env.example` templates:

**For client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

**For server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
OPENAI_API_KEY=your_openai_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=your_admin_email_here
```

### 3. Run Development Servers
Start the frontend and backend servers concurrently:
```bash
npm run dev
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing & Quality Gates

Run lint checks, type validations, and testing suites across all workspaces:

```bash
# Run Vitest test suites globally
npm run test

# Lint all TypeScript and React files
npm run lint

# Compile and build both client and server code
npm run build
```

---

## 🛡️ License

This project is licensed under the MIT License.
