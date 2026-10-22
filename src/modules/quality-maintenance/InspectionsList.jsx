import React, { useState } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { useNavigate } from 'react-router-dom';

export default function InspectionsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const data = [
    { id: 'INSP-2609-041', type: 'In-Process', reference: 'MO-000184', item: 'FG-INS-100', status: 'In Progress', date: '2026-09-21' },
    { id: 'INSP-2609-042', type: 'Incoming', reference: 'PO-000210', item: 'RM-001', status: 'Passed', date: '2026-09-20' },
    { id: 'INSP-2609-043', type: 'Final', reference: 'MO-000180', item: 'FG-INS-200', status: 'Failed', date: '2026-09-19' }
  ];

  const filteredData = data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Inspections</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage quality inspections and testing.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px' }}><Download size={16} style={{marginRight:'8px'}}/> Export</button>
          <button className="btn-dark-pill" ><Plus size={18} style={{marginRight:'4px'}}/> New Inspection</button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '2px solid var(--color-primary)', paddingBottom: '18px', marginBottom: '-1px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>All Inspections</span>
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
            { key: 'id', label: 'Inspection Lot', render: val => <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate(`/app/quality-maintenance/inspections/${val}`)}>{val}</span> },
            { key: 'type', label: 'Type', render: val => val },
            { key: 'reference', label: 'Reference', render: val => val },
            { key: 'item', label: 'Item', render: val => val },
            { key: 'date', label: 'Date', render: val => val },
            { key: 'status', label: 'Status', render: val => {
                let badgeClass = 'badge-primary';
                if(val === 'Passed') badgeClass = 'badge-success';
                if(val === 'Failed') badgeClass = 'badge-danger';
                if(val === 'In Progress') badgeClass = 'badge-warning';
                return <span className={`status-badge ${badgeClass}`}>{val}</span>;
            }}
          ]} data={filteredData} />
        </div>
      </div>
    </div>
  );
}
