# SR17018 Research Compound E-Commerce Platform

A full-stack e-commerce application for the SR17018 research compound with admin dashboard, inventory management, and order processing.

## Project Structure

```
sr-project/
├── client/                 # Frontend React application
│   ├── src/               # React components and client-side code
│   │   ├── Admin*.tsx     # Admin panel components
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   └── ...            # Other pages and components
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   └── package.json       # Client dependencies
│
├── server/                # Backend Node.js/Express application
│   └── _core/            # Core server logic
│       ├── index.ts      # Server entry point
│       ├── routers.ts    # tRPC router definitions
│       ├── auth.ts       # Authentication logic
│       ├── schema.ts     # Database schema
│       ├── db.ts         # Database connection
│       └── ...           # Other server modules
│
├── docs/                  # Documentation
│   ├── AUTHENTICATION_SETUP.md
│   ├── Admin Dashboard Testing Report.md
│   └── ...
│
├── package.json           # Root dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables (not in git)
└── railway.json           # Railway deployment config
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- MySQL database
- Environment variables configured

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start development server
pnpm dev

# Run type checking
pnpm check

# Run tests
pnpm test

# Format code
pnpm format
```

### Build & Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

See `docs/Environment Variables for Railway Deployment.md` for complete list.

Key variables:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `NODE_ENV` - development or production
- `PORT` - Server port (default: 3000)

## Admin Panel

Access the admin panel at `/admin/login`

### Features
- Order management and status tracking
- Product inventory management
- Contact form submissions
- CSV export functionality
- User authentication with role-based access control

### Default Admin Account
See `docs/AUTHENTICATION_SETUP.md` for setup instructions.

## Database

The application uses MySQL with Drizzle ORM.

### Schema
- `users` - Admin and user accounts
- `products` - Product catalog
- `orders` - Customer orders
- `contacts` - Contact form submissions

### Migrations

```bash
# Generate and run migrations
pnpm run db:push
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test auth.test.ts
```

## Deployment

### Railway Deployment

1. Create a Railway project
2. Add MySQL service
3. Set environment variables in Railway dashboard
4. Deploy using Railway CLI or GitHub integration

See `docs/SR17018 Website - Railway Deployment Guide.md` for detailed instructions.

## Payment Processing

The application supports:
- **Square** - Primary payment processor
- **Bitcoin** - Cryptocurrency payments

See `docs/Square Payment Integration Test Report.md` for integration details.

## Support

For issues and documentation, see the `docs/` directory.

## License

MIT
