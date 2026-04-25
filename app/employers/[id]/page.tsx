import { createSupabaseAdminClient } from '@/lib/supabase';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EmployerPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: employer } = await supabase
    .from('employers')
    .select('*')
    .eq('id', id)
    .single();

  if (!employer) {
    return (
      <div className="card">
        <h2 className="section-title">Employer not found</h2>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 760 }}>
      <h1 className="section-title">{employer.company_name}</h1>
      <p className="section-subtitle">Update employer status and next steps.</p>

      <form action={`/employers/${employer.id}/update`} method="post" className="form">
        <label>
          Company name
          <input name="company_name" defaultValue={employer.company_name ?? ''} />
        </label>

        <label>
          Contact name
          <input name="contact_name" defaultValue={employer.contact_name ?? ''} />
        </label>

        <label>
          Contact email
          <input name="contact_email" defaultValue={employer.contact_email ?? ''} />
        </label>

        <label>
          Destination focus
          <input name="destination_focus" defaultValue={employer.destination_focus ?? ''} />
        </label>

        <label>
          Status
          <select name="status" defaultValue={employer.status ?? 'lead'}>
            <option value="lead">lead</option>
            <option value="contacted">contacted</option>
            <option value="meeting booked">meeting booked</option>
            <option value="follow-up">follow-up</option>
            <option value="interested">interested</option>
            <option value="onboarded">onboarded</option>
            <option value="not now">not now</option>
          </select>
        </label>

        <label>
          Next step
          <input name="next_step" defaultValue={employer.next_step ?? ''} />
        </label>

        <label>
          Next step date
          <input type="date" name="next_step_date" defaultValue={employer.next_step_date ?? ''} />
        </label>

        <label>
          Notes
          <textarea name="notes" defaultValue={employer.notes ?? ''} rows={5} />
        </label>

        <button type="submit">Save changes</button>
      </form>
    </div>
  );
}
