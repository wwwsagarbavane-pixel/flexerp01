import React, { useState } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import DataTable from '../../components/common/DataTable';

export default function AdminsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const data = [
    { id: '1', name: 'John System', email: 'john@flexerp.local', role: 'Super Admin', lastLogin: '2026-09-30 10:00 AM', status: 'Active' },
    { id: '2', name: 'Sarah Tech', email: 'sarah@flexerp.local', role: 'System Admin', lastLogin: '2026-09-29 02:30 PM', status: 'Active' }
  ];
  
  const filteredData = data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>System Admins</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage global system administrators.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px' }}><Download size={16} style={{marginRight:'8px'}}/> Export</button>
          <button className="btn-dark-pill" ><Plus size={18} style={{marginRight:'4px'}}/> Create New</button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '2px solid var(--color-primary)', paddingBottom: '18px', marginBottom: '-1px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>All Records</span>
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
            { key: 'name', label: 'Name', render: val => val },
            { key: 'email', label: 'Email', render: val => val },
            { key: 'role', label: 'Role', render: val => val },
            { key: 'lastLogin', label: 'Last Login', render: val => val },
            { key: 'status', label: 'Status', render: val => <span className={`status-badge ${val==='Active'?'badge-success':'badge-warning'}`}>{val}</span> }
          ]} data={filteredData} />
        </div>
      </div>
    </div>
  );
}
