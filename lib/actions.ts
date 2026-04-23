'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdminClient } from './supabase';
import { requireAdmin } from './auth';

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function createEmployerAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const payload = {
    company_name: stringValue(formData, 'company_name'),
    contact_name: stringValue(formData, 'contact_name') || null,
    contact_email: stringValue(formData, 'contact_email') || null,
    contact_phone: stringValue(formData, 'contact_phone') || null,
    destination_focus: stringValue(formData, 'destination_focus') || null,
    source: stringValue(formData, 'source') || null,
    status: stringValue(formData, 'status') || 'lead',
    notes: stringValue(formData, 'notes') || null,
    next_step: stringValue(formData, 'next_step') || null,
    next_step_date: stringValue(formData, 'next_step_date') || null,
  };

  const { error } = await supabase.from('employers').insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/');
  redirect('/?created=employer');
}

export async function createMeetingAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const employerId = stringValue(formData, 'employer_id');
  const statusAfter = stringValue(formData, 'status_after') || null;
  const meetingDate = stringValue(formData, 'meeting_date');

  const { error } = await supabase.from('meetings').insert({
    employer_id: employerId || null,
    meeting_date: meetingDate,
    meeting_type: stringValue(formData, 'meeting_type') || 'call',
    summary: stringValue(formData, 'summary') || null,
    outcome: stringValue(formData, 'outcome') || null,
    next_step: stringValue(formData, 'next_step') || null,
    next_step_date: stringValue(formData, 'next_step_date') || null,
    status_after: statusAfter,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (employerId && statusAfter) {
    await supabase
      .from('employers')
      .update({
        status: statusAfter,
        next_step: stringValue(formData, 'next_step') || null,
        next_step_date: stringValue(formData, 'next_step_date') || null,
      })
      .eq('id', employerId);
  }

  revalidatePath('/');
  redirect('/?created=meeting');
}
