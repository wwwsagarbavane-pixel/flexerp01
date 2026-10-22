import React from 'react';
import { Construction } from 'lucide-react';

export default function Placeholder({ title }) {
  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '80px', height: '80px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <Construction size={40} />
      </div>
      <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>{title}</h1>
      <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '400px', textAlign: 'center' }}>
        This super admin module is currently under construction and will be integrated with the new NestJS backend soon!
      </p>
    </div>
  );
}
