-- PERFORMANCE OVERHAUL: Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_institute ON users(institute_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_batch ON users(batch_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_student ON alerts(student_id);
CREATE INDEX IF NOT EXISTS idx_alerts_coach ON alerts(coach_id);
CREATE INDEX IF NOT EXISTS idx_payments_institute ON payments(institute_id);

-- ROLE METADATA SYNC: Store role in user_metadata for zero-DB middleware checks
-- This script syncs existing roles into auth.users metadata
UPDATE auth.users SET 
raw_user_meta_data = 
raw_user_meta_data || 
jsonb_build_object('role', 
  (SELECT role FROM public.users 
   WHERE public.users.id = auth.users.id))
WHERE id IN (SELECT id FROM public.users);
