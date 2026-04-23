import { requireAdmin } from '@/lib/auth';
import { createEmployerAction } from '@/lib/actions';

const statuses = ['lead', 'contacted', 'meeting booked', 'follow-up', 'interested', 'onboarded', 'not now'];

export default async function NewEmployerPage() {
  await requireAdmin();
  return (
    <section className="card">
      <h2 className="section-title">Add employer</h2>
      <p className="section-subtitle">Log a new company, status and next step directly from the dashboard.</p>
      <form action={createEmployerAction} className="form-grid">
        <div className="field">
          <label htmlFor="company_name">Company name</label>
          <input id="company_name" name="company_name" required />
        </div>
        <div className="field">
          <label htmlFor="destination_focus">Destination focus</label>
          <input id="destination_focus" name="destination_focus" placeholder="Åre, Verbier, Val Thorens..." />
        </div>
        <div className="field">
          <label htmlFor="contact_name">Contact name</label>
          <input id="contact_name" name="contact_name" />
        </div>
        <div className="field">
          <label htmlFor="contact_email">Contact email</label>
          <input id="contact_email" name="contact_email" type="email" />
        </div>
        <div className="field">
          <label htmlFor="contact_phone">Phone</label>
          <input id="contact_phone" name="contact_phone" />
        </div>
        <div className="field">
          <label htmlFor="source">Source</label>
          <input id="source" name="source" placeholder="LinkedIn, intro, cold outbound..." />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="lead">
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="next_step_date">Next step date</label>
          <input id="next_step_date" name="next_step_date" type="date" />
        </div>
        <div className="field full">
          <label htmlFor="next_step">Next step</label>
          <input id="next_step" name="next_step" placeholder="Follow up in May, send demo, ask for hiring plan..." />
        </div>
        <div className="field full">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" placeholder="Context, objections, warm intro notes, fit, timeline..." />
        </div>
        <div className="actions">
          <button type="submit">Save employer</button>
        </div>
      </form>
    </section>
  );
}
