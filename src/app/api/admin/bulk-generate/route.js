import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { instituteId, studentNames, teacherNames } = await req.json();

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

    // Get institute name for email/password generation
    const { data: inst, error: instError } = await adminSupabase
      .from('institutes')
      .select('name')
      .eq('id', instituteId)
      .single();

    if (instError) throw instError;

    const instCode = inst.name.substring(0, 3).toUpperCase();
    const generatedAccounts = [];

    // Helper to process names
    const processBatch = async (names, role) => {
      for (const fullName of names) {
        if (!fullName.trim()) continue;
        
        const firstName = fullName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        let email, password;

        if (role === 'teacher') {
          email = `${firstName}.${instCode}.t@jeesprint.in`;
          password = `${instCode}@teach2024`;
        } else {
          email = `${firstName}.${instCode}@jeesprint.in`;
          password = `${instCode}@${firstName}24`;
        }

        // Create in Auth
        const { data: authUser, error: authErr } = await adminSupabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName }
        });

        if (authErr && authErr.message.includes('already registered')) {
          // Handle collision or skip
          continue;
        }
        if (authErr) throw authErr;

        // Create in Users
        const { error: profErr } = await adminSupabase
          .from('users')
          .insert({
            id: authUser.user.id,
            name: fullName,
            email,
            role,
            institute_id: instituteId
          });

        if (profErr) throw profErr;

        generatedAccounts.push({ name: fullName, email, password, role });
      }
    };

    await processBatch(teacherNames, 'teacher');
    await processBatch(studentNames, 'student');

    return NextResponse.json({ success: true, accounts: generatedAccounts });

  } catch (error) {
    console.error('Bulk generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
