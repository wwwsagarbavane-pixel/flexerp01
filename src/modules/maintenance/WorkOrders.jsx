import React from 'react';
import { Wrench, Clock, Play, CheckCircle2 } from 'lucide-react';

export default function WorkOrders() {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Maintenance Work Order</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Maintenance &gt; Work Orders &gt; PM-2609-102</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><Play size={16}/> Start Work</button>
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16}/> Complete Order</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Order Number</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>PM-2609-102</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Work Center</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>OVEN-01</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Type</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>Preventive</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Scheduled For</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>09/22/2026</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Status</label><p style={{ fontWeight: '700', fontSize: '14px', marginTop: '4px', color: '#64748b' }}>RELEASED</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Task List</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 8px', width: '10%' }}>Seq</th>
                <th style={{ padding: '12px 8px', width: '50%' }}>Description</th>
                <th style={{ padding: '12px 8px', width: '20%' }}>Est Hours</th>
                <th style={{ padding: '12px 8px', width: '20%', textAlign: 'center' }}>Done</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px' }}>10</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>Lock out tag out procedure</td>
                <td style={{ padding: '12px 8px', color: '#64748b' }}>0.5</td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}><input type="checkbox" style={{ width: '16px', height: '16px' }}/></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px' }}>20</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>Inspect heating elements</td>
                <td style={{ padding: '12px 8px', color: '#64748b' }}>1.5</td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}><input type="checkbox" style={{ width: '16px', height: '16px' }}/></td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px' }}>30</td>
                <td style={{ padding: '12px 8px', fontWeight: '600' }}>Calibrate temperature sensors</td>
                <td style={{ padding: '12px 8px', color: '#64748b' }}>1.0</td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}><input type="checkbox" style={{ width: '16px', height: '16px' }}/></td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ marginTop: '24px' }}>
             <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Report Time</h3>
             <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                   <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Technician</label>
                   <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }}>
                      <option>M. Davis</option>
                   </select>
                </div>
                <div style={{ flex: 1 }}>
                   <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Hours Worked</label>
                   <input type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
                </div>
                <button className="btn-outline" style={{ background: 'white', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500' }}>Add Time</button>
             </div>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Required Materials</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f1f5f9', borderRadius: '8px' }}>
                 <div>
                    <p style={{ fontWeight: '600', fontSize: '13px' }}>SP-HTR-400</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Heating element</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600', fontSize: '13px' }}>2 EA</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Issued</p>
                 </div>
              </div>
           </div>
           
           <button className="btn-outline" style={{ background: 'white', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500', width: '100%', marginTop: 'auto' }}>Request Material</button>
        </div>
      </div>
    </div>
  );
}
