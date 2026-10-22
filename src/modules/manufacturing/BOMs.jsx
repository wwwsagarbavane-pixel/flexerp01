import React, { useState } from 'react';
import { ChevronLeft, Save, Play, CheckCircle2, AlertTriangle, FileText, Upload } from 'lucide-react';

export default function BOMEditor() {
  const [activeTab, setActiveTab] = useState('components');

  const components = [
    { line: 10, item: 'RM-FIB-001', desc: 'Glass fiber', qty: '1.250000', uom: 'LB', scrap: '2.0%', issue: 'Backflush', op: '10', sub: '', eff: '10/01/26' },
    { line: 20, item: 'RM-RES-010', desc: 'Binder resin', qty: '0.185000', uom: 'LB', scrap: '1.0%', issue: 'Backflush', op: '10', sub: '', eff: '10/01/26' },
    { line: 30, item: 'PKG-FILM-02', desc: 'Protective film', qty: '1.020000', uom: 'EA', scrap: '0.5%', issue: 'Manual', op: '30', sub: 'FILM-A', eff: '10/01/26' },
    { line: 40, item: 'PKG-LBL-01', desc: 'Product label', qty: '1.000000', uom: 'EA', scrap: '0.0%', issue: 'Manual', op: '30', sub: '', eff: '10/01/26' },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>BOM-INS-100 / Rev C</h1>
            <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>DRAFT REVISION</span>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manufacturing &gt; Engineering &gt; BOM &gt; BOM-INS-100</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ background: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Compare Revisions</button>
          <button className="btn-outline" style={{ background: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}><Save size={16}/> Save Draft</button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}><CheckCircle2 size={16}/> Submit for Approval</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>BOM Code*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>BOM-INS-100</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Parent Item*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>FG-INS-100 | Insulation Board</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Revision*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>C</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Base Quantity*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>1.000 EA</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Effective From*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>10/01/2026</p></div>
        <div><p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Change Reason*</p><p style={{ fontWeight: '600', fontSize: '14px' }}>Packaging material update</p></div>
      </div>

      <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '32px' }}>
        {['Header', 'Components', 'Where Used', 'Attachments', 'Approvals', 'Audit'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ paddingBottom: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', borderBottom: activeTab === tab.toLowerCase() ? '2px solid #3b82f6' : '2px solid transparent', color: activeTab === tab.toLowerCase() ? '#3b82f6' : '#64748b' }}>{tab}</div>
        ))}
      </div>

      {activeTab === 'components' && (
        <div className="card-glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Components</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>+ Add Component</button>
              <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Import</button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 8px' }}>Line</th>
                <th style={{ padding: '12px 8px' }}>Component Item</th>
                <th style={{ padding: '12px 8px' }}>Description</th>
                <th style={{ padding: '12px 8px' }}>Qty / Base</th>
                <th style={{ padding: '12px 8px' }}>UOM</th>
                <th style={{ padding: '12px 8px' }}>Scrap %</th>
                <th style={{ padding: '12px 8px' }}>Issue Method</th>
                <th style={{ padding: '12px 8px' }}>Op</th>
              </tr>
            </thead>
            <tbody>
              {components.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px' }}>{c.line}</td>
                  <td style={{ padding: '12px 8px', fontWeight: '600', color: '#0f172a' }}>{c.item}</td>
                  <td style={{ padding: '12px 8px', color: '#64748b' }}>{c.desc}</td>
                  <td style={{ padding: '12px 8px' }}>{c.qty}</td>
                  <td style={{ padding: '12px 8px' }}>{c.uom}</td>
                  <td style={{ padding: '12px 8px' }}>{c.scrap}</td>
                  <td style={{ padding: '12px 8px' }}>{c.issue}</td>
                  <td style={{ padding: '12px 8px' }}>{c.op}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Validation and impact</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px' }}>Check</th>
                  <th style={{ padding: '12px 8px' }}>Result</th>
                  <th style={{ padding: '12px 8px' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px' }}>Circular BOM</td>
                  <td style={{ padding: '12px 8px', color: '#16a34a', fontWeight: '600' }}>Pass</td>
                  <td style={{ padding: '12px 8px', color: '#64748b' }}>No recursion detected</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px' }}>Cost rollup</td>
                  <td style={{ padding: '12px 8px', color: '#d97706', fontWeight: '600' }}>Warning</td>
                  <td style={{ padding: '12px 8px', color: '#64748b' }}>Estimated cost +3.4% versus Rev B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
