import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, owner_name, email, password, city, plan, student_limit, amount, expires_at } = data;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
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

    // 1. Create Institute
    const { data: inst, error: instError } = await adminSupabase
      .from('institutes')
      .insert({
        name,
        owner_name,
        owner_phone: data.owner_phone || '',
        city,
        plan,
        student_limit,
        payment_status: 'trial',
        amount,
        expires_at,
        notes: data.notes || ''
      })
      .select()
      .single();

    if (instError) throw instError;

    // 2. Create Institute Head in Auth
    const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: owner_name }
    });

    if (authError) throw authError;

    // 3. Create User profile
    const { error: profileError } = await adminSupabase
      .from('users')
      .insert({
        id: authUser.user.id,
        name: owner_name,
        email,
        role: 'institute', // Consistent with Tier 2 implementation
        institute_id: inst.id
      });

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, data: inst });

  } catch (error) {
    console.error('Error creating institute:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
