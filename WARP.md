# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Basic Development
```bash
# Start development server with file watching
npm run dev

# Start development with Docker (uses Neon Local for database)
npm run dev:docker

# Start production with Docker (connects to Neon Cloud)
npm run prod:docker
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Database Operations
```bash
# Generate new migration files from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Docker Development
```bash
# View development container logs
docker logs acquisitions-app-dev

# View production container logs
docker logs acquisitions-app-prod

# Execute commands inside running containers
docker exec acquisitions-app-dev npm run db:migrate
docker exec acquisitions-app-prod npm run db:studio

# Stop and clean up containers
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.prod.yml down -v
```

### Testing Database Connections
```bash
# Connect to Neon Local database directly
docker exec acquisitions-neon-local psql -U neon -d neondb
```

## Architecture Overview

### Core Structure
This is a Node.js/Express REST API with a layered architecture:

- **Routes** (`src/routes/`) - Express route definitions and HTTP endpoint handlers
- **Controllers** (`src/controllers/`) - Request/response handling and validation
- **Services** (`src/services/`) - Business logic and data processing
- **Models** (`src/models/`) - Drizzle ORM database schema definitions
- **Middleware** (`src/middleware/`) - Cross-cutting concerns (security, authentication)
- **Utils** (`src/utils/`) - Shared utility functions (JWT, cookies, formatting)
- **Validations** (`src/validations/`) - Zod schema validation
- **Config** (`src/config/`) - Application configuration (database, logging, security)

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL
- **Provider**: Neon Database (serverless PostgreSQL)
- **Development**: Uses Neon Local for ephemeral database branches
- **Production**: Direct connection to Neon Cloud

### Security Stack
- **Arcjet**: Bot detection, rate limiting, and shield protection
- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing configuration
- **JWT**: Authentication tokens with role-based access
- **bcrypt**: Password hashing

### Path Imports
The project uses Node.js path imports (defined in `package.json`):
```javascript
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { createUser } from '#services/auth.service.js';
```

### Environment Configuration
- `.env.development` - Development environment (with Neon Local)
- `.env.production` - Production environment (direct Neon Cloud connection)
- `.env.example` - Template for environment variables

### Key Features
- User authentication (signup/signin/signout) with JWT tokens
- Role-based access control (admin, user, guest)
- Rate limiting based on user roles (admin: 20/min, user: 10/min, guest: 5/min)
- Comprehensive logging with Winston
- Request validation with Zod schemas
- Database migrations with Drizzle Kit

### Docker Setup
Two environments available:
- **Development**: Multi-container setup with Neon Local proxy for ephemeral databases
- **Production**: Optimized single container connecting directly to Neon Cloud

### Development Workflow
1. Use Docker for consistent development environment
2. Neon Local creates fresh database branches for each development session
3. Hot reload enabled for code changes
4. Use Drizzle Studio for database inspection
5. ESLint enforces code style with 2-space indentation, single quotes, and semicolons

### API Endpoints
- `GET /` - Health check endpoint
- `GET /health` - Detailed health status with uptime and memory usage
- `GET /api` - API status endpoint
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User authentication
- `POST /api/auth/sign-out` - User logout
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID (placeholder)
- `PUT /api/users/:id` - Update user (placeholder)
- `DELETE /api/users/:id` - Delete user (placeholder)

### Database Schema
- **Users table**: id, name, email, password (hashed), role, created_at, updated_at
- Default role: "user"
- Supported roles: "user", "admin"