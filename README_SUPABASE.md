# Supabase integration & SQL setup

This file contains SQL statements to create the `inventory` table used by the Forex management system, plus sample placeholder data you can insert into your Supabase project.

Run these statements in the Supabase SQL editor or psql connected to your Supabase database.

-- Create `inventory` table
CREATE TABLE public.inventory (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  threshold NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to update `updated_at`
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- Placeholder data
INSERT INTO public.inventory (code, name, amount, threshold) VALUES
('USD', 'US Dollar', 125430, 50000),
('EUR', 'Euro', 89250, 40000),
('GBP', 'British Pound', 45680, 30000),
('JPY', 'Japanese Yen', 8450000, 5000000),
('CAD', 'Canadian Dollar', 28900, 30000),
('AUD', 'Australian Dollar', 35200, 25000),
('CHF', 'Swiss Franc', 18750, 20000),
('CNY', 'Chinese Yuan', 156800, 100000)
ON CONFLICT (code) DO NOTHING;

-- Optional: grant permissions to anon key (adjust roles as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO anon;


# Notes
- After creating the table, set your `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` (or anon key for client-only access) in your environment.
- For server-side routes we recommend using the service role key with restricted usage only on the server (do NOT expose it to the browser).

# Example .env.local
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=eyJhb...
# SUPABASE_SERVICE_KEY=eyJhb... (service_role)


-- ==============================
-- Transactions table
-- ==============================

-- Create `transactions` table
CREATE TABLE public.transactions (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  time TEXT,
  customer TEXT NOT NULL,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  converted NUMERIC NOT NULL,
  rate NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reuse set_updated_at trigger created earlier
CREATE TRIGGER set_updated_at_transactions
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE PROCEDURE public.set_updated_at();

-- Placeholder transactions
INSERT INTO public.transactions (id, date, time, customer, from_currency, to_currency, amount, converted, rate, status) VALUES
('TXN001', '2025-03-10', '10:30 AM', 'John Doe', 'USD', 'EUR', 1000.00, 920.00, 0.9200, 'completed'),
('TXN002', '2025-03-10', '10:15 AM', 'Jane Smith', 'GBP', 'USD', 500.00, 635.00, 1.2700, 'completed'),
('TXN003', '2025-03-10', '09:45 AM', 'Mike Johnson', 'EUR', 'GBP', 750.00, 645.00, 0.8600, 'completed'),
('TXN004', '2025-03-10', '09:30 AM', 'Sarah Williams', 'USD', 'JPY', 2000.00, 299000.00, 149.5000, 'pending'),
('TXN005', '2025-03-10', '09:00 AM', 'David Brown', 'CAD', 'USD', 1200.00, 888.00, 0.7400, 'completed')
ON CONFLICT (id) DO NOTHING;

-- Optional: grant permissions to anon key (adjust roles as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO anon;

