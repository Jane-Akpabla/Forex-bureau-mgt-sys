/*
  # Create currencies table

  1. New Tables
    - `currencies`
      - `id` (uuid, primary key) - Unique identifier for each currency
      - `code` (text, unique, not null) - Currency code (e.g., USD, EUR, GBP)
      - `name` (text, not null) - Full name of the currency
      - `symbol` (text, not null) - Currency symbol (e.g., $, €, £)
      - `amount` (numeric, default 0) - Current inventory amount
      - `created_at` (timestamptz, default now()) - Timestamp when currency was added
      - `updated_at` (timestamptz, default now()) - Timestamp when currency was last updated

  2. Security
    - Enable RLS on `currencies` table
    - Add policy for public read access (all users can view currencies)
    - Add policy for authenticated users to insert currencies
    - Add policy for authenticated users to update currencies
    - Add policy for authenticated users to delete currencies

  3. Indexes
    - Index on `code` for fast lookups
*/

CREATE TABLE IF NOT EXISTS currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  symbol text NOT NULL,
  amount numeric DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view currencies"
  ON currencies
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert currencies"
  ON currencies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update currencies"
  ON currencies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete currencies"
  ON currencies
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS currencies_code_idx ON currencies(code);