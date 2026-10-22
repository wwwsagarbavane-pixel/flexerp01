import React from 'react';
import { Pause, CheckCircle2 } from 'lucide-react';

export default function Operations() {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>MO-000184 &gt; Operation 10</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manufacturing &gt; Shop Floor &gt; Operation Reporting</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><Pause size={16}/> Pause</button>
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16}/> Complete Operation</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Production Order</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>MO-000184</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Operation</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>10 - Mix and form</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Work Center</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>MIX-01</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Started At</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>09/21/2026 06:08</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Status</label><p style={{ fontWeight: '700', fontSize: '14px', marginTop: '4px', color: '#1d4ed8' }}>IN PROCESS</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px' }}>Report production</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Good Quantity*</label>
              <input type="text" defaultValue="2,430" style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Scrap Quantity</label>
              <input type="text" defaultValue="70" style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Setup Hours</label>
              <input type="text" defaultValue="0.55" style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Run Hours</label>
              <input type="text" defaultValue="2.24" style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Scrap Reason</label>
              <select style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
                <option>Edge defect</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>In-process quality checks</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 8px' }}>Characteristic</th>
                <th style={{ padding: '12px 8px' }}>Specification</th>
                <th style={{ padding: '12px 8px' }}>Sample 1</th>
                <th style={{ padding: '12px 8px' }}>Sample 2</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>Density</td>
                <td style={{ padding: '12px 8px', color: '#64748b' }}>2.30 - 2.50 PCF</td>
                <td style={{ padding: '12px 8px' }}>2.41</td>
                <td style={{ padding: '12px 8px' }}>2.43</td>
                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#16a34a', fontWeight: '600' }}>Pass</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>Thickness</td>
                <td style={{ padding: '12px 8px', color: '#64748b' }}>1.95 - 2.05 in</td>
                <td style={{ padding: '12px 8px' }}>2.01</td>
                <td style={{ padding: '12px 8px' }}>2.00</td>
                <td style={{ padding: '12px 8px', textAlign: 'center', color: '#16a34a', fontWeight: '600' }}>Pass</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
