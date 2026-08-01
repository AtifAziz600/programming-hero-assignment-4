# GearUp API Documentation

Base URL: `http://localhost:5000/api`

---

## Authentication

### Register

**POST** `/api/auth/register`

No authentication required.

**Request Body:**
```json
{
  "name": "Alice",
  "email": "alice@test.com",
  "password": "pass1234",
  "role": "CUSTOMER"
}
```

**Roles allowed:** `CUSTOMER`, `PROVIDER`, `ADMIN`

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "phone": null,
    "createdAt": "2026-07-31T12:00:00.000Z",
    "updatedAt": "2026-07-31T12:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

### Login

**POST** `/api/auth/login`

No authentication required.

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "pass1234"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-string",
      "name": "Alice",
      "email": "alice@example.com",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "phone": null,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

**GET** `/api/auth/me`

**Authentication:** Bearer token required

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "phone": null,
    "createdAt": "2026-07-31T12:00:00.000Z",
    "updatedAt": "2026-07-31T12:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

---

## Gear (Public)

### Get All Gear

**GET** `/api/gear`

No authentication required.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category name |
| `minPrice` | number | Minimum price per day |
| `maxPrice` | number | Maximum price per day |
| `brand` | string | Filter by brand (case-insensitive) |

**Example:** `GET /api/gear?category=Tents&minPrice=10&maxPrice=50`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "4-Person Tent",
      "description": "Waterproof 4-person tent with rainfly",
      "brand": "Coleman",
      "pricePerDay": 25,
      "stock": 5,
      "images": ["https://example.com/tent1.jpg"],
      "isAvailable": true,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z",
      "category": {
        "id": "uuid-string",
        "name": "Tents",
        "createdAt": "2026-07-31T12:00:00.000Z"
      },
      "provider": {
        "id": "uuid-string",
        "name": "Outdoor Gear Pro"
      }
    }
  ]
}
```

---

### Get Gear by ID

**GET** `/api/gear/:id`

No authentication required.

**Path Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Gear item UUID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "4-Person Tent",
    "description": "Waterproof 4-person tent with rainfly",
    "brand": "Coleman",
    "pricePerDay": 25,
    "stock": 5,
    "images": ["https://example.com/tent1.jpg"],
    "isAvailable": true,
    "createdAt": "2026-07-31T12:00:00.000Z",
    "updatedAt": "2026-07-31T12:00:00.000Z",
    "category": {
      "id": "uuid-string",
      "name": "Tents",
      "createdAt": "2026-07-31T12:00:00.000Z"
    },
    "provider": {
      "id": "uuid-string",
      "name": "Outdoor Gear Pro"
    },
    "reviews": [
      {
        "id": "uuid-string",
        "rating": 5,
        "comment": "Great tent!",
        "createdAt": "2026-07-31T12:00:00.000Z",
        "customer": {
          "id": "uuid-string",
          "name": "Alice"
        }
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Gear not found"
}
```

---

## Categories (Public)

### Get All Categories

**GET** `/api/categories`

No authentication required.

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "Tents",
      "createdAt": "2026-07-31T12:00:00.000Z"
    },
    {
      "id": "uuid-string",
      "name": "Sleeping Bags",
      "createdAt": "2026-07-31T12:00:00.000Z"
    },
    {
      "id": "uuid-string",
      "name": "Backpacks",
      "createdAt": "2026-07-31T12:00:00.000Z"
    },
    {
      "id": "uuid-string",
      "name": "Climbing Gear",
      "createdAt": "2026-07-31T12:00:00.000Z"
    },
    {
      "id": "uuid-string",
      "name": "Cooking Equipment",
      "createdAt": "2026-07-31T12:00:00.000Z"
    }
  ]
}
```

---

## Rental Orders

### Create Rental Order

**POST** `/api/rentals`

**Authentication:** Bearer token required (CUSTOMER role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "startDate": "2026-08-10",
  "endDate": "2026-08-15",
  "items": [
    { "gearItemId": "uuid-string", "quantity": 1 }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "status": "PLACED",
    "startDate": "2026-08-10T00:00:00.000Z",
    "endDate": "2026-08-15T00:00:00.000Z",
    "totalAmount": 125.00,
    "createdAt": "2026-07-31T12:00:00.000Z",
    "updatedAt": "2026-07-31T12:00:00.000Z",
    "customerId": "uuid-string",
    "items": [
      {
        "id": "uuid-string",
        "quantity": 1,
        "pricePerDay": 25,
        "gearItem": {
          "id": "uuid-string",
          "name": "4-Person Tent",
          "brand": "Coleman",
          "pricePerDay": 25,
          "stock": 4
        }
      }
    ]
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "End date must be after start date"
}
```
```json
{
  "success": false,
  "message": "Gear item uuid-string not found"
}
```
```json
{
  "success": false,
  "message": "Not enough stock for 4-Person Tent"
}
```
```json
{
  "success": false,
  "message": "Forbidden"
}
```

