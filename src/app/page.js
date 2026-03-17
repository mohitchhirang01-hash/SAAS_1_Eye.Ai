import { redirect } from 'next/navigation';

export default function HomePage() {
  // Direct landing on Login page. 
  // Middleware handles session check: if already logged in, it will redirect to their specific dashboard.
  redirect('/login');
}
