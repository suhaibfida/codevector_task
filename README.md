# codevector_task
<img width="1358" height="676" alt="image" src="https://github.com/user-attachments/assets/ee445a88-1bbb-4eb6-aeb1-11579907c89c" />
<img width="1359" height="645" alt="image" src="https://github.com/user-attachments/assets/cfb5c87c-a3f1-4c44-86b5-f3c9457ea8f1" />
<img width="1288" height="647" alt="image" src="https://github.com/user-attachments/assets/3b7861ff-4354-4342-9179-8f2703bf8246" />




A full-stack product catalog web application demonstrating cursor-based pagination, built with TypeScript across the entire stack.

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| **Runtime** | [Bun](https://bun.sh) v1.3.13                   |
| **Backend** | Express 5, Prisma 7, PostgreSQL (Neon)          |
| **Frontend**| React 19, React Router 7, Vite 8                |
| **Language**| TypeScript (strict mode)                        |

## Project Structure

```
├── api/            # Backend Express API server
│   ├── src/
│   │   ├── main.ts       # Server entry point (port 3000)
│   │   └── seed.ts       # Database seeder (200k products)
│   └── db/
│       ├── prisma/
│       │   ├── schema.prisma    # Product model definition
│       │   └── migrations/      # Database migrations
│       └── src/index.ts         # Prisma client singleton
├── client/         # Frontend React SPA
│   └── src/
│       ├── App.tsx            # Root component with router
│       ├── pages/
│       │   ├── Home.tsx       # Welcome page
│       │   └── Products.tsx   # Product catalog with pagination
│       ├── App.css            # Application styles
│       └── index.css          # Global CSS with theme support
├── index.ts        # Root placeholder entry
├── package.json    # Root workspace config
└── tsconfig.json   # Root TypeScript config
```

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Set up environment variables

The database connects to a Neon PostgreSQL instance. Configure the `DATABASE_URL` in:

- `api/.env`
- `api/db/.env`

### 3. Apply database migrations

```bash
cd api/db
bunx prisma migrate deploy
```

### 4. Seed the database (optional)

Inserts 200,000 sample products across 5 categories:

```bash
cd api
bun run src/seed.ts
```

### 5. Start the backend

```bash
cd api
bun run dev
```

The API runs on `http://localhost:3000`.

### 6. Start the frontend (separate terminal)

```bash
cd client
bun run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## API Endpoints

### `GET /`
Health check.

**Response:** `{ "message": "API is running" }`

### `GET /products`
Returns a paginated list of products using cursor-based pagination.

**Query Parameters:**

| Param    | Type   | Description                                  |
|----------|--------|----------------------------------------------|
| `cursor` | number | The `id` to start from (optional)            |
| `category` | string | Filter by category (optional)              |

**Response:**
```json
{
  "products": [
    { "id": 101, "name": "...", "category": "Electronics", "price": 29.99 }
  ],
  "nextCursor": 81
}
```

Returns up to 20 products per page, ordered by `id` descending. When `nextCursor` is `null`, there are no more pages.

**Categories:** Electronics, Books, Clothing, Sports, Furniture

## Database Model

```
Product
├── id          Int (PK, autoincrement)
├── name        String
├── category    String
├── price       Float
├── createdAt   DateTime
└── updatedAt   DateTime
```

Composite indexes:
- `[updatedAt, id]` (for general cursor pagination)
- `[category, updatedAt, id]` (for filtered cursor pagination)

## Frontend Features

- **Category filtering** — Filter products by category (URL-synced via `?category=X`)
- **Cursor-based pagination** — "Load More" button fetches the next page
- **Responsive grid layout** — Product cards adapt to screen size
- **Dark/light theme** — CSS custom properties for automatic theme support

## Available Scripts

### Backend (`api/`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with hot-reload on port 3000 |
| `bun run src/seed.ts` | Seed database with 200k products |

### Frontend (`client/`)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server with HMR on port 5173 |
| `bun run build` | Type-check and production build |
| `bun run lint` | Run ESLint |
| `bun run preview` | Preview production build |
