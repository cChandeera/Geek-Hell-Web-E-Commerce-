# System Architecture - Geek Hell

## Overview
Geek Hell is designed as a decoupled, headless e-commerce application powered by React 19 on Vite and a Node.js Express REST API server backed by MongoDB Atlas.

## Core System Layers
1. **Client Rendering Layer**: React 19, Vite, Tailwind CSS, TypeScript.
2. **3D WebGL Engine Layer**: React Three Fiber (R3F), Three.js, `@react-three/drei` for real-time mesh decal mapping and high-res canvas exports.
3. **Animation Engine**: GSAP, ScrollTrigger, Lenis smooth scrolling.
4. **State Management**: Zustand (Client UI & editor state), React Query (Server-cached async state).
5. **Backend REST Gateway**: Node.js, Express.js, JWT HttpOnly authentication, Helmet security, rate limiting.
6. **Data & Storage**: MongoDB Atlas database, Cloudinary CDN asset storage, Stripe Payment Elements integration.
