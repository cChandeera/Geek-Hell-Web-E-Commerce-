# Database Architecture & Collections - Geek Hell

## Database Technology
- **Database Engine**: MongoDB Atlas Cluster
- **ODM**: Mongoose 8+
- **Indexing Strategy**: Text search on `title`, `slug`, `franchiseTag`; Single & compound indexes on `user`, `status`, and `createdAt`.

## Collections Index
1. **Users**: User credentials, profiles, saved addresses, role (`user` | `admin`).
2. **Products**: Garment titles, pricing, variants, 3D model path `.glb`, decal bounds.
3. **CustomDesigns**: User 3D canvas decal coordinates, color selections, print ready URL.
4. **Orders**: Purchase records, Stripe payment intents, item line objects, shipping state.
5. **Categories**: Franchise & garment classification tags.
6. **Reviews**: Product rating reviews & customer feedback.
