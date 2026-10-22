import React, { useState } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { useNavigate } from 'react-router-dom';

export default function NonconformanceList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const data = [
    { id: 'NCR-2026-0042', item: 'FG-INS-100', source: 'Production', reporter: 'J. Smith', status: 'New', date: '2026-09-21' },
    { id: 'NCR-2026-0041', item: 'RM-001', source: 'Incoming', reporter: 'A. Davis', status: 'Under Review', date: '2026-09-20' }
  ];

  const filteredData = data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Nonconformance Records</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage quality issues, defects and MRB.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px' }}><Download size={16} style={{marginRight:'8px'}}/> Export</button>
          <button className="btn-dark-pill" ><Plus size={18} style={{marginRight:'4px'}}/> Create NCR</button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '2px solid var(--color-primary)', paddingBottom: '18px', marginBottom: '-1px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>All NCRs</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>{filteredData.length}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '10px 16px 10px 40px', borderRadius: '40px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', width: '220px', fontSize: '14px' }} 
              />
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
            <button className="icon-btn-border" style={{ borderRadius: '50%', width: '40px', height: '40px' }}><Filter size={16}/></button>
          </div>
        </div>
        
        <div style={{ padding: '0 32px' }}>
          <DataTable columns={[
            { key: 'id', label: 'NCR No', render: val => <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate(`/app/quality-maintenance/nonconformance/${val}`)}>{val}</span> },
            { key: 'item', label: 'Item', render: val => val },
            { key: 'source', label: 'Source', render: val => val },
            { key: 'reporter', label: 'Reporter', render: val => val },
            { key: 'date', label: 'Date', render: val => val },
            { key: 'status', label: 'Status', render: val => {
                let badgeClass = 'badge-primary';
                if(val === 'New') badgeClass = 'badge-danger';
                if(val === 'Under Review') badgeClass = 'badge-warning';
                return <span className={`status-badge ${badgeClass}`}>{val}</span>;
            }}
          ]} data={filteredData} />
        </div>
      </div>
    </div>
  );
}
