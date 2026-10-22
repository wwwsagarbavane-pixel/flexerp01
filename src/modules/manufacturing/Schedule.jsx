import React from 'react';
import { Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Schedule() {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Work Center Schedule</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manufacturing &gt; Planning &gt; Schedule Board</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="icon-btn-border" style={{ borderRadius: '8px', padding: '8px 12px' }}><Filter size={16}/> Filter</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }}>
             <button style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronLeft size={16}/></button>
             <span style={{ fontWeight: '600', fontSize: '14px', padding: '0 12px' }}>Sep 21, 2026</span>
             <button style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', width: '150px', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>Work Center</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>06:00</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>08:00</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>10:00</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>12:00</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>14:00</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>16:00</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '60px' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', borderRight: '1px solid #e2e8f0', background: '#f8fafc' }}>MIX-01</td>
              <td colSpan={2} style={{ padding: '4px', position: 'relative' }}>
                 <div style={{ background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '4px 8px', height: '100%', display: 'flex', alignItems: 'center', position: 'absolute', top: '8px', bottom: '8px', left: '4px', right: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af' }}>MO-184 (Op 10)</span>
                 </div>
              </td>
              <td colSpan={2} style={{ padding: '4px', position: 'relative' }}>
                 <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 8px', height: '100%', display: 'flex', alignItems: 'center', position: 'absolute', top: '8px', bottom: '8px', left: '4px', right: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>MO-185 (Op 10)</span>
                 </div>
              </td>
              <td colSpan={2}></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '60px' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', borderRight: '1px solid #e2e8f0', background: '#f8fafc' }}>OVEN-01</td>
              <td colSpan={1}></td>
              <td colSpan={3} style={{ padding: '4px', position: 'relative' }}>
                 <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 8px', height: '100%', display: 'flex', alignItems: 'center', position: 'absolute', top: '8px', bottom: '8px', left: '4px', right: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>MO-184 (Op 20)</span>
                 </div>
              </td>
              <td colSpan={2} style={{ padding: '4px', position: 'relative' }}>
                 <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '4px', padding: '4px 8px', height: '100%', display: 'flex', alignItems: 'center', position: 'absolute', top: '8px', bottom: '8px', left: '4px', right: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#92400e' }}>PM-102 (Maintenance)</span>
                 </div>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9', height: '60px' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', borderRight: '1px solid #e2e8f0', background: '#f8fafc' }}>LINE-01</td>
              <td colSpan={4}></td>
              <td colSpan={2} style={{ padding: '4px', position: 'relative' }}>
                 <div style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px 8px', height: '100%', display: 'flex', alignItems: 'center', position: 'absolute', top: '8px', bottom: '8px', left: '4px', right: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>MO-184 (Op 30)</span>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
