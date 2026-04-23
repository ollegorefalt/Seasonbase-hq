'use client';

import { useState } from 'react';
import { createClient } from '@/lib/browser-client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    setMessage(error ? error.message : 'Magic link sent. Check your email.');
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid" style={{ maxWidth: 640 }}>
      <div className="field full">
        <label htmlFor="email">Admin email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="actions">
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send magic link'}</button>
      </div>
      {message ? <div className="small">{message}</div> : null}
    </form>
  );
}
