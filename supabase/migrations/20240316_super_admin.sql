-- SQL Migration for Super Admin Panel (Tier 1)

-- TABLE 1: institutes
CREATE TABLE IF NOT EXISTS institutes (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  owner_name      text not null,
  owner_phone     text not null,
  city            text not null,
  plan            text not null 
                  check (plan in ('starter','growth','institute')),
  student_limit   int not null,
  payment_status  text not null 
                  check (payment_status in 
                  ('active','trial','overdue','suspended')),
  amount          int not null,
  subscribed_at   timestamp with time zone default now(),
  expires_at      timestamp with time zone not null,
  notes           text,
  created_at      timestamp with time zone default now()
);

-- TABLE 2: payments
CREATE TABLE IF NOT EXISTS payments (
  id              uuid primary key default gen_random_uuid(),
  institute_id    uuid references institutes(id) on delete cascade,
  amount          int not null,
  plan            text not null,
  paid_at         timestamp with time zone default now(),
  method          text,
  notes           text
);

-- Add institute_id column to existing users table:
ALTER TABLE users ADD COLUMN IF NOT EXISTS 
institute_id uuid references institutes(id) on delete set null;

-- FIX ROLE CONSTRAINT
-- The existing table has a check constraint that only allows 'coach' and 'student'
-- We need to drop it and allow 'admin', 'institute_head', 'teacher', and 'student'
DO $$
BEGIN
    ALTER TABLE IF EXISTS users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE IF EXISTS users ADD CONSTRAINT users_role_check 
        CHECK (role IN ('admin', 'institute', 'institute_head', 'teacher', 'student', 'coach'));
END $$;

-- RLS POLICIES
ALTER TABLE IF EXISTS institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;

-- Only admins can see/modify these tables
DO $$
BEGIN
    DROP POLICY IF EXISTS admin_all_on_institutes ON institutes;
    CREATE POLICY admin_all_on_institutes ON institutes
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

    DROP POLICY IF EXISTS admin_all_on_payments ON payments;
    CREATE POLICY admin_all_on_payments ON payments
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
END $$;

-- Instructions for the platform owner (me):
-- INSERT INTO users (id, name, email, role)
-- VALUES ('[YOUR-UID]', 'Super Admin', '[YOUR-EMAIL]', 'admin');
