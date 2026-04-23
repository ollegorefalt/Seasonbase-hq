import { requireAdmin } from '@/lib/auth';
import { KpiCard } from '@/components/kpi-card';
import { SignupsChart, TopDestinationsChart } from '@/components/chart-card';
import { EmployerTable } from '@/components/employer-table';
import { SignupTable } from '@/components/signup-table';
import {
  getEmployerPipeline,
  getLatestEmployers,
  getOverviewMetrics,
  getRecentSignups,
  getSignupsByDay,
  getTopDestinations,
} from '@/lib/queries';

function pctText(value: number | null) {
  if (value === null) return 'No prior-period baseline yet';
  const rounded = Math.round(value);
  return `${rounded >= 0 ? '+' : ''}${rounded}% vs previous 14 days`;
}

export default async function HomePage() {
  await requireAdmin();
  const [metrics, signupsByDay, topDestinations, pipeline, employers, recentSignups] = await Promise.all([
    getOverviewMetrics(),
    getSignupsByDay(30),
    getTopDestinations(8),
    getEmployerPipeline(),
    getLatestEmployers(12),
    getRecentSignups(12),
  ]);

  return (
    <div className="grid" style={{ gap: 22 }}>
      <section className="grid cards-4">
        <KpiCard label="Total signups" value={String(metrics.totalSignups)} sub={pctText(metrics.signupsGrowth14dPct)} />
        <KpiCard label="Last 30 days" value={String(metrics.signupsLast30Days)} sub="Fresh inbound demand" />
        <KpiCard label="Last 7 days" value={String(metrics.signupsLast7Days)} sub="Weekly pulse" />
        <KpiCard label="Meetings this month" value={String(metrics.meetingsThisMonth)} sub={`${metrics.activeLeads} active employer leads`} />
      </section>

      <section className="grid main">
        <div className="card">
          <h2 className="section-title">Signup trend</h2>
          <p className="section-subtitle">Last 30 days of waitlist demand.</p>
          <SignupsChart data={signupsByDay} />
        </div>
        <div className="card">
          <h2 className="section-title">Top destinations</h2>
          <p className="section-subtitle">Most requested destinations from current signups.</p>
          <TopDestinationsChart data={topDestinations} />
        </div>
      </section>

      <section className="grid main">
        <div className="card">
          <h2 className="section-title">Employer pipeline</h2>
          <p className="section-subtitle">Where your leads currently sit.</p>
          {pipeline.length ? (
            pipeline.map((row) => (
              <div key={row.status} className="kpi-row">
                <div>{row.status}</div>
                <div className="badge">{row.count}</div>
              </div>
            ))
          ) : (
            <div className="empty-state">No employer pipeline data yet.</div>
          )}
        </div>
        <div className="card">
          <h2 className="section-title">Quick company stats</h2>
          <p className="section-subtitle">High-level employer side snapshot.</p>
          <div className="kpi-row"><div>Total employers tracked</div><div className="badge">{metrics.totalEmployers}</div></div>
          <div className="kpi-row"><div>Active leads</div><div className="badge info">{metrics.activeLeads}</div></div>
          <div className="kpi-row"><div>Meetings this month</div><div className="badge warn">{metrics.meetingsThisMonth}</div></div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Recent signups</h2>
        <p className="section-subtitle">Latest people joining the Seasonbase waitlist.</p>
        <SignupTable rows={recentSignups} />
      </section>

      <section className="card">
        <h2 className="section-title">Latest employer updates</h2>
        <p className="section-subtitle">Most recently changed employer records.</p>
        <EmployerTable rows={employers} />
      </section>
    </div>
  );
}
