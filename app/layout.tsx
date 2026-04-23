import './globals.css';
import type { Metadata } from 'next';
import { Nav } from '@/components/nav';

export const metadata: Metadata = {
  title: 'Seasonbase HQ',
  description: 'Internal dashboard for signups and employer pipeline.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <div className="container">
            <header className="header">
              <div className="brand">
                <h1>Seasonbase HQ</h1>
                <p>Internal control panel for signups, destination demand and employer pipeline.</p>
              </div>
              <Nav />
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
