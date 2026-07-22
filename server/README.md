# GEEK HELL - EXPRESS BACKEND REST API ⚡️

> Production-ready Node.js + Express + TypeScript REST API Engine for Geek Hell (3D T-Shirt Customization E-Commerce Platform).

---

## 💻 Tech Stack & Architecture

- **Runtime**: Node.js (`v20+`)
- **Framework**: Express.js with TypeScript (`strict: true`)
- **Database**: MongoDB Atlas via Mongoose ODM
- **Authentication**: JWT Access Tokens & bcrypt password hashing
- **Security**: Helmet, CORS, Express Rate Limiter
- **Middleware**: Morgan HTTP logger, Compression (gzip), Centralized error interceptor
- **Validation**: Zod input validation schemas
- **Testing**: Vitest & Supertest

---

## 🛠 Setup & Installation

### 1. Environment Variables Configuration
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Define environment variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/geek_hell?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_jwt_secret_min_32_characters
CORS_ORIGIN=http://localhost:5173
```

### 2. Install Dependencies & Build
```bash
npm install
npm run build
```

---

## 🚀 Running the Server

```bash
# Start development server with auto-reload (tsx watch)
npm run dev

# Run TypeScript strict type checks
npm run typecheck

# Run Vitest API test suite
npm run test

# Seed initial superhero product database
npx tsx src/scripts/seedDatabase.ts
```

---

## 📡 REST API Endpoint Summary

### 1. System Health
- `GET /api/v1/health` — API Gateway health check.

### 2. User Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new customer or admin account.
- `POST /api/v1/auth/login` — Authenticate credentials & return JWT Access Token.
- `GET /api/v1/auth/me` *(Protected)* — Retrieve authenticated user profile.

### 3. Product Catalog (`/api/v1/products`)
- `GET /api/v1/products` — Retrieve product listing (supports `?category=Marvel|DC` & `?search=`).
- `GET /api/v1/products/:id` — Retrieve product specifications by ID.

### 4. Custom 3D T-Shirt Configurations (`/api/v1/customizations`)
- `POST /api/v1/customizations` *(Protected)* — Save 3D custom T-shirt configuration (color, decal image, 3D transform position, scale, rotation).
- `GET /api/v1/customizations/:id` — Retrieve saved 3D custom T-shirt configuration.
