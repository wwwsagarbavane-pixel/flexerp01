import React, { useState } from 'react';
import { RefreshCw, Play, Plus } from 'lucide-react';

export default function MaterialTransactions() {
  const basket = [
    { comp: 'RM-FIB-001', lot: 'LOT-FIB-260915', bin: 'A-01-02', req: '3,187.500', prev: '0.000', thisIssue: '3,187.500', after: '3,187.500', status: 'Ready' },
    { comp: 'RM-RES-010', lot: 'LOT-RES-260901', bin: 'B-02-01', req: '467.125', prev: '0.000', thisIssue: '467.125', after: '467.125', status: 'Ready' },
    { comp: 'PKG-FILM-02', lot: 'LOT-FLM-260910', bin: 'C-01-04', req: '2,562.750', prev: '0.000', thisIssue: '2,212.750', after: '2,212.750', status: 'Short 350' },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Material Issue</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manufacturing &gt; Transactions &gt; Material Issue</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500' }}>Scan Mode</button>
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Post Issue</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Transaction Type</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>ISSUE</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Production Order</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>MO-000184</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Operation</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>10 - Mix and form</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Issue Warehouse</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>RM-TOL</p></div>
      </div>

      <div className="card-glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Scan or enter material</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Item / Barcode</label><input type="text" defaultValue="RM-FIB-001" style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Lot / Serial</label><input type="text" defaultValue="LOT-FIB-260915" style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} /></div>
          <div style={{ flex: 1 }}><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Issue Quantity</label><input type="text" defaultValue="3,187.500" style={{ padding: '10px', width: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} /></div>
          <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}><Plus size={16}/> Add</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Transaction basket</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px 8px' }}>Component</th>
              <th style={{ padding: '12px 8px' }}>Lot / Serial</th>
              <th style={{ padding: '12px 8px' }}>Bin</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Required</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>This Issue</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {basket.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>{c.comp}</td>
                <td style={{ padding: '12px 8px' }}>{c.lot}</td>
                <td style={{ padding: '12px 8px' }}>{c.bin}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>{c.req}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600', color: '#3b82f6' }}>{c.thisIssue}</td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}><span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: c.status === 'Ready' ? '#dcfce7' : '#fee2e2', color: c.status === 'Ready' ? '#16a34a' : '#ef4444' }}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
