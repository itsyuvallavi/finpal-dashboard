# FinPal Setup Instructions

This guide will help you set up the FinPal Personal Finance Dashboard with a real backend server and database.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Database Setup

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/windows/

2. **Start PostgreSQL service**:
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo service postgresql start`
   - Windows: Use Services manager or PostgreSQL service

3. **Create database and user**:
   ```bash
   # Connect to PostgreSQL as superuser
   psql postgres
   
   # Create user and database
   CREATE USER finpal WITH PASSWORD 'password123';
   CREATE DATABASE finpal_db OWNER finpal;
   GRANT ALL PRIVILEGES ON DATABASE finpal_db TO finpal;
   \q
   ```

## Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env file with your database credentials
   ```

4. **Generate Prisma client and push database schema**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5001`

## Frontend Setup

1. **Navigate back to main directory**:
   ```bash
   cd ..
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # The default API URL should work if backend runs on port 5001
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

## Testing the Setup

1. **Check backend health**:
   Open `http://localhost:5001/health` in your browser
   You should see: `{"status":"OK","message":"FinPal Server is running",...}`

2. **Test authentication**:
   - Go to `http://localhost:3000`
   - Try creating a new account
   - Login with the created credentials
   - Verify you can access the dashboard

## API Endpoints

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Transactions (requires authentication)
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Goals (requires authentication)
- `GET /api/goals` - Get all user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

## Database Management

- **View database in browser**: `npm run db:studio` (from server directory)
- **Reset database**: `npm run db:push --force-reset` (from server directory)

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `.env`
- Ensure database and user exist

### Port Conflicts
- Backend: Change `PORT` in `server/.env`
- Frontend: Use `npm run dev -- --port 3001`

### CORS Issues
- Update `FRONTEND_URL` in `server/.env`
- Restart backend server after changes

## Production Notes

- Change JWT_SECRET to a secure random string
- Use environment-specific database URLs
- Enable SSL for database connections
- Set NODE_ENV to "production"
- Use proper logging and monitoring

## Next Steps

Once setup is complete, you can:
1. Create user accounts and login
2. Add real financial transactions
3. Set up financial goals
4. View your financial dashboard with real data

The mock data has been removed - all data will now be stored in your PostgreSQL database!