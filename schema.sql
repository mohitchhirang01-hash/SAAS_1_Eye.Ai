-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- Create a private table to store manually managed users
CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL, -- Plain text as requested for simplicity in this private setup
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the table to store user data (linked by username)
CREATE TABLE IF NOT EXISTS user_data_v2 (
    id TEXT PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data_v2 ENABLE ROW LEVEL SECURITY;

-- Note: We will allow public read on 'users' for our manual login check script
-- Ideally, this would be a database function, but for simplicity:
CREATE POLICY "Allow public select for login check" ON users
    FOR SELECT
    USING (true);

-- Users can only see and edit their own data based on their username
-- Since we are not using Supabase Auth, we will handle the "session" logic carefully in the frontend
-- For this private app, we'll allow full access to user_data_v2 for authenticated service roles
-- or simplify policies to allow access if the client knows the username (guest-like but authenticated)
CREATE POLICY "Allow data access by username" ON user_data_v2
    FOR ALL
    USING (true)
    WITH CHECK (true);
