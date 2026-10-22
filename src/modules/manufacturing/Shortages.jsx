import React, { useState } from 'react';
import { Search, Filter, Download, AlertCircle, RefreshCw } from 'lucide-react';

export default function MaterialShortageWorkbench() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data from WF-MFG-08
  const shortages = [
    { id: 1, component: 'PKG-FILM-02', desc: 'Protective film', reqDate: '09/21', grossReq: '4,820', avail: '2,400', openPO: '1,000', short: '1,420', affected: 'MO-184, 186', action: 'Expedite PO-9081' },
    { id: 2, component: 'RM-RES-010', desc: 'Binder resin', reqDate: '09/22', grossReq: '1,880', avail: '1,120', openPO: '500', short: '260', affected: 'MO-190', action: 'Create planned PO' },
    { id: 3, component: 'PKG-LBL-01', desc: 'Product label', reqDate: '09/24', grossReq: '10,000', avail: '2,000', openPO: '0', short: '8,000', affected: 'MO-195, 196', action: 'Create planned PO' }
  ];

  const filteredShortages = shortages.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Material Shortages</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manufacturing &gt; Planning &gt; Material Shortages</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500' }}>
            <Download size={16} /> Export
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            <RefreshCw size={16} /> Run Availability Check
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Plant</label>
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
            <option>Toledo</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Horizon</label>
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
            <option>Next 14 days</option>
            <option>Next 30 days</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Order Status</label>
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
            <option>Planned, Released</option>
            <option>Released Only</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Buyer</label>
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
            <option>All</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', textAlign: 'right' }}>As Of</p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', textAlign: 'right' }}>09/19/2026 22:17</p>
        </div>
      </div>

      {/* Grid */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle color="#ef4444" size={20} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Active Shortages ({filteredShortages.length})</h3>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search components..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '250px', fontSize: '14px' }} 
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Component</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Required Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Gross Req</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Available</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Open PO</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: '#ef4444' }}>Shortage</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Affected Orders</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Suggested Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredShortages.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{item.component}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{item.desc}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#0f172a' }}>{item.reqDate}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#0f172a', textAlign: 'right' }}>{item.grossReq}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#16a34a', textAlign: 'right' }}>{item.avail}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3b82f6', textAlign: 'right' }}>{item.openPO}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '700', color: '#ef4444', textAlign: 'right' }}>{item.short}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#64748b' }}>{item.affected}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#f1f5f9', fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
