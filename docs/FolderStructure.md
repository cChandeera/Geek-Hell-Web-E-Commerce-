# Folder Structure Guide - Geek Hell

```
GeekHell/
├── assets/                     # Shared static media & design mocks
├── docs/                       # Technical & Architectural Documentation
├── client/                     # React 19 Frontend Web Application
│   ├── public/                 # Static GLB models, textures & public assets
│   ├── src/
│   │   ├── animations/         # Animation controllers (GSAP, Lenis, Framer)
│   │   ├── api/                # Axios instance, interceptors & error handlers
│   │   ├── assets/             # Vector icons & imagery
│   │   ├── components/         # Atomic UI primitives & feature modules
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── navigation/
│   │   │   ├── hero/
│   │   │   ├── designer/
│   │   │   ├── product/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── pages/              # Route entry point pages
│   │   │   ├── Home/
│   │   │   ├── Shop/
│   │   │   ├── Product/
│   │   │   ├── Designer/
│   │   │   ├── Wishlist/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   ├── Orders/
│   │   │   ├── Profile/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── About/
│   │   │   └── Contact/
│   │   ├── store/              # Zustand stores (Auth, Cart, Wishlist, Designer, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React Context providers
│   │   ├── services/           # API service modules
│   │   ├── utils/              # Pure utility functions
│   │   ├── constants/          # Design tokens & app constants
│   │   ├── types/              # TypeScript declaration interfaces
│   │   ├── styles/             # Tailwind CSS & design tokens
│   │   └── three/              # Three.js & R3F canvas components
│   │       ├── models/
│   │       ├── materials/
│   │       ├── lights/
│   │       ├── camera/
│   │       ├── textures/
│   │       ├── environment/
│   │       └── shaders/
└── server/                     # Node.js + Express Backend REST API
    ├── src/
    │   ├── config/             # DB, Stripe, Cloudinary, Env configs
    │   ├── controllers/        # Express route request controllers
    │   ├── middleware/         # Auth, RBAC, RateLimit, Error handling
    │   ├── models/             # Mongoose database models
    │   ├── repositories/       # Data access repositories
    │   ├── routes/             # Express API endpoint definitions
    │   ├── services/           # Business logic services
    │   ├── validators/         # Zod validation schemas
    │   ├── utils/              # ApiError, ApiResponse, Logger
    │   ├── uploads/            # Temporary local file uploads
    │   ├── logs/               # Application error & access logs
    │   ├── scripts/            # Database seeders & utility scripts
    │   ├── emails/             # Nodemailer HTML template loaders
    │   ├── jobs/               # Scheduled background tasks
    │   ├── database/           # Connection initializers
    │   ├── tests/              # Unit & Integration test specs
    │   └── server.ts           # Server entry point
```
