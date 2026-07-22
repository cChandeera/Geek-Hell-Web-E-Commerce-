# API Specifications - Geek Hell

## Standard Response Contract
All API responses adhere to the unified `ApiResponse` payload structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "errors": null,
  "meta": {
    "timestamp": "2026-07-22T20:45:00Z"
  }
}
```

## Core Endpoint Modules
- `POST /api/v1/auth/register` — Create new user account.
- `POST /api/v1/auth/login` — Login user & issue JWT HttpOnly refresh cookie.
- `GET /api/v1/products` — Query products with filtering & pagination.
- `POST /api/v1/designer/upload-decal` — Upload custom artwork decal map to Cloudinary.
- `POST /api/v1/orders/create-checkout-session` — Initialize Stripe payment session.
