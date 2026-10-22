import React from 'react';
import { Search, Filter, ShieldCheck, Play, CheckCircle2 } from 'lucide-react';

export default function Inspections() {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Inspection Execution</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Quality &gt; Execution &gt; Inspections</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500' }}>Save Draft</button>
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16}/> Complete Inspection</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Inspection Lot</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>INSP-2609-041</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Reference</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>MO-000184 (Op 40)</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Item</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>FG-INS-100</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Lot Size</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>2,430 EA</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Sample Size</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>15 EA</p></div>
      </div>

      <div className="card-glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Record Results</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px 8px', width: '20%' }}>Characteristic</th>
              <th style={{ padding: '12px 8px', width: '25%' }}>Specification</th>
              <th style={{ padding: '12px 8px', width: '20%' }}>Measured Value</th>
              <th style={{ padding: '12px 8px', width: '15%' }}>Result</th>
              <th style={{ padding: '12px 8px', width: '20%' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 8px', fontWeight: '600' }}>Overall dimensions</td>
              <td style={{ padding: '12px 8px', color: '#64748b' }}>48.0 x 96.0 in (+/- 0.125)</td>
              <td style={{ padding: '12px 8px' }}><input type="text" defaultValue="48.05 x 96.02" style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none' }} /></td>
              <td style={{ padding: '12px 8px' }}>
                 <select style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', background: '#dcfce7', color: '#16a34a', fontWeight: '600' }}>
                    <option>Pass</option>
                 </select>
              </td>
              <td style={{ padding: '12px 8px' }}><input type="text" placeholder="Optional" style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none' }} /></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 8px', fontWeight: '600' }}>Visual defect count</td>
              <td style={{ padding: '12px 8px', color: '#64748b' }}>&lt;= 3 minor defects per sheet</td>
              <td style={{ padding: '12px 8px' }}><input type="text" defaultValue="1" style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none' }} /></td>
              <td style={{ padding: '12px 8px' }}>
                 <select style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', background: '#dcfce7', color: '#16a34a', fontWeight: '600' }}>
                    <option>Pass</option>
                 </select>
              </td>
              <td style={{ padding: '12px 8px' }}><input type="text" placeholder="Optional" style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none' }} /></td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
           <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Usage Decision</h3>
           <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="radio" name="decision" defaultChecked /> Accept</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="radio" name="decision" /> Reject (Create NCR)</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="radio" name="decision" /> Rework</label>
           </div>
        </div>
      </div>
    </div>
  );
}
