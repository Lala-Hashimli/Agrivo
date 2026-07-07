# Agrivo Backend

Node.js + Express + PostgreSQL + Prisma REST API for the Agrivo marketplace.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

API base URL: `http://localhost:5000/api`

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Buyer | `buyer@agrivo.az` | `buyer123` |
| Farmer | `farmer@agrivo.az` | `farmer123` |
| Logistics | `logistics@agrivo.az` | `logistics123` |
| Admin | `admin@agrivo.az` | `admin123` |

## API endpoints

### Public

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List active products |
| GET | `/api/products/:id` | Get product by id |
| GET | `/api/farmers/:farmerId/products` | List farmer products |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |

### Protected

| Method | Route | Roles | Description |
|--------|-------|-------|-------------|
| GET | `/api/auth/me` | any | Current user |
| POST | `/api/products` | farmer, admin | Create product |
| PUT | `/api/products/:id` | farmer, admin | Update product |
| DELETE | `/api/products/:id` | farmer, admin | Delete product |
| GET | `/api/orders` | buyer, farmer, admin | List orders |
| POST | `/api/orders` | buyer, admin | Create order |
| PATCH | `/api/orders/:id/status` | buyer, farmer, admin | Update order status |
| GET | `/api/cart` | buyer, admin | Get cart |
| POST | `/api/cart/items` | buyer, admin | Add cart item |
| GET | `/api/deliveries` | logistics, admin | List deliveries |
| GET | `/api/logistics/overview` | logistics, admin | Logistics overview |
| GET | `/api/farmer/profile` | farmer, admin | Farmer profile |
| GET | `/api/buyer/profile` | buyer, admin | Buyer profile |

Product filters on `GET /api/products`:

- `category`
- `region`
- `district`
- `name`
- `variety`
- `minPrice`
- `maxPrice`

## API testing

### Git Bash (use backslash `\` for line continuation)

Health check:

```bash
curl http://localhost:5000/api/health
```

List products:

```bash
curl http://localhost:5000/api/products
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@agrivo.az","password":"farmer123"}'
```

Get current user:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Filter products:

```bash
curl "http://localhost:5000/api/products?category=Vegetables&district=Quba"
```

### Windows CMD (use caret `^` for line continuation)

Login:

```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"farmer@agrivo.az\",\"password\":\"farmer123\"}"
```

List products:

```cmd
curl http://localhost:5000/api/products
```

**Note:** Git Bash uses `\` at end of line. Windows CMD uses `^`.

## Troubleshooting

### SSL certificate errors

`backend/.npmrc` includes `strict-ssl=false` for npm registry access.

If `prisma generate` fails while downloading binaries:

```bash
set NODE_TLS_REJECT_UNAUTHORIZED=0
npm run prisma:generate
set NODE_TLS_REJECT_UNAUTHORIZED=
```

### Route not found

Make sure the backend was restarted after code changes:

```bash
npm run dev
```

### Login returns invalid credentials

Re-run seed to recreate demo users with bcrypt hashes:

```bash
npm run seed
```

### Empty product list

Seed sample products:

```bash
npm run seed
```

## Project structure

```text
backend/
  prisma/
    schema.prisma
    seed.js
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    utils/
    app.js
    server.js
```
