'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import type { SignupByDay, TopDestination } from '@/types/dashboard';

export function SignupsChart({ data }: { data: SignupByDay[] }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#b5c2d6', fontSize: 12 }} />
          <YAxis tick={{ fill: '#b5c2d6', fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#4fd1c5" fill="rgba(79,209,197,0.28)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopDestinationsChart({ data }: { data: TopDestination[] }) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#b5c2d6', fontSize: 12 }} allowDecimals={false} />
          <YAxis dataKey="destination" type="category" tick={{ fill: '#b5c2d6', fontSize: 12 }} width={120} />
          <Tooltip />
          <Bar dataKey="count" fill="#77e3d3" radius={[8, 8, 8, 8]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
