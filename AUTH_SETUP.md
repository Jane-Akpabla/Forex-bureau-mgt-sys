# Supabase Authentication Setup Guide

## Overview
Supabase authentication has been integrated into your Forex Bureau Management System. This guide will help you set up the authentication system.

## Prerequisites
1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. Your Supabase project URL and anon key

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Service role key for server-side operations
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

## Supabase Project Setup

### 1. Enable Authentication
In your Supabase dashboard:
1. Go to Authentication > Settings
2. Enable email authentication
3. Configure your site URL (e.g., `http://localhost:3000` for development)

### 2. Configure Email Templates (Optional)
1. Go to Authentication > Email Templates
2. Customize the confirmation and reset password emails
3. Update the redirect URLs to match your domain

### 3. Set up Row Level Security (RLS)
Run the following SQL in your Supabase SQL editor to enable RLS on your tables:

```sql
-- Enable RLS on inventory table
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Enable RLS on transactions table  
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your use case)
-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read" ON public.inventory
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON public.transactions
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated write" ON public.inventory
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated write" ON public.transactions
  FOR ALL TO authenticated USING (true);
```

## Features Added

### Authentication Components
- **LoginForm**: Email/password login with validation
- **UserMenu**: User profile dropdown with logout
- **AuthPage**: Login interface
- **ProtectedRoute**: Wrapper to protect routes from unauthorized access

### Authentication Context
- **AuthProvider**: React context for managing auth state
- **useAuth**: Hook for accessing auth state and methods

### Route Protection
All main pages are now protected:
- Dashboard (`/`)
- Calculator (`/calculator`)
- Transactions (`/transactions`)
- Rates (`/rates`)
- Inventory (`/inventory`)

## Usage

### For Users
1. Visit any page - you'll be redirected to the login screen
2. Enter your email and password to log in
3. Access the full system after successful authentication
4. Use the user menu in the sidebar to log out

### For Developers
```tsx
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, signOut, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>
  
  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

## Security Notes

1. **Environment Variables**: Never commit your `.env.local` file
2. **RLS Policies**: Review and adjust the Row Level Security policies based on your requirements
3. **Password Requirements**: Minimum 6 characters (configurable in Supabase)

## Troubleshooting

### Common Issues
1. **"Invalid login credentials"**: Verify the email and password are correct
2. **CORS errors**: Ensure your site URL is configured in Supabase
3. **Environment variables not loading**: Restart your development server after adding `.env.local`

### Getting Help
- Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
- Review the console for any error messages
- Ensure all environment variables are correctly set

## Next Steps

1. Set up your environment variables
2. Configure your Supabase project
3. Test the authentication flow
4. Customize the UI components as needed
5. Add any additional user management features
