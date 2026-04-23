import { requireAdmin } from '@/lib/auth';
import { createMeetingAction } from '@/lib/actions';
import { createSupabaseAdminClient } from '@/lib/supabase';

const statuses = ['lead', 'contacted', 'meeting booked', 'follow-up', 'interested', 'onboarded', 'not now'];
const meetingTypes = ['call', 'video', 'in person', 'email follow-up'];

export default async function NewMeetingPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data: employers } = await supabase
    .from('employers')
    .select('id, company_name')
    .order('company_name', { ascending: true });

  return (
    <section className="card">
      <h2 className="section-title">Log meeting</h2>
      <p className="section-subtitle">Track outreach progress and update employer status from one form.</p>
      <form action={createMeetingAction} className="form-grid">
        <div className="field">
          <label htmlFor="employer_id">Employer</label>
          <select id="employer_id" name="employer_id" defaultValue="">
            <option value="">Select employer</option>
            {(employers ?? []).map((employer) => (
              <option key={employer.id} value={employer.id}>{employer.company_name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="meeting_date">Meeting date</label>
          <input id="meeting_date" name="meeting_date" type="date" required />
        </div>
        <div className="field">
          <label htmlFor="meeting_type">Meeting type</label>
          <select id="meeting_type" name="meeting_type" defaultValue="call">
            {meetingTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="status_after">Status after meeting</label>
          <select id="status_after" name="status_after" defaultValue="follow-up">
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="summary">Summary</label>
          <textarea id="summary" name="summary" placeholder="What was discussed?" />
        </div>
        <div className="field full">
          <label htmlFor="outcome">Outcome</label>
          <input id="outcome" name="outcome" placeholder="Interested for winter 26/27, wants follow-up after launch..." />
        </div>
        <div className="field">
          <label htmlFor="next_step">Next step</label>
          <input id="next_step" name="next_step" placeholder="Send demo, follow up, intro someone else..." />
        </div>
        <div className="field">
          <label htmlFor="next_step_date">Next step date</label>
          <input id="next_step_date" name="next_step_date" type="date" />
        </div>
        <div className="actions">
          <button type="submit">Save meeting</button>
        </div>
      </form>
    </section>
  );
}
