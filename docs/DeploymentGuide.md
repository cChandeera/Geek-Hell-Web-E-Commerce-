# Deployment & CI/CD Guide - Geek Hell

## Deployment Targets
- **Frontend App**: Vercel Edge Platform
- **Backend API**: Render Web Container Platform
- **Database**: MongoDB Atlas Managed Cluster
- **Media CDN**: Cloudinary CDN

## CI/CD Pipeline Workflow
1. Code pushed to `main` branch on GitHub.
2. GitHub Actions runs ESLint, TypeScript type checks, and build validation.
3. Automated deploy triggers send frontend code to Vercel and API updates to Render.
