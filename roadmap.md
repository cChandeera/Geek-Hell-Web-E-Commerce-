# GEEK HELL - PROJECT ROADMAP

This document outlines the development phases, active progress, and upcoming tasks for the Geek Hell Mono-Repository (Express backend + React frontend).

---

## Technical Strategy: Backend vs. Frontend First?

### 1. Architectural Best Practice
In a standard full-stack development lifecycle, **building the backend first is highly recommended**. By establishing database schemas, validation layer, auth rules, and REST endpoints first, we ensure that:
- The frontend has real, stable API contracts to consume.
- We avoid mocks or double-handling data schemas in frontend stores.
- Integrated testing can be run end-to-end early.

### 2. Our Feature-Driven Approach
For the Geek Hell platform, we are combining this with **feature-driven incremental development**. This means we construct the backend database models and endpoints first, and then immediately build the corresponding client pages.

---

## Roadmap Timeline & Current Status

### [Phase 01] Platform Specification (Completed)
- [x] High-level client-server architecture design.
- [x] Mono-repo folder layout (`/client` and `/server`).
- [x] Database entity-relationship mapping (Mongoose).
- [x] Master specification blueprint (implementation_plan.md).

### [Phase 02] Image Upload Module (Completed)
- [x] Cloudinary asset delivery integration.
- [x] Multer memory storage file parsing.
- [x] Admin-only image upload/replace/delete endpoints.
- [x] Image size and MIME-type validation.
- [x] Vitest integration test suites.

### [Phase 03] Inventory & Stock Control (Completed)
- [x] Mongoose `pre('save')` hooks on order creation.
- [x] Insufficient stock checkout prevention.
- [x] Automated stock deduction and cancellation restoration.
- [x] Out-of-stock and low-stock Winston logger alerts.
- [x] Manual stock adjustment PATCH routes.

### [Phase 04] Product Query, Filter & Sort API (Completed)
- [x] Zod query parameters validation.
- [x] Optimized indexing on `Product` schema (`basePrice`, `rating`, `reviewCount`, `createdAt`, `availableColors`, `availableSizes`).
- [x] Dynamic filter mapping (color, size, availability).
- [x] Sorting mapping (`newest`, `price`, `popularity`, `rating`).
- [x] Pagination logic.

### [Phase 05] Client Design System (Completed)
- [x] Dynamic CSS custom properties in `client/src/styles/index.css`.
- [x] Tailwind CSS theme extensions in `client/tailwind.config.js`.
- [x] Classname composition helper in `client/src/utils/cn.ts`.
- [x] Reusable component primitives: `<Button />`, `<Card />`, `<Badge />`, `<Input />`, and `<Loader />`.

### [Phase 06] Homepage UI Layouts (Completed)
- [x] Favicon brand replacement (Tab Bar logo).
- [x] Premium Apple-style scroll-glass Navbar (`Navbar.tsx`).
- [x] Cinematic Hero Section with staggered reveals (`Hero.tsx`).
- [x] Featured Products 4-column responsive grid (`FeaturedProducts.tsx`).
- [x] Marvel vs DC Split Section with hover width expansions (`MarvelDcSplit.tsx`).

### [Phase 07] 3D Model Core Canvas (Completed)
- [x] Three.js React Three Fiber and Drei integration.
- [x] React 19 JSX element typings reference map (`three-types.d.ts`).
- [x] Dynamic bounding-box auto-centering and camera auto-fitting.
- [x] Locked OrbitControls navigation.
- [x] Adaptive shadows (`ContactShadows`) relative to shirt geometry bounds.

---

## NEXT UP: Remaining Stages

### [Phase 08] Interactive 3D Designer Sandbox (In-Progress)
- [ ] 3D Canvas Raycasting selection handles.
- [ ] Decal texture projection on mesh surfaces (Front/Back/Sleeves).
- [ ] Decal transform controls (Position, Rotation, Scale).
- [ ] Dynamic off-screen Canvas compositor to generate 2048x2048 high-res print files.
- [ ] Cloudinary design screenshot saving API.

### [Phase 09] User Security & Session
- [ ] JWT authentication pipeline (Access Token in memory + Refresh Token in HttpOnly cookie).
- [ ] User profile dashboard, order tracker, and design save folders.
- [ ] Route guarding.

### [Phase 10] Cart, Checkout & Payment Gateway
- [ ] Zustand cart persistent storage.
- [ ] Stripe API integration (POST `/create-checkout-session`).
- [ ] Webhook triggers to finalize paid orders in MongoDB.
- [ ] Nodemailer order invoice worker.

### [Phase 11] Admin Dashboard & Order Management
- [ ] Analytics graphs (Revenue, top franchises).
- [ ] CRUD managers for products, coupon triggers, and reviews.
- [ ] Order fulfillment pipeline statuses (Printing -> Shipped -> Delivered).

### [Phase 12] Platform Deployment
- [ ] Vercel client distribution.
- [ ] Render API server hosting.
- [ ] Monorepo GitHub actions CI/CD pipelines.
