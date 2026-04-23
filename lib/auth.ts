import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase';

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  const email = data.user?.email;

  if (error || !email) {
    redirect('/login');
  }

  if (adminEmail && email.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect('/login');
  }

  return data.user;
}
