-- 1. RESOLVE CONFLICTS
-- The existing 'users' table uses 'username' as PK. 
-- The new Coach system requires 'users' to link to 'auth.users' via 'id' (UUID).
-- We rename the old one to avoid errors during creation.

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
    ALTER TABLE IF EXISTS users RENAME TO manual_users;
  END IF;
END $$;

-- 2. TABLES SETUP (As requested in Step 1)

-- Table: users (Profile table linked to auth.users)
CREATE TABLE users (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  email       text not null,
  role        text not null check (role in ('coach','student')),
  coach_id    uuid references users(id) on delete set null,
  target_score int default 200,
  created_at  timestamp with time zone default now()
);

-- Table: alerts
CREATE TABLE alerts (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid references users(id) on delete cascade,
  student_id  uuid references users(id) on delete cascade, -- null = batch alert
  message     text not null,
  topic_flag  text,
  is_read     boolean default false,
  created_at  timestamp with time zone default now()
);

-- Table: batch_focus
CREATE TABLE batch_focus (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid references users(id) on delete cascade,
  topic_id    text not null,
  topic_name  text not null,
  subject     text not null,
  note        text,
  created_at  timestamp with time zone default now()
);

-- 3. ENABLE RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_focus ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Users Table Policies
CREATE POLICY "Coach can read their own students" ON users
  FOR SELECT TO authenticated
  USING (coach_id = auth.uid() OR id = auth.uid());

CREATE POLICY "Coach can insert student profiles" ON users
  FOR INSERT TO authenticated
  WITH CHECK (role = 'student' AND coach_id = auth.uid());

CREATE POLICY "Coach can update their students target_score" ON users
  FOR UPDATE TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Student can read own profile" ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Alerts Table Policies
CREATE POLICY "Coach can insert alerts" ON alerts
  FOR INSERT TO authenticated
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coach can read sent alerts" ON alerts
  FOR SELECT TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Student can read relevant alerts" ON alerts
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR student_id IS NULL);

CREATE POLICY "Student can update is_read on their own alerts" ON alerts
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Batch Focus Table Policies
CREATE POLICY "Coach can full CRUD batch_focus" ON batch_focus
  FOR ALL TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Student can read batch_focus for their coach" ON batch_focus
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.coach_id = batch_focus.coach_id
  ));

-- Progress Table Policy
-- Assuming the 'progress' table uses student uuid as 'id'
-- If using 'user_data_v2', this should be updated accordingly.
CREATE POLICY "Coach can read student progress" ON user_data_v2
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id::text = user_data_v2.id AND users.coach_id = auth.uid()
  ));
