# GEEK HELL ⚡️

> Premium Superhero-Inspired Apparel Platform & Interactive 3D WebGL Customizer.

Geek Hell is an Awwwards-worthy, luxury e-commerce experience allowing users to explore high-end apparel, customize 3D garments in real time, and purchase tailored apparel lines inspired by Marvel and DC universes.

---

## 💻 Developer Setup & Installation Guide

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Git**: Installed and configured

### 1. Clone & Install Dependencies
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/Geek-Hell.git
cd Geek-Hell

# Install root orchestrator packages
npm install

# Install client & server workspace dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Environment Variables Configuration
Copy `.env.example` to `.env` in both client and server directories:

```bash
# Frontend environment setup
cp client/.env.example client/.env

# Backend environment setup
cp server/.env.example server/.env
```

### 3. Available Development Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launch both Client (Vite) and Server (Express) concurrently |
| `npm run dev:client` | Launch Vite Frontend dev server (`http://localhost:5173`) |
| `npm run dev:server` | Launch Express Backend dev server (`http://localhost:5000`) |
| `npm run build` | Compile TypeScript & build bundle outputs for production |
| `npm run typecheck` | Run strict TypeScript checks across Client, Server, and Shared |
| `npm run lint` | Run ESLint static analysis |
| `npm run format` | Prettify entire codebase |
| `npm run test` | Run Vitest unit test suites |

---

## 📁 Repository Structure Overview

```
GeekHell/
├── client/                     # React 19 + Vite Frontend App
├── server/                     # Node.js + Express REST API Server
├── shared/                     # Shared Types, DTOs, Schemas & Constants
├── docs/                       # Architectural Specifications & Technical Guides
├── e2e/                        # Playwright End-to-End Test Suite
├── .vscode/                    # VS Code launch debug configurations & tasks
├── .editorconfig               # Code styling rules
└── package.json                # Root workspace orchestrator
```

---

## 🛠 Project Roadmap & Status

- [x] **Phase 01**: System Architecture & Specification Blueprint
- [x] **Phase 02**: Repository Scaffolding & Directory Structure
- [x] **Phase 03**: Development Environment & Shared Infrastructure
- [ ] **Phase 04**: Database Models & Authentication Engine
- [ ] **Phase 05**: 3D Garment Customizer & Decal Projection Engine
- [ ] **Phase 06**: Customer Storefront & GSAP Animation Experience
- [ ] **Phase 07**: Shopping Cart, Checkout & Stripe Integration
- [ ] **Phase 08**: Executive Admin Dashboard & Analytics
- [ ] **Phase 09**: Production Deployment & Performance Tuning
