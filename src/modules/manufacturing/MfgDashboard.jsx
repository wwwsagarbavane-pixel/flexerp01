import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function MfgDashboard() {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Manufacturing Dashboard</h1>
        <p style={{ color: 'var(--color-text-gray)' }}>Overview of plant performance and operations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Active Orders</h3>
            <Activity color="#3b82f6" size={20} />
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>42</p>
          <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>+3 from yesterday</p>
        </div>
        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Material Shortages</h3>
            <AlertTriangle color="#ef4444" size={20} />
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>14</p>
          <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>Requires attention</p>
        </div>
        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Yield Rate</h3>
            <CheckCircle2 color="#16a34a" size={20} />
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>98.2%</p>
          <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>On target</p>
        </div>
        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Machine Uptime</h3>
            <Clock color="#d97706" size={20} />
          </div>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>94.5%</p>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Last 7 days</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Recent Production Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 8px' }}>Order ID</th>
                <th style={{ padding: '12px 8px' }}>Item</th>
                <th style={{ padding: '12px 8px' }}>Quantity</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600', color: '#3b82f6' }}>MO-000184</td>
                <td style={{ padding: '12px 8px' }}>FG-INS-100</td>
                <td style={{ padding: '12px 8px' }}>2,500</td>
                <td style={{ padding: '12px 8px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: '#dbeafe', color: '#1d4ed8' }}>RELEASED</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600', color: '#3b82f6' }}>MO-000185</td>
                <td style={{ padding: '12px 8px' }}>FG-INS-200</td>
                <td style={{ padding: '12px 8px' }}>1,000</td>
                <td style={{ padding: '12px 8px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: '#fef3c7', color: '#b45309' }}>PLANNED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-glass" style={{ padding: '24px' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Alerts</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>
                 <AlertTriangle color="#ef4444" size={16} style={{ marginTop: '2px' }}/>
                 <div><p style={{ fontWeight: '600', fontSize: '13px', color: '#991b1b' }}>Material Shortage</p><p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>PKG-FILM-02 shortage for MO-184</p></div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: '#fffbeb', borderRadius: '8px' }}>
                 <AlertTriangle color="#d97706" size={16} style={{ marginTop: '2px' }}/>
                 <div><p style={{ fontWeight: '600', fontSize: '13px', color: '#b45309' }}>Machine Maintenance</p><p style={{ fontSize: '12px', color: '#d97706', marginTop: '4px' }}>OVEN-01 scheduled for PM tomorrow</p></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
