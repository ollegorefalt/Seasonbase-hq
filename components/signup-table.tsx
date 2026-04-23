import { format } from 'date-fns';
import type { SignupRow } from '@/types/dashboard';

function parseDestinations(answers: Record<string, unknown> | null): string {
  if (!answers) return '—';
  const raw = answers.destinations ?? answers.destination ?? answers.destinations_selected;
  if (Array.isArray(raw)) return raw.join(', ');
  if (typeof raw === 'string') return raw;
  return '—';
}

export function SignupTable({ rows }: { rows: SignupRow[] }) {
  if (!rows.length) {
    return <div className="empty-state">No recent signups found.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Destinations</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{format(new Date(row.created_at), 'yyyy-MM-dd')}</td>
              <td>{row.name ?? '—'}</td>
              <td>{row.email}</td>
              <td>{parseDestinations(row.answers)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
