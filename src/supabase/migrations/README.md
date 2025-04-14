# Supabase Migrations

This directory contains SQL migration files for setting up and updating the Supabase database schema.

## How to Run Migrations

You can run these migrations using the Supabase CLI or directly in the SQL Editor in the Supabase Dashboard.

### Using Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

### Using Supabase Dashboard

1. Log in to your Supabase Dashboard
2. Select your project
3. Go to the SQL Editor
4. Open the migration file you want to run
5. Click "Run" to execute the SQL commands

## Migration Files

- `create_analytics_table.sql`: Creates the analytics table for tracking video performance metrics across different platforms.

## Important Notes

- Always back up your database before running migrations in production
- Test migrations in a development environment first
- Some migrations may require adjustments to your application code
