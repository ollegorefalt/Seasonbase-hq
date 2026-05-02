import { requireAdmin } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase';
import { EmployerTable } from '@/components/employer-table';

export default async function EmployersPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const { data: employers } = await supabase
    .from('employers')
    .select('id, company_name, contact_name, contact_email, status, destination_focus, next_step_date, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <section className="card">
      <h2 className="section-title">All employers</h2>
      <p className="section-subtitle">Full employer pipeline, including older leads.</p>
      <EmployerTable rows={employers ?? []} />
    </section>
  );
}
