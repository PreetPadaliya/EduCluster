@echo off
echo ========================================
echo EduCluster PostgreSQL Database Setup
echo ========================================
echo.

echo Prerequisites:
echo 1. PostgreSQL should be installed on your system
echo 2. PostgreSQL service should be running
echo 3. Database user 'postgres' should exist with password 'password'
echo 4. Or update the DATABASE_URL in .env file with your credentials
echo.

echo Step 1: Creating database...
psql -U postgres -c "DROP DATABASE IF EXISTS educluster;"
psql -U postgres -c "CREATE DATABASE educluster;"

echo.
echo Step 2: Pushing Prisma schema to database...
npx prisma db push

echo.
echo Step 3: Seeding database with initial data...
npx prisma db seed

echo.
echo Step 4: Generating Prisma client...
npx prisma generate

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo You can now start the server with: npm run dev
echo Or view the database with: npx prisma studio
echo.
pause