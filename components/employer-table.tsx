import { format } from 'date-fns';
import type { EmployerRow } from '@/types/dashboard';

function badgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes('onboard')) return 'badge ok';
  if (normalized.includes('meeting')) return 'badge info';
  if (normalized.includes('follow')) return 'badge warn';
  if (normalized.includes('not')) return 'badge danger';
  return 'badge';
}

export function EmployerTable({ rows }: { rows: EmployerRow[] }) {
  if (!rows.length) {
    return <div className="empty-state">No employers yet. Add your first one from Add employer.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Destination</th>
            <th>Next step</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.company_name}</td>
              <td>
                <div>{row.contact_name ?? '—'}</div>
                <div className="small">{row.contact_email ?? ''}</div>
              </td>
              <td><span className={badgeClass(row.status)}>{row.status}</span></td>
              <td>{row.destination_focus ?? '—'}</td>
              <td>{row.next_step_date ? format(new Date(row.next_step_date), 'yyyy-MM-dd') : '—'}</td>
              <td>{format(new Date(row.updated_at), 'yyyy-MM-dd')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
