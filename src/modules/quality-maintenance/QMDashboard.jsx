import React from 'react';
import { Hexagon, Settings, ShieldCheck, Activity } from 'lucide-react';

export default function QMDashboard() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Quality & Maintenance</h1>
        <p style={{ color: 'var(--color-text-gray)' }}>Overview of quality inspections and maintenance metrics.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {[
          { label: 'Pending Inspections', value: '12', icon: <ShieldCheck size={20} color="#3b82f6" /> },
          { label: 'Open NCRs', value: '3', icon: <Activity size={20} color="#ef4444" /> },
          { label: 'Preventive Tasks', value: '5', icon: <Settings size={20} color="#10b981" /> },
          { label: 'Breakdowns', value: '1', icon: <Hexagon size={20} color="#f59e0b" /> },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-gray)' }}>{stat.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
