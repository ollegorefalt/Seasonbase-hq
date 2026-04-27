import { createSupabaseAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== 'string') return null;
  return raw.trim() || null;
}

export async function POST(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const formData = await req.formData();

  const supabase = createSupabaseAdminClient();

  await supabase
    .from('employers')
    .update({
      company_name: value(formData, 'company_name'),
      contact_name: value(formData, 'contact_name'),
      contact_email: value(formData, 'contact_email'),
      destination_focus: value(formData, 'destination_focus'),
      status: value(formData, 'status') ?? 'lead',
      next_step: value(formData, 'next_step'),
      next_step_date: value(formData, 'next_step_date'),
      notes: value(formData, 'notes'),
    })
    .eq('id', id);

  redirect('/');
}
