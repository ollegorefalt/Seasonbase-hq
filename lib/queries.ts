import { subDays, startOfMonth } from 'date-fns';
import { createSupabaseAdminClient } from './supabase';
import type {
  OverviewMetrics,
  SignupByDay,
  TopDestination,
  EmployerPipelineRow,
  EmployerRow,
  SignupRow,
} from '@/types/dashboard';

function safeAnswers(record: unknown): Record<string, unknown> | null {
  if (!record) return null;

  if (typeof record === 'string') {
    try {
      const parsed = JSON.parse(record);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  return record && typeof record === 'object' ? (record as Record<string, unknown>) : null;
}

function extractDestinations(answers: Record<string, unknown> | null): string[] {
  if (!answers) return [];

  const candidates = [
    answers.destinations,
    answers.destination,
    answers.destinations_selected,
    answers.preferred_destinations,
  ];

  const found = candidates.find((value) => value !== undefined && value !== null);

  if (Array.isArray(found)) {
    return found.filter((x): x is string => typeof x === 'string');
  }

  if (typeof found === 'string') {
    return found
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

export async function getOverviewMetrics(): Promise<OverviewMetrics> {
  const supabase = createSupabaseAdminClient();
  const now = new Date();
  const last30 = subDays(now, 30).toISOString();
  const last7 = subDays(now, 7).toISOString();
  const last14 = subDays(now, 14).toISOString();
  const prev14 = subDays(now, 28).toISOString();
  const monthStart = startOfMonth(now).toISOString();

  const [
    totalSignupsRes,
    signups30Res,
    signups7Res,
    signups14Res,
    signupsPrev14Res,
    totalEmployersRes,
    activeLeadsRes,
    meetingsMonthRes,
  ] = await Promise.all([
    supabase.from('waitlist_entries').select('*', { count: 'exact', head: true }),
    supabase.from('waitlist_entries').select('*', { count: 'exact', head: true }).gte('created_at', last30),
    supabase.from('waitlist_entries').select('*', { count: 'exact', head: true }).gte('created_at', last7),
    supabase.from('waitlist_entries').select('*', { count: 'exact', head: true }).gte('created_at', last14),
    supabase.from('waitlist_entries').select('*', { count: 'exact', head: true }).gte('created_at', prev14).lt('created_at', last14),
    supabase.from('employers').select('*', { count: 'exact', head: true }),
    supabase.from('employers').select('*', { count: 'exact', head: true }).in('status', ['lead', 'contacted', 'meeting booked', 'follow-up']),
    supabase.from('meetings').select('*', { count: 'exact', head: true }).gte('meeting_date', monthStart),
  ]);

  const recent14 = signups14Res.count ?? 0;
  const previous14 = signupsPrev14Res.count ?? 0;
  const growth = previous14 > 0 ? ((recent14 - previous14) / previous14) * 100 : recent14 > 0 ? 100 : null;

  return {
    totalSignups: totalSignupsRes.count ?? 0,
    signupsLast30Days: signups30Res.count ?? 0,
    signupsLast7Days: signups7Res.count ?? 0,
    signupsGrowth14dPct: growth,
    totalEmployers: totalEmployersRes.count ?? 0,
    activeLeads: activeLeadsRes.count ?? 0,
    meetingsThisMonth: meetingsMonthRes.count ?? 0,
  };
}

export async function getSignupsByDay(days = 30): Promise<SignupByDay[]> {
  const supabase = createSupabaseAdminClient();
  const since = subDays(new Date(), days).toISOString();

  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  const map = new Map<string, number>();
  data.forEach((row) => {
    const day = row.created_at.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([day, count]) => ({ day, count }));
}

export async function getTopDestinations(limit = 8): Promise<TopDestination[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('answers');

  if (error || !data) return [];

  const counts = new Map<string, number>();

  data.forEach((row) => {
    const destinations = extractDestinations(safeAnswers(row.answers));
    destinations.forEach((destination) => {
      counts.set(destination, (counts.get(destination) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([destination, count]) => ({ destination, count }));
}

export async function getEmployerPipeline(): Promise<EmployerPipelineRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('employers')
    .select('status');

  if (error || !data) return [];

  const counts = new Map<string, number>();
  data.forEach((row) => {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({ status, count }));
}

export async function getLatestEmployers(limit = 12): Promise<EmployerRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('employers')
    .select('id, company_name, contact_name, contact_email, status, destination_focus, next_step_date, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}

export async function getRecentSignups(limit = 12): Promise<SignupRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('id, created_at, name, email, answers')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}