---

### Get User Rentals

**GET** `/api/rentals`

**Authentication:** Bearer token required (CUSTOMER role)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "status": "PLACED",
      "startDate": "2026-08-10T00:00:00.000Z",
      "endDate": "2026-08-15T00:00:00.000Z",
      "totalAmount": 125.00,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z",
      "customerId": "uuid-string",
      "items": [
        {
          "id": "uuid-string",
          "quantity": 1,
          "pricePerDay": 25,
          "gearItem": {
            "id": "uuid-string",
            "name": "4-Person Tent",
            "brand": "Coleman",
            "pricePerDay": 25,
            "stock": 4,
            "isAvailable": true
          }
        }
      ],
      "payments": [
        {
          "id": "uuid-string",
          "transactionId": "TXN-...",
          "amount": 125.00,
          "method": "STRIPE",
          "status": "PENDING",
          "createdAt": "2026-07-31T12:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

### Get Rental by ID

**GET** `/api/rentals/:id`

**Authentication:** Bearer token required

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Rental order UUID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "status": "PLACED",
    "startDate": "2026-08-10T00:00:00.000Z",
    "endDate": "2026-08-15T00:00:00.000Z",
    "totalAmount": 125.00,
    "createdAt": "2026-07-31T12:00:00.000Z",
    "updatedAt": "2026-07-31T12:00:00.000Z",
    "customerId": "uuid-string",
    "items": [...],
    "payments": [...],
    "customer": {
      "id": "uuid-string",
      "name": "Alice",
      "email": "alice@example.com"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Forbidden"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Rental order not found"
}
```

---

## Payments

### Create Payment

**POST** `/api/payments/create`

**Authentication:** Bearer token required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rentalOrderId": "uuid-string",
  "method": "STRIPE"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "uuid-string",
      "transactionId": "TXN-550e8400-e29b-41d4-a716-446655440000",
      "amount": 125.00,
      "method": "STRIPE",
      "status": "PENDING",
      "createdAt": "2026-07-31T12:00:00.000Z",
      "rentalOrderId": "uuid-string",
      "userId": "uuid-string"
    },
    "redirectUrl": "https://sandbox-payment-gateway.example/pay/TXN-550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### Confirm Payment

**POST** `/api/payments/confirm`

**Authentication:** Bearer token required

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "transactionId": "TXN-550e8400-e29b-41d4-a716-446655440000",
  "status": "COMPLETED"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "transactionId": "TXN-550e8400-e29b-41d4-a716-446655440000",
    "amount": 125.00,
    "method": "STRIPE",
    "status": "COMPLETED",
    "paidAt": "2026-07-31T12:05:00.000Z",
    "createdAt": "2026-07-31T12:00:00.000Z",
    "rentalOrderId": "uuid-string",
    "userId": "uuid-string"
  }
}
```

---

### Get User Payments

**GET** `/api/payments`

**Authentication:** Bearer token required

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "transactionId": "TXN-...",
      "amount": 125.00,
      "method": "STRIPE",
      "status": "COMPLETED",
      "paidAt": "2026-07-31T12:05:00.000Z",
      "createdAt": "2026-07-31T12:00:00.000Z",
      "rentalOrder": {
        "id": "uuid-string",
        "status": "PAID",
        "startDate": "2026-08-10T00:00:00.000Z",
        "endDate": "2026-08-15T00:00:00.000Z",
        "totalAmount": 125.00
      }
    }
  ]
}
```

---

### Get Payment by ID

**GET** `/api/payments/:id`

**Authentication:** Bearer token required

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Payment UUID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "transactionId": "TXN-...",
    "amount": 125.00,
    "method": "STRIPE",
    "status": "COMPLETED",
    "paidAt": "2026-07-31T12:05:00.000Z",
    "createdAt": "2026-07-31T12:00:00.000Z",
    "rentalOrder": {
      "id": "uuid-string",
      "status": "PAID",
      "totalAmount": 125.00
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Forbidden"
}
```

---

## Reviews

### Create Review

**POST** `/api/reviews`

