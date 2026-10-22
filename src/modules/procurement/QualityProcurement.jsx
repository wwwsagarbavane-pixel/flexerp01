import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';

export default function ListScreen() {
  const store = useStore();
  const allData = store.procQuality || [];
  const currentUser = store.currentUser || { companyId: 'SYSTEM', role: 'Super Admin' };
  const data = currentUser.companyId === 'SYSTEM' ? allData : allData.filter(item => item.companyId === currentUser.companyId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({});

  const filteredData = data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  
  const handleExport = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(',');
    const csv = [headers, ...filteredData.map(row => Object.values(row).map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
  };

  const handleOpenModal = (mode, row = {}) => {
    setModalMode(mode);
    setFormData(mode === 'add' ? {} : { ...row });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      store.updateProcQuality(formData);
    } else if (modalMode === 'edit') {
      store.updateProcQuality(formData.id, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      store.deleteProcQuality(id);
    }
  };

  const tableCols = [
    { key: 'id', label: 'Inspection ID', render: val => val },
    { key: 'refId', label: 'GRN Reference', render: val => val },
    { key: 'item', label: 'Item', render: val => val },
    { key: 'qty', label: 'Quantity', render: val => val },
    { key: 'status', label: 'Status', render: val => <span className={`status-badge ${val==="Passed"?"badge-success":val==="Pending"?"badge-warning":"badge-danger"}`}>{val}</span> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/app/procurement/quality-procurement/${row.id || row.name || row.code}`} style={{ padding: '4px', color: '#64748b', display: 'flex' }}><Eye size={16} /></Link>
        <button onClick={() => handleOpenModal('edit', row)} style={{ padding: '4px', color: '#3b82f6' }}><Edit2 size={16} /></button>
        
      </div>
    )}
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Inbound Quality</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Procurement and receipt quality checks.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px' }}><Download size={16} style={{marginRight:'8px'}}/> Export</button>
          <button className="btn-dark-pill" onClick={() => handleOpenModal('add')}><Plus size={18} style={{marginRight:'4px'}}/> Add Inspection</button>
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
          <DataTable columns={tableCols} data={filteredData} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Inspection' : modalMode === 'edit' ? 'Edit Inspection' : 'View Inspection'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>GRN Reference *</label>
              
              <input 
                type="text" 
                value={formData.refId || ''} 
                onChange={e => setFormData({...formData, refId: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Item *</label>
              
              <input 
                type="text" 
                value={formData.item || ''} 
                onChange={e => setFormData({...formData, item: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Quantity *</label>
              
              <input 
                type="number" 
                value={formData.qty || ''} 
                onChange={e => setFormData({...formData, qty: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Inspection Date *</label>
              
              <input 
                type="date" 
                value={formData.date || ''} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Status *</label>
              
              <select value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value})} required className="form-input" disabled={modalMode === 'view'}>
                <option value="">Select...</option>
                <option value="Pending">Pending</option>
<option value="Passed">Passed</option>
<option value="Failed">Failed</option>
<option value="Quarantine">Quarantine</option>
              </select>
              
            </div>
          </div>
          
          {modalMode !== 'view' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
