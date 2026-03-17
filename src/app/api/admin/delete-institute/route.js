import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Institute ID is required' }, { status: 400 });
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

    // 1. Get all users associated with this institute to delete them from Auth
    const { data: users, error: userError } = await adminSupabase
      .from('users')
      .select('id')
      .eq('institute_id', id);

    if (userError) throw userError;

    // 2. Delete users from Auth
    if (users && users.length > 0) {
      for (const user of users) {
        const { error: authErr } = await adminSupabase.auth.admin.deleteUser(user.id);
        if (authErr) console.error(`Failed to delete auth user ${user.id}:`, authErr);
      }
    }

    // 3. Delete institute (cascades should handle DB user deletion)
    const { error: deleteError } = await adminSupabase
      .from('institutes')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting institute:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
