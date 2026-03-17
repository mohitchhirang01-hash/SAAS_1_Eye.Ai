/* FIXED: Optimized middleware (Problem 1) - Skip static files, read role from JWT */
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/_next',
  '/font',
  '/favicon.ico',
  '/api/ping'
];

export async function middleware(req) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // 1. Skip middleware for static assets/public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthPage = pathname === '/' || pathname === '/login';
  const isProtectedPath = ['/student', '/coach', '/admin', '/institute'].some(p => pathname.startsWith(p));

  // 2. Redirect unauthenticated users
  if (!session && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3. User authenticated logic
  if (session) {
    // Read role from user_metadata (set after login). Fall back to DB query if missing.
    let role = session.user?.user_metadata?.role;

    if (!role) {
      // Fallback: query the users table for the role (handles first login before JWT refresh)
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
      role = profile?.role || 'student';
    }

    // 4. Redirect away from login/root to proper dashboard
    if (isAuthPage) {
      const redirectMap = {
        admin: '/admin/dashboard',
        coach: '/coach/dashboard',
        institute: '/institute/dashboard',
        student: '/student/dashboard',
      };
      return NextResponse.redirect(new URL(redirectMap[role] || '/student/dashboard', req.url));
    }

    // 5. Cross-role protection (using JWT metadata role instead of DB query)
    if (role === 'admin' && (pathname.startsWith('/student') || pathname.startsWith('/coach') || pathname.startsWith('/institute'))) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    if (role !== 'admin' && pathname.startsWith('/admin')) {
      const fallback = role === 'coach' ? '/coach/dashboard' : 
                       role === 'institute' ? '/institute/dashboard' : '/student/dashboard';
      return NextResponse.redirect(new URL(fallback, req.url));
    }

    if (role === 'institute' && (pathname.startsWith('/student') || pathname.startsWith('/coach'))) {
      return NextResponse.redirect(new URL('/institute/dashboard', req.url));
    }

    if (role === 'coach' && (pathname.startsWith('/student') || pathname.startsWith('/institute'))) {
      return NextResponse.redirect(new URL('/coach/dashboard', req.url));
    }
    
    if (role === 'student' && (pathname.startsWith('/coach') || pathname.startsWith('/institute'))) {
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/', '/login', '/student/:path*', '/coach/:path*', '/admin/:path*', '/institute/:path*'],
};
