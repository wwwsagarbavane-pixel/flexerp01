import React, { useState } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';

export default function ModulesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  
  const [data, setData] = useState([
    { id: '1', name: 'Master Data', version: 'v2.1.0', companiesCount: 45, status: 'Active' },
    { id: '2', name: 'Procurement', version: 'v1.5.2', companiesCount: 30, status: 'Active' },
    { id: '3', name: 'Manufacturing', version: 'v3.0.1', companiesCount: 12, status: 'Active' },
    { id: '4', name: 'Quality & Maintenance', version: 'v1.0.0', companiesCount: 8, status: 'Active' },
    { id: '5', name: 'Sales', version: 'v2.0.0', companiesCount: 40, status: 'Active' },
    { id: '6', name: 'HR', version: 'v1.1.0', companiesCount: 25, status: 'Active' },
    { id: '7', name: 'Reports', version: 'v1.8.5', companiesCount: 45, status: 'Active' }
  ]);
  
  const filteredData = data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (!newModuleName) return;
    
    const newModule = {
      id: String(data.length + 1),
      name: newModuleName,
      version: 'v1.0.0',
      companiesCount: 0,
      status: 'Active'
    };
    
    setData([...data, newModule]);
    setNewModuleName('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Module Management</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage and provision ERP modules.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px' }}><Download size={16} style={{marginRight:'8px'}}/> Export</button>
          <button className="btn-dark-pill" onClick={() => setIsModalOpen(true)}><Plus size={18} style={{marginRight:'4px'}}/> Create New Module</button>
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
            { key: 'name', label: 'Module Name', render: val => val },
            { key: 'version', label: 'Version', render: val => val },
            { key: 'companiesCount', label: 'Active Companies', render: val => val },
            { key: 'status', label: 'Status', render: val => <span className={`status-badge ${val==='Active'?'badge-success':'badge-warning'}`}>{val}</span> }
          ]} data={filteredData} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Module">
        <form onSubmit={handleCreateModule}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Module Name *</label>
            <input 
              required 
              type="text" 
              value={newModuleName} 
              onChange={e => setNewModuleName(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} 
              placeholder="e.g. Project Management" 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline" style={{ background: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Create Module</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
