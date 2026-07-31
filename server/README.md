# GearUp ???

"Rent Sports & Outdoor Gear Instantly"

GearUp is a backend API for a sports and outdoor equipment rental service. Customers can browse available gear, place rental orders, and return equipment. Providers manage their gear inventory and fulfill rental orders. Admins oversee the platform, manage users, and moderate listings.

---

## ?? Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Gear (Public)](#gear-public)
  - [Categories (Public)](#categories-public)
  - [Rental Orders](#rental-orders)
  - [Payments](#payments)
  - [Reviews](#reviews)
  - [Provider Management](#provider-management)
  - [Admin](#admin)
- [Database Schema](#database-schema)
- [Roles & Permissions](#roles--permissions)
- [Rental Order Status Flow](#rental-order-status-flow)
- [Error Handling](#error-handling)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express.js v5 |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Prisma Postgres) |
| **ORM** | Prisma v7 |
| **Adapter** | `@prisma/adapter-pg` |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | Zod |
| **Payments** | Stripe, SSLCommerz |
| **Dev Tools** | tsx, nodemon, prisma |

---

## Project Structure

```
server/
+-- prisma/
¦   +-- schema.prisma          # Prisma schema (data models)
¦   +-- seed.ts                # Database seed script
¦   +-- migrations/            # Migration files
¦       +-- 20260731061423_init/
¦           +-- migration.sql
+-- src/
¦   +-- app.ts                 # Express app setup & route registration
¦   +-- server.ts              # Server entry point
¦   +-- config/
¦   ¦   +-- db.ts              # Prisma Client instance with Pg adapter
¦   +-- middlewares/
¦   ¦   +-- auth.ts            # JWT authentication middleware
¦   ¦   +-- role.ts            # Role-based authorization middleware
¦   ¦   +-- errorHandler.ts    # Global error handler
¦   ¦   +-- validate.ts        # Zod validation middleware
¦   +-- modules/
¦   ¦   +-- auth/
¦   ¦   ¦   +-- auth.controller.ts
¦   ¦   ¦   +-- auth.route.ts
¦   ¦   ¦   +-- auth.service.ts
¦   ¦   ¦   +-- auth.validation.ts
¦   ¦   +-- category/
¦   ¦   ¦   +-- category.route.ts
¦   ¦   ¦   +-- category.service.ts
¦   ¦   +-- gear/
¦   ¦   ¦   +-- gear.controller.ts
¦   ¦   ¦   +-- gear.route.ts
¦   ¦   ¦   +-- gear.service.ts
¦   ¦   +-- payment/
¦   ¦   ¦   +-- payment.controller.ts
¦   ¦   ¦   +-- payment.route.ts
¦   ¦   ¦   +-- payment.service.ts
¦   ¦   +-- provider/
¦   ¦   ¦   +-- provider.controller.ts
¦   ¦   ¦   +-- provider.route.ts
¦   ¦   ¦   +-- provider.service.ts
¦   ¦   +-- rental/
¦   ¦   ¦   +-- rental.controller.ts
¦   ¦   ¦   +-- rental.route.ts
¦   ¦   ¦   +-- rental.service.ts
¦   ¦   +-- review/
¦   ¦   ¦   +-- review.controller.ts
¦   ¦   ¦   +-- review.route.ts
¦   ¦   ¦   +-- review.service.ts
¦   ¦   +-- admin/
¦   ¦       +-- admin.controller.ts
¦   ¦       +-- admin.route.ts
¦   ¦       +-- admin.service.ts
¦   +-- utils/
¦       +-- jwt.ts             # JWT token generation & verification
¦       +-- sendResponse.ts    # Consistent API response utility
+-- .env                       # Environment variables (not committed)
+-- .gitignore
+-- package.json
+-- prisma.config.ts           # Prisma CLI configuration
+-- tsconfig.json
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Prisma CLI** (installed via `npm install -D prisma`)

---

## Setup & Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd programming-hero-assignment-4

# 2. Install dependencies
npm install

# 3. Copy environment file and configure
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, Stripe keys, etc.

# 4. Run database migrations
npm run db:migrate

# 5. Generate Prisma Client
npm run db:generate

# 6. Seed the database (optional, for development)
npm run db:seed

# 7. Start the development server
npm run dev
```

The server will start at `http://localhost:5000`.

---

## Environment Variables

| Variable | Description | Example |
|----------|------------|---------|
| `DATABASE_URL` | Prisma Postgres connection string | `postgres://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `STRIPE_SUCCESS_URL` | URL after successful payment | `https://yourdomain.com/success` |
| `STRIPE_CANCEL_URL` | URL after cancelled payment | `https://yourdomain.com/cancel` |

---

## Database

The project uses **Prisma Postgres** (managed PostgreSQL) via the `@prisma/adapter-pg` adapter.

### Migrations

```bash
# Apply pending migrations
npm run db:migrate

# Reset database (development only)
npx prisma migrate reset --force
```

### Seeding

```bash
npm run db:seed
```

The seed script creates:
- 1 admin user (`admin@gearup.com` / `admin123`)
- 1 customer user (`customer@gearup.com` / `cust1234`)
- 1 provider user (`provider@gearup.com` / `prov1234`)
- 5 categories (Tents, Sleeping Bags, Backpacks, Climbing Gear, Cooking Equipment)
- 5 gear items (linked to the provider)

---

## API Endpoints

Base URL: `http://localhost:5000/api`

---

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user (customer/provider/admin) | None |
| `POST` | `/auth/login` | Login user, return JWT token | None |
| `GET` | `/auth/me` | Get current authenticated user | Bearer token |

#### Register Body
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "pass1234",
  "role": "CUSTOMER"
}
```

#### Login Body
```json
{
  "email": "alice@example.com",
  "password": "pass1234"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "abc-123",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "CUSTOMER",
      "status": "ACTIVE"
    }
  }
}
```

---

### Gear (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/gear` | Get all available gear with filters | None |
| `GET` | `/gear/:id` | Get gear details with reviews | None |

#### Query Parameters (GET /gear)
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category name |
| `minPrice` | number | Minimum price per day |
| `maxPrice` | number | Maximum price per day |
| `brand` | string | Filter by brand (case-insensitive) |

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "gear-uuid",
      "name": "4-Person Tent",
      "description": "Waterproof tent...",
      "brand": "Coleman",
      "pricePerDay": 25,
      "stock": 5,
      "isAvailable": true,
      "category": { "id": "...", "name": "Tents" },
      "provider": { "id": "...", "name": "Outdoor Gear Pro" },
      "reviews": [...]
    }
  ]
}
```

---

### Categories (Public)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/categories` | Get all gear categories | None |

---

### Rental Orders

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| `POST` | `/rentals` | Create a new rental order | Bearer | CUSTOMER |
| `GET` | `/rentals` | Get current user's rental orders | Bearer | CUSTOMER |
| `GET` | `/rentals/:id` | Get rental order details | Bearer | CUSTOMER (own orders) |

#### Create Rental Body
```json
{
  "startDate": "2026-08-10",
  "endDate": "2026-08-15",
  "items": [
    { "gearItemId": "gear-uuid", "quantity": 1 }
  ]
}
```

---

### Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/payments/create` | Create a payment intent for a rental order | Bearer |
| `POST` | `/payments/confirm` | Confirm/verify payment (webhook callback) | Bearer |
| `GET` | `/payments` | Get user's payment history | Bearer |
| `GET` | `/payments/:id` | Get payment details | Bearer |

#### Create Payment Body
```json
{
  "rentalOrderId": "rental-uuid",
  "method": "STRIPE"
}
```

#### Confirm Payment Body
```json
{
  "transactionId": "TXN-...",
  "status": "COMPLETED"
}
```

---

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/reviews` | Create a review for a gear item | Bearer |

#### Create Review Body
```json
{
  "gearItemId": "gear-uuid",
  "rating": 5,
  "comment": "Great gear, highly recommend!"
}
```

> **Note:** Users can only review gear they have rented and returned.

---

### Provider Management

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| `POST` | `/provider/gear` | Add gear to inventory | Bearer | PROVIDER |
| `PUT` | `/provider/gear/:id` | Update gear listing | Bearer | PROVIDER |
| `DELETE` | `/provider/gear/:id` | Remove gear from inventory | Bearer | PROVIDER |
| `GET` | `/provider/orders` | Get provider's incoming orders | Bearer | PROVIDER |
| `PATCH` | `/provider/orders/:id` | Update rental order status | Bearer | PROVIDER |

#### Update Order Status Body
```json
{
  "status": "CONFIRMED"
}
```

**Allowed statuses:** `CONFIRMED`, `PICKED_UP`, `RETURNED`

---

### Admin

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| `GET` | `/admin/users` | Get all users | Bearer | ADMIN |
| `PATCH` | `/admin/users/:id` | Update user status (ACTIVE/SUSPENDED) | Bearer | ADMIN |
| `GET` | `/admin/gear` | Get all gear listings | Bearer | ADMIN |
| `GET` | `/admin/rentals` | Get all rental orders | Bearer | ADMIN |

#### Update User Status Body
```json
{
  "status": "SUSPENDED"
}
```

---

## Database Schema

### Users
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `name` | String | User's full name |
| `email` | String (unique) | Email address |
| `password` | String | Hashed password |
| `role` | Enum | `CUSTOMER`, `PROVIDER`, `ADMIN` |
| `status` | Enum | `ACTIVE`, `SUSPENDED` |
| `phone` | String? | Optional phone number |
| `createdAt` | DateTime | Account creation time |
| `updatedAt` | DateTime | Last update time |

### Categories
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `name` | String (unique) | Category name |
| `createdAt` | DateTime | Creation time |

### Gear Items
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `name` | String | Gear item name |
| `description` | String? | Optional description |
| `brand` | String? | Brand name |
| `pricePerDay` | Decimal | Rental price per day |
| `stock` | Int | Available quantity |
| `images` | String[] | Array of image URLs |
| `isAvailable` | Boolean | Availability status |
| `providerId` | String (FK) | Linked provider (User) |
| `categoryId` | String (FK) | Linked category |
| `createdAt` | DateTime | Creation time |
| `updatedAt` | DateTime | Last update time |

### Rental Orders
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `status` | Enum | `PLACED`, `CONFIRMED`, `PAID`, `PICKED_UP`, `RETURNED`, `CANCELLED` |
| `startDate` | DateTime | Rental start date |
| `endDate` | DateTime | Rental end date |
| `totalAmount` | Decimal | Total rental cost |
| `customerId` | String (FK) | Customer who placed the order |
| `createdAt` | DateTime | Creation time |
| `updatedAt` | DateTime | Last update time |

### Rental Order Items (Join Table)
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `quantity` | Int | Quantity of this gear item |
| `pricePerDay` | Decimal | Price snapshot at order time |
| `rentalOrderId` | String (FK) | Linked rental order |
| `gearItemId` | String (FK) | Linked gear item |

### Payments
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `transactionId` | String (unique) | Gateway transaction ID |
| `amount` | Decimal | Payment amount |
| `method` | Enum | `STRIPE`, `SSLCOMMERZ` |
| `status` | Enum | `PENDING`, `COMPLETED`, `FAILED` |
| `paidAt` | DateTime? | Payment completion time |
| `rentalOrderId` | String (FK) | Linked rental order |
| `userId` | String (FK) | User who made the payment |
| `createdAt` | DateTime | Creation time |

### Reviews
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `rating` | Int (1-5) | Review rating |
| `comment` | String? | Optional review text |
| `customerId` | String (FK) | Reviewer |
| `gearItemId` | String (FK) | Reviewed gear item |
| `createdAt` | DateTime | Review time |

---

## Roles & Permissions

| Role | Description | Key Permissions |
|------|------------|-----------------|
| **CUSTOMER** | Rents sports gear | Browse gear, place rental orders, track status, leave reviews, manage profile |
| **PROVIDER** | Gear vendors/rental shops | Manage gear inventory, view orders, update order status |
| **ADMIN** | Platform moderators | Manage all users, oversee all rentals, manage categories |

---

## Rental Order Status Flow

```
PLACED
  +- (provider confirms) ? CONFIRMED
  +- (customer cancels)  ? CANCELLED

CONFIRMED ? PAID (after payment) ? PICKED_UP ? RETURNED
```

---

## Error Handling

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Validation errors return:

```json
{
  "success": false,
  "errors": {
    "fieldNames": ["error message"]
  }
}
```

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start dev server with nodemon + tsx |
| `start` | `npm start` | Start production server with tsx |
| `build` | `npm run build` | Generate Prisma Client + compile TypeScript |
| `db:generate` | `npm run db:generate` | Generate Prisma Client |
| `db:migrate` | `npm run db:migrate` | Apply database migrations |
| `db:seed` | `npm run db:seed` | Seed database with test data |

---

## Deployment

### Render

1. Connect your GitHub repository to Render
2. Set the following environment variables in Render dashboard:
   - `DATABASE_URL` — your Prisma Postgres connection string
   - `JWT_SECRET` — a strong random secret
   - `STRIPE_SECRET_KEY` — your Stripe test/live key
   - `STRIPE_WEBHOOK_SECRET` — your Stripe webhook secret
   - `STRIPE_SUCCESS_URL` — `https://your-app.onrender.com/success`
   - `STRIPE_CANCEL_URL` — `https://your-app.onrender.com/cancel`
3. Set the start command: `npm start`
4. Deploy

### Prisma Postgres

The project uses Prisma Postgres (managed database). To create a new one:

```bash
npx create-db
```

Then update the `DATABASE_URL` in `.env` with the connection string provided.

---

## License

ISC

