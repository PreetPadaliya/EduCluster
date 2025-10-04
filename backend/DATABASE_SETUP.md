# PostgreSQL Database Setup Instructions

## Prerequisites

1. **Install PostgreSQL**: Download and install PostgreSQL from https://www.postgresql.org/download/
2. **Remember your credentials**: During installation, note down the username (usually 'postgres') and password you set

## Setup Steps

### Option 1: Using pgAdmin (GUI)

1. Open pgAdmin (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → Create → Database
4. Name: `educluster`
5. Click "Save"

### Option 2: Using Command Line

```bash
# Connect to PostgreSQL (replace 'postgres' with your username if different)
psql -U postgres

# Create the database
CREATE DATABASE educluster;

# Exit psql
\q
```

### Option 3: Using SQL Commands in any PostgreSQL client

```sql
CREATE DATABASE educluster;
```

## Update Database Connection

1. Open `backend\.env` file
2. Update the DATABASE_URL with your credentials:

```env
# Replace 'postgres', 'password', and 'localhost:5432' with your actual credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/educluster?schema=public"
```

**Common configurations:**

- Default: `postgresql://postgres:password@localhost:5432/educluster?schema=public`
- Custom password: `postgresql://postgres:your_password@localhost:5432/educluster?schema=public`
- Custom port: `postgresql://postgres:password@localhost:5433/educluster?schema=public`
- Custom user: `postgresql://your_user:your_password@localhost:5432/educluster?schema=public`

## Apply Database Schema

After creating the database and updating the connection string:

```bash
cd backend

# Push the schema to create tables
npx prisma db push

# Seed the database with initial data
npx prisma db seed

# Generate the Prisma client
npx prisma generate
```

## Verify Setup

```bash
# View the database in browser
npx prisma studio
```

This will open a web interface where you can view and edit your database data.

## Troubleshooting

### Connection Failed (P1000)

- Check if PostgreSQL service is running
- Verify username and password in DATABASE_URL
- Ensure the database 'educluster' exists
- Check if the port (default 5432) is correct

### Permission Denied

- Make sure your PostgreSQL user has permission to create databases
- Try connecting with the 'postgres' superuser first

### Port Already in Use

- PostgreSQL default port is 5432
- If you changed it during installation, update the DATABASE_URL accordingly

## Windows PostgreSQL Service

To start/stop PostgreSQL service on Windows:

```cmd
# Start service
net start postgresql-x64-14

# Stop service
net stop postgresql-x64-14
```

(Replace 'postgresql-x64-14' with your actual service name)
