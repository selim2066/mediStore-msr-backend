# MediStore — Backend API

REST API for the MediStore OTC medicine e-commerce platform, built with **Node.js + Express + TypeScript**, following a modular architecture pattern.

---

## Tech Stack

**Runtime:** Node.js · TypeScript  
**Framework:** Express.js  
**Database:** PostgreSQL · Prisma ORM  
**Auth:** better-auth (session-based, email/password)  
**File Upload:** Multer · Cloudinary  
**Deployment:** Render

---

## API Endpoints

| Module | Base Route |
|---|---|
| Auth | `/api/auth/*` |
| Medicines | `/api/medicine` |
| Categories | `/api/categories` |
| Orders | `/api/orders` |
| Reviews | `/api/reviews` |
| Users (Admin) | `/api/admin/users` |

All responses follow the structure:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- PostgreSQL database
- npm

### Installation

```bash
git clone https://github.com/your-username/medistore-backend.git
cd medistore-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@host:5432/medistore
PORT=5000
FRONTEND_URL=http://localhost:3000
AUTH_URL=http://localhost:5000/api/auth
AUTH_SECRET=your_auth_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed admin user
npx ts-node src/script/seedAdmin.ts
```

### Development Server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## Project Structure

```
medistore-backend/
├── prisma/
│   ├── schema.prisma                   # Database schema & models
│   └── migrations/                     # Migration history
│       ├── 20260223172619_inital_1_0/
│       ├── 20260224131615_update_schema/
│       ├── 20260224132620_update_schema/
│       ├── 20260225100110_better_auth/
│       └── 20260225103244_user_role_default/
│
└── src/
    ├── app.ts                          # Express app setup, middleware, routes
    ├── server.ts                       # Server entry point
    │
    ├── config/
    │   ├── index.ts                    # Environment variable exports
    │   └── multer.config.ts            # Multer file upload config
    │
    ├── lib/
    │   ├── auth.ts                     # better-auth instance
    │   └── prisma.ts                   # Prisma client instance
    │
    ├── middlewares/
    │   ├── authMiddleware.ts           # Session & role verification
    │   └── errorHandlerHelpers.ts      # Global error handler
    │
    ├── modules/                        # Feature modules (controller · service · route)
    │   ├── categories/
    │   │   ├── categories.controller.ts
    │   │   ├── categories.route.ts
    │   │   └── categories.service.ts
    │   │
    │   ├── medicine/
    │   │   ├── medicine.controller.ts
    │   │   ├── medicine.route.ts
    │   │   └── medicine.service.ts
    │   │
    │   ├── orders/
    │   │   ├── order.controller.ts
    │   │   ├── order.route.ts
    │   │   └── order.service.ts
    │   │
    │   ├── reviews/
    │   │   ├── reviews.controller.ts
    │   │   ├── reviews.routes.ts
    │   │   └── reviews.service.ts
    │   │
    │   └── User/
    │       ├── user.constant.ts
    │       ├── user.controller.ts
    │       ├── user.interface.ts
    │       ├── user.route.ts
    │       ├── user.service.ts
    │       └── user.validation.ts
    │
    ├── helpers/
    │   └── paginationSortingHelper.ts  # Reusable pagination & sorting logic
    │
    ├── errors/                         # Custom error classes
    ├── routes/                         # Root route aggregator
    ├── utils/                          # Shared utility functions
    │
    └── script/
        └── seedAdmin.ts                # Admin seeder script
```

---

## Database Schema

| Model | Key Fields |
|---|---|
| `User` | id, name, email, phone, address, role (CUSTOMER / SELLER / ADMIN), isBanned, emailVerified |
| `Category` | id, name, description |
| `Medicine` | id, name, description, price, stock, manufacturer, image, sellerId, categoryId |
| `Order` | id, customerId, status (PLACED / PROCESSING / SHIPPED / DELIVERED / CANCELLED), shippingAddress, totalAmount |
| `OrderItem` | orderId, medicineId, quantity, price (snapshot) |
| `Review` | id, rating (1–5), comment, customerId, medicineId |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with ts-node |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled production build |
| `npm run lint` | Run ESLint |

---

## Deployment

The backend is deployed on **Render**. Build command used on Render:

```bash
npm install && rm -rf dist && npx prisma generate && npm run build
```

Key production environment notes:
- Cookie config: `sameSite: "none"`, `secure: true`, `partitioned: true`
- `AUTH_URL` must point to the live backend URL: `https://your-backend.onrender.com/api/auth`
- `FRONTEND_URL` must match the Vercel deployment URL for CORS

---

## Related

- [MediStore Frontend Repository](https://github.com/selim2066/MediStore-MSR-Frontend)
- [Backend-live:](https://medistore-msr-backend.onrender.com/)
- [Prisma ORM Docs](https://www.prisma.io/docs)
- [better-auth Docs](https://www.better-auth.com)
- [Express.js Docs](https://expressjs.com)

---

## License

 All rights reserved to Md Selim Reza
