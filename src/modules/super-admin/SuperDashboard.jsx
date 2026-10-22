import React from 'react';
import { Building2, Users, Box, ShieldCheck, Activity, ArrowUpRight, Crown } from 'lucide-react';
import { useStore } from '../../data/mockStore';

export default function SuperDashboard() {
  const store = useStore();
  const companies = store.companies || [];
  const systemAdmins = store.systemAdmins || [];

  const kpis = [
    { label: 'Total Companies', value: companies.length, trend: '+2', icon: Building2, color: '#4f46e5', bg: '#e0e7ff' },
    { label: 'Active Companies', value: companies.filter(c => c.status === 'Active').length, trend: '0', icon: Activity, color: '#10b981', bg: '#dcfce7' },
    { label: 'Total Admins', value: systemAdmins.length, trend: '+1', icon: Users, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'System Alerts', value: '0', trend: 'Healthy', icon: ShieldCheck, color: '#3b82f6', bg: '#dbeafe' },
  ];

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100%', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={20} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', margin: 0 }}>Super Admin Dashboard</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '15px' }}>Global System Control Center & Multi-tenant Overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ 
            padding: '24px', background: 'white', borderRadius: '24px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0',
            position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={24} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: kpi.color, background: `${kpi.bg}80`, padding: '6px 12px', borderRadius: '20px' }}>
                {kpi.trend}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>{kpi.label}</p>
              <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' }}>{kpi.value}</h2>
            </div>
            {/* Subtle Gradient Glow in background */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: kpi.color, opacity: 0.05, filter: 'blur(30px)', borderRadius: '50%' }}></div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>Recent Tenant Activity</h3>
          <button style={{ padding: '8px 16px', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>View All</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {companies.map((c, i) => (
            <div key={c.id} style={{ 
              padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.05)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#475569', fontSize: '14px' }}>
                  {c.code}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{c.name}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{c.industry} ERP Workspace • Created {c.created}</p>
                </div>
              </div>
              <span style={{ 
                padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                background: c.status === 'Active' ? '#dcfce7' : '#fee2e2',
                color: c.status === 'Active' ? '#16a34a' : '#dc2626',
                border: `1px solid ${c.status === 'Active' ? '#bbf7d0' : '#fecaca'}`
              }}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
