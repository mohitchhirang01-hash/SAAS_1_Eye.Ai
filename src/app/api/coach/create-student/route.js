import { createRouteClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const supabase = createRouteClient();
    
    // 1. Verify if the sender is a coach
    const { data: { user: coachUser } } = await supabase.auth.getUser();
    if (!coachUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: coachProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', coachUser.id)
      .single();

    if (!coachProfile || coachProfile.role !== 'coach') {
      return NextResponse.json({ error: 'Only coaches can create students' }, { status: 403 });
    }

    // 2. Extract student data
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Initialize Admin Client (Requires Service Role Key)
    // IMPORTANT: USER MUST ADD SUPABASE_SERVICE_ROLE_KEY TO .env.local
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

    // 4. Create User in Auth
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name }
    });

    if (authError) throw authError;

    // 5. Create Profile in 'users' table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: 'student',
        coach_id: coachUser.id
      });

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, user: authData.user });

  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
