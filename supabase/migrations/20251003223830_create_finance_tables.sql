/*
  # Create Finance Management Schema

  ## New Tables
  
  ### 1. `wallets`
    - `id` (uuid, primary key) - Unique identifier for the wallet
    - `user_id` (uuid, foreign key) - Reference to auth.users
    - `name` (text) - Name of the wallet
    - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. `categories`
    - `id` (uuid, primary key) - Unique identifier for the category
    - `user_id` (uuid, foreign key) - Reference to auth.users
    - `name` (text) - Name of the category
    - `type` (text) - Type: 'receita' or 'despesa'
    - `created_at` (timestamptz) - Creation timestamp
  
  ### 3. `credit_cards`
    - `id` (uuid, primary key) - Unique identifier for the card
    - `user_id` (uuid, foreign key) - Reference to auth.users
    - `name` (text) - Name of the card
    - `limit_amount` (numeric) - Credit limit
    - `closing_day` (integer) - Day of month for closing
    - `due_day` (integer) - Day of month for payment due
    - `created_at` (timestamptz) - Creation timestamp
  
  ### 4. `transactions`
    - `id` (uuid, primary key) - Unique identifier for the transaction
    - `user_id` (uuid, foreign key) - Reference to auth.users
    - `wallet_id` (uuid, foreign key) - Reference to wallets
    - `category_id` (uuid, foreign key) - Reference to categories
    - `credit_card_id` (uuid, nullable, foreign key) - Reference to credit_cards
    - `type` (text) - Type: 'receita' or 'despesa'
    - `amount` (numeric) - Transaction amount
    - `description` (text) - Transaction description
    - `date` (date) - Transaction date
    - `installments` (integer, nullable) - Number of installments for credit card purchases
    - `current_installment` (integer, nullable) - Current installment number (1-based)
    - `parent_transaction_id` (uuid, nullable) - Reference to parent transaction for installments
    - `is_recurring` (boolean) - Whether this is a recurring transaction
    - `recurrence_frequency` (text, nullable) - Frequency: 'monthly', 'weekly', 'yearly'
    - `recurrence_end_date` (date, nullable) - When recurrence ends
    - `created_at` (timestamptz) - Creation timestamp

  ## Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tables
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('receita', 'despesa')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  limit_amount numeric DEFAULT 0,
  closing_day integer CHECK (closing_day >= 1 AND closing_day <= 31),
  due_day integer CHECK (due_day >= 1 AND due_day <= 31),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id uuid REFERENCES wallets(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  credit_card_id uuid REFERENCES credit_cards(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('receita', 'despesa')),
  amount numeric NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  installments integer DEFAULT 1,
  current_installment integer DEFAULT 1,
  parent_transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  is_recurring boolean DEFAULT false,
  recurrence_frequency text CHECK (recurrence_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  recurrence_end_date date,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallets
CREATE POLICY "Users can view own wallets"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets"
  ON wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wallets"
  ON wallets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for credit_cards
CREATE POLICY "Users can view own credit cards"
  ON credit_cards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit cards"
  ON credit_cards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit cards"
  ON credit_cards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own credit cards"
  ON credit_cards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);