import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <section className="card">
      <h2 className="section-title">Login</h2>
      <p className="section-subtitle">Use Supabase magic link auth for your internal dashboard admin account.</p>
      <LoginForm />
    </section>
  );
}