**Authentication:** Bearer token required (CUSTOMER role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "gearItemId": "uuid-string",
  "rating": 5,
  "comment": "Great gear, highly recommend!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "rating": 5,
    "comment": "Great gear, highly recommend!",
    "createdAt": "2026-07-31T12:10:00.000Z",
    "customerId": "uuid-string",
    "gearItemId": "uuid-string"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "You can only review gear you've rented and returned"
}
```

---

## Provider Management

### Add Gear to Inventory

**POST** `/api/provider/gear`

**Authentication:** Bearer token required (PROVIDER role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mountain Bike",
  "description": "Top-tier MTB for trail riding",
  "brand": "Trek",
  "pricePerDay": 25,
  "categoryId": "uuid-string",
  "stock": 5,
  "images": ["https://example.com/bike1.jpg"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Mountain Bike",
    "description": "Top-tier MTB for trail riding",
    "brand": "Trek",
    "pricePerDay": 25,
    "stock": 5,
    "images": ["https://example.com/bike1.jpg"],
    "isAvailable": true,
    "providerId": "uuid-string",
    "categoryId": "uuid-string",
    "createdAt": "2026-07-31T12:00:00.000Z",
    "updatedAt": "2026-07-31T12:00:00.000Z"
  }
}
```

---

### Update Gear Listing

**PUT** `/api/provider/gear/:id`

**Authentication:** Bearer token required (PROVIDER role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "pricePerDay": 30,
  "stock": 3,
  "isAvailable": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Mountain Bike",
    "pricePerDay": 30,
    "stock": 3,
    "isAvailable": false,
    "updatedAt": "2026-07-31T12:15:00.000Z"
  }
}
```

---

### Delete Gear Listing

**DELETE** `/api/provider/gear/:id`

**Authentication:** Bearer token required (PROVIDER role)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Gear item deleted"
}
```

---

### Get Provider Orders

**GET** `/api/provider/orders`

**Authentication:** Bearer token required (PROVIDER role)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "status": "PLACED",
      "startDate": "2026-08-10T00:00:00.000Z",
      "endDate": "2026-08-15T00:00:00.000Z",
      "totalAmount": 125.00,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z",
      "items": [
        {
          "id": "uuid-string",
          "quantity": 1,
          "pricePerDay": 25,
          "gearItem": {
            "id": "uuid-string",
            "name": "Mountain Bike",
            "brand": "Trek",
            "pricePerDay": 25,
            "providerId": "uuid-string"
          }
        }
      ],
      "customer": {
        "id": "uuid-string",
        "name": "Alice"
      }
    }
  ]
}
```

---

### Update Rental Order Status

**PATCH** `/api/provider/orders/:id`

**Authentication:** Bearer token required (PROVIDER role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Allowed statuses:** `CONFIRMED`, `PICKED_UP`, `RETURNED`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "status": "CONFIRMED",
    "startDate": "2026-08-10T00:00:00.000Z",
    "endDate": "2026-08-15T00:00:00.000Z",
    "totalAmount": 125.00,
    "updatedAt": "2026-07-31T12:20:00.000Z"
  }
}
```

---

## Admin

### Get All Users

**GET** `/api/admin/users`

**Authentication:** Bearer token required (ADMIN role)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "System Admin",
      "email": "admin@gearup.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "phone": null,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z"
    },
    {
      "id": "uuid-string",
      "name": "Alice Customer",
      "email": "customer@gearup.com",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "phone": null,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z"
    },
    {
      "id": "uuid-string",
      "name": "Outdoor Gear Pro",
      "email": "provider@gearup.com",
      "role": "PROVIDER",
      "status": "ACTIVE",
      "phone": null,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z"
    }
  ]
}
```

---

### Update User Status

**PATCH** `/api/admin/users/:id`

**Authentication:** Bearer token required (ADMIN role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "SUSPENDED"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Alice Customer",
    "email": "customer@gearup.com",
    "role": "CUSTOMER",
    "status": "SUSPENDED",
    "updatedAt": "2026-07-31T12:25:00.000Z"
  }
}
```

---

### Get All Gear Listings (Admin)

**GET** `/api/admin/gear`

