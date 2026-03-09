-- Add is_blocked flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE;

-- Admin can block/unblock any user
-- (run this manually as service_role in Supabase SQL Editor to set a user as admin)
-- UPDATE profiles SET role = 'admin' WHERE id = '<your-user-id>';

-- To block a user:
-- UPDATE profiles SET is_blocked = true WHERE id = '<user-id>';

-- To unblock:
-- UPDATE profiles SET is_blocked = false WHERE id = '<user-id>';
