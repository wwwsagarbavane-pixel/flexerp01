import React, { useState } from 'react';
import { ChevronLeft, Save, CheckCircle2 } from 'lucide-react';

export default function Routings() {
  const [activeTab, setActiveTab] = useState('operations');

  const operations = [
    { seq: 10, op: 'Mix and form', wc: 'MIX-01', setup: '0.50', run: '0.0012', queue: '1.0', move: '0.3', out: 'No', qg: 'In-process sample' },
    { seq: 20, op: 'Cure', wc: 'OVEN-01', setup: '0.75', run: '0.0018', queue: '0.5', move: '0.2', out: 'No', qg: 'Temperature record' },
    { seq: 30, op: 'Cut and pack', wc: 'LINE-01', setup: '0.40', run: '0.0009', queue: '0.2', move: '0.1', out: 'No', qg: 'Visual check' },
    { seq: 40, op: 'Final inspection', wc: 'QA-FINAL', setup: '0.10', run: '0.0002', queue: '0.0', move: '0.1', out: 'No', qg: 'Final release' },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>RT-INS-100 / Rev B</h1>
            <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>DRAFT REVISION</span>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manufacturing &gt; Engineering &gt; Routings &gt; RT-INS-100</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ background: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Copy Revision</button>
          <button className="btn-outline" style={{ background: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}><Save size={16}/> Save Draft</button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}><CheckCircle2 size={16}/> Submit for Approval</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Routing Code*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>RT-INS-100</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Item*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>FG-INS-100</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Revision*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>B</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Lot Size</p><p style={{ fontWeight: '600', fontSize: '14px' }}>1,000 EA</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Effective From*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>10/01/2026</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Change Reason*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>Added final inspection</p></div>
      </div>

      <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '32px' }}>
        {['Header', 'Operations', 'Resources', 'Cost Preview', 'Approvals', 'Audit'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ paddingBottom: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', borderBottom: activeTab === tab.toLowerCase() ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === tab.toLowerCase() ? '#3b82f6' : '#64748b' }}>{tab}</div>
        ))}
      </div>

      {activeTab === 'operations' && (
        <div className="card-glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Operations</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>+ Add Operation</button>
              <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Renumber</button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 8px' }}>Seq*</th>
                <th style={{ padding: '12px 8px' }}>Operation*</th>
                <th style={{ padding: '12px 8px' }}>Work Center*</th>
                <th style={{ padding: '12px 8px' }}>Setup Hrs</th>
                <th style={{ padding: '12px 8px' }}>Run Hrs/Unit</th>
                <th style={{ padding: '12px 8px' }}>Queue Hrs</th>
                <th style={{ padding: '12px 8px' }}>Move Hrs</th>
                <th style={{ padding: '12px 8px' }}>Outside</th>
                <th style={{ padding: '12px 8px' }}>Quality Gate</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px' }}>{c.seq}</td>
                  <td style={{ padding: '12px 8px', fontWeight: '600', color: '#0f172a' }}>{c.op}</td>
                  <td style={{ padding: '12px 8px', color: '#64748b' }}>{c.wc}</td>
                  <td style={{ padding: '12px 8px' }}>{c.setup}</td>
                  <td style={{ padding: '12px 8px' }}>{c.run}</td>
                  <td style={{ padding: '12px 8px' }}>{c.queue}</td>
                  <td style={{ padding: '12px 8px' }}>{c.move}</td>
                  <td style={{ padding: '12px 8px' }}>{c.out}</td>
                  <td style={{ padding: '12px 8px', color: '#3b82f6', fontWeight: '500' }}>{c.qg}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '32px', display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1, padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
               <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Calculated Preview</h4>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}><span style={{ color: '#64748b' }}>Estimated conversion cost</span><span style={{ fontWeight: '600' }}>$1,428.00 / Order</span></div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#64748b' }}>Estimated cost per unit</span><span style={{ fontWeight: '600' }}>$1.4280</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
