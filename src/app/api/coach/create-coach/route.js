import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing name, email, or password' }, { status: 400 });
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 1. Create User in Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (authError) throw authError;

    // 2. Create Profile in 'users' table
    const { error: profileError } = await adminSupabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: 'coach'
      });

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, message: 'Coach account created successfully' });

  } catch (error) {
    console.error('Create coach error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
