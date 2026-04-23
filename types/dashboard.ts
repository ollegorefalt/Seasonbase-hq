export type OverviewMetrics = {
  totalSignups: number;
  signupsLast30Days: number;
  signupsLast7Days: number;
  signupsGrowth14dPct: number | null;
  totalEmployers: number;
  activeLeads: number;
  meetingsThisMonth: number;
};

export type SignupByDay = {
  day: string;
  count: number;
};

export type TopDestination = {
  destination: string;
  count: number;
};

export type EmployerPipelineRow = {
  status: string;
  count: number;
};

export type EmployerRow = {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  status: string;
  destination_focus: string | null;
  next_step_date: string | null;
  updated_at: string;
};

export type SignupRow = {
  id: string;
  created_at: string;
  name: string | null;
  email: string;
  answers: Record<string, unknown> | null;
};
