import React from 'react';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function Nonconformance() {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Nonconformance Record</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Quality &gt; Issues &gt; NCR-2026-0042</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500' }}>Hold Inventory</button>
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16}/> Submit NCR</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>NCR Number</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>NCR-2026-0042</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Date Identified</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>09/21/2026</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Reported By</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>J. Smith</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Source</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>Production (MO-184)</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Status</label><p style={{ fontWeight: '700', fontSize: '14px', marginTop: '4px', color: '#d97706' }}>NEW</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Issue Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Item Affected *</label>
                <input type="text" defaultValue="FG-INS-100" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
             </div>
             <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Quantity *</label>
                <input type="text" defaultValue="50 EA" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
             </div>
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Defect Code *</label>
             <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }}>
                <option>DIM-01 - Dimension out of tolerance</option>
             </select>
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Problem Description *</label>
             <textarea style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}>Board thickness measured at 2.10 inches on edge, exceeding maximum tolerance of 2.05 inches.</textarea>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Disposition</h3>
           <div>
             <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Action *</label>
             <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }}>
                <option>Pending MRB Review</option>
             </select>
           </div>
           
           <div style={{ marginTop: '16px', padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '1px dashed #ef4444' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#991b1b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16}/> Warning</h4>
              <p style={{ fontSize: '12px', color: '#991b1b', margin: 0 }}>This quantity must be moved to MRB location physically before NCR submission.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