**Authentication:** Bearer token required (ADMIN role)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "name": "4-Person Tent",
      "description": "Waterproof 4-person tent with rainfly",
      "brand": "Coleman",
      "pricePerDay": 25,
      "stock": 5,
      "images": ["https://example.com/tent1.jpg"],
      "isAvailable": true,
      "providerId": "uuid-string",
      "categoryId": "uuid-string",
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z",
      "provider": {
        "id": "uuid-string",
        "name": "Outdoor Gear Pro",
        "email": "provider@gearup.com",
        "role": "PROVIDER",
        "status": "ACTIVE"
      },
      "category": {
        "id": "uuid-string",
        "name": "Tents",
        "createdAt": "2026-07-31T12:00:00.000Z"
      }
    }
  ]
}
```

---

### Get All Rental Orders (Admin)

**GET** `/api/admin/rentals`

**Authentication:** Bearer token required (ADMIN role)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "status": "PLACED",
      "startDate": "2026-08-10T00:00:00.000Z",
      "endDate": "2026-08-15T00:00:00.000Z",
      "totalAmount": 125.00,
      "createdAt": "2026-07-31T12:00:00.000Z",
      "updatedAt": "2026-07-31T12:00:00.000Z",
      "customerId": "uuid-string",
      "items": [
        {
          "id": "uuid-string",
          "quantity": 1,
          "pricePerDay": 25,
          "gearItem": {
            "id": "uuid-string",
            "name": "4-Person Tent",
            "brand": "Coleman",
            "pricePerDay": 25,
            "stock": 4
          }
        }
      ],
      "customer": {
        "id": "uuid-string",
        "name": "Alice",
        "email": "alice@example.com",
        "role": "CUSTOMER",
        "status": "ACTIVE"
      }
    }
  ]
}
```

---

## Health Check

**GET** `/`

No authentication required.

**Success Response (200):**
```
GearUp API is running
```

---

## Error Responses

### 400 — Validation Error
```json
{
  "success": false,
  "message": "Email already in use"
}
```

### 401 — Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 — Forbidden
```json
{
  "success": false,
  "message": "Forbidden: insufficient role"
}
```
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### 404 — Not Found
```json
{
  "success": false,
  "message": "Gear not found"
}
```
```json
{
  "success": false,
  "message": "Rental order not found"
}
```
```json
{
  "success": false,
  "message": "Route not found",
  "errorDetails": undefined
}
```

### 500 — Internal Server Error
```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

## Quick Test Sequence (for Video Presentation)

### Step 1: Health Check
```
GET http://localhost:5000/
```
→ `GearUp API is running`

### Step 2: Register Customer
```
POST http://localhost:5000/api/auth/register
Body: {"name":"Alice","email":"alice@test.com","password":"pass1234","role":"CUSTOMER"}
```
→ Returns user object with token

### Step 3: Login
```
POST http://localhost:5000/api/auth/login
Body: {"email":"alice@test.com","password":"pass1234"}
```
→ Returns JWT token

### Step 4: Browse Gear (Public)
```
GET http://localhost:5000/api/gear
```
→ Returns list of gear items

### Step 5: Get Categories (Public)
```
GET http://localhost:5000/api/categories
```
→ Returns 5 categories

### Step 6: Get Current User (Authenticated)
```
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer <token>
```
→ Returns user profile

### Step 7: Create Rental Order (Customer)
```
POST http://localhost:5000/api/rentals
Headers: Authorization: Bearer <token>
Body: {"startDate":"2026-08-10","endDate":"2026-08-15","items":[{"gearItemId":"<gear-id>","quantity":1}]}
```
→ Returns rental order with PLACED status

### Step 8: Create Payment
```
POST http://localhost:5000/api/payments/create
Headers: Authorization: Bearer <token>
Body: {"rentalOrderId":"<rental-id>","method":"STRIPE"}
```
→ Returns payment with redirect URL

### Step 9: Confirm Payment
```
POST http://localhost:5000/api/payments/confirm
Body: {"transactionId":"<txn-id>","status":"COMPLETED"}
```
→ Returns payment with COMPLETED status

### Step 10: Register Provider & Add Gear
```
POST http://localhost:5000/api/auth/register
Body: {"name":"Gear Shop","email":"gear@shop.com","password":"pass1234","role":"PROVIDER"}
```
→ Returns provider user

```
POST http://localhost:5000/api/provider/gear
Headers: Authorization: Bearer <provider-token>
Body: {"name":"Mountain Bike","description":"Top-tier MTB","brand":"Trek","pricePerDay":25,"categoryId":"<cat-id>","stock":5}
```
→ Returns new gear item

### Step 11: Admin — Get All Users
```
GET http://localhost:5000/api/admin/users
Headers: Authorization: Bearer <admin-token>
```
→ Returns all users (admin, customer, provider)

### Step 12: Create Review
```
POST http://localhost:5000/api/reviews
Headers: Authorization: Bearer <token>
Body: {"gearItemId":"<gear-id>","rating":5,"comment":"Great gear!"}
```
→ Returns review object
