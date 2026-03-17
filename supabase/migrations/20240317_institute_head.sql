-- SQL Migration for Institute Head Dashboard (Tier 2)

-- TABLE 1: batches
CREATE TABLE IF NOT EXISTS batches (
  id              uuid primary key default gen_random_uuid(),
  institute_id    uuid references institutes(id) on delete cascade,
  name            text not null,
  subject         text check (subject in ('All', 'Mathematics', 'Physics', 'Chemistry')),
  teacher_id      uuid references users(id) on delete set null,
  schedule        text,
  created_at      timestamp with time zone default now()
);

-- TABLE 2: announcements
CREATE TABLE IF NOT EXISTS announcements (
  id              uuid primary key default gen_random_uuid(),
  institute_id    uuid references institutes(id) on delete cascade,
  title           text not null,
  message         text not null,
  target          text not null
                  check (target in ('all','teachers','students')),
  created_at      timestamp with time zone default now()
);

-- Add batch_id to users table and update role check
ALTER TABLE users ADD COLUMN IF NOT EXISTS 
batch_id uuid references batches(id) on delete set null;

DO $$ 
BEGIN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users ADD CONSTRAINT users_role_check 
        CHECK (role IN ('admin', 'institute', 'institute_head', 'teacher', 'student', 'coach'));
EXCEPTION
    WHEN others THEN NULL;
END $$;

-- RLS POLICIES

ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 1. Institute head can CRUD batches where institute_id = their institute
DROP POLICY IF EXISTS head_all_on_batches ON batches;
CREATE POLICY head_all_on_batches ON batches
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'institute' 
      AND users.institute_id = batches.institute_id
    )
  );

-- 2. Institute head can CRUD announcements where institute_id = their institute
DROP POLICY IF EXISTS head_all_on_announcements ON announcements;
CREATE POLICY head_all_on_announcements ON announcements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'institute' 
      AND users.institute_id = announcements.institute_id
    )
  );

-- 3. Institute head can read all users from their institute
DROP POLICY IF EXISTS head_read_own_institute_users ON users;
CREATE POLICY head_read_own_institute_users ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users me
      WHERE me.id = auth.uid()
      AND (me.role = 'institute' OR me.role = 'institute_head')
      AND me.institute_id = users.institute_id
    )
  );

-- 4. Teachers can read their own batch
DROP POLICY IF EXISTS teacher_read_own_batch ON batches;
CREATE POLICY teacher_read_own_batch ON batches
  FOR SELECT TO authenticated
  USING (
    teacher_id = auth.uid()
  );

-- 5. Students can read their own batch
DROP POLICY IF EXISTS student_read_own_batch ON batches;
CREATE POLICY student_read_own_batch ON batches
  FOR SELECT TO authenticated
  USING (
    id = (SELECT batch_id FROM users WHERE id = auth.uid())
  );

-- 6. General policy update for users table to allow specific access
-- We need to ensure employees/teachers can be seen by their heads.
-- This might require more complex logic depending on the current users policy.
-- For now, we follow the user's specific RLS requests.
