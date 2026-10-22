import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Plus, Filter, Download, Edit2, Trash2, Eye , Search } from 'lucide-react';
import { useStore } from '../../data/mockStore';
import { useToastStore } from '../../data/toastStore';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';

export default function ManufacturingMaster() {
  const { manufacturingItems, addMfgItem, updateMfgItem, deleteMfgItem } = useStore();
  const addToast = useToastStore(state => state.addToast);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ code: '', name: '', type: 'Finished Good', uom: 'pcs', routing: '', status: 'Active' });

  const activeCount = manufacturingItems.filter(i => (i.status || 'Active') === 'Active').length;
  const archivedCount = manufacturingItems.filter(i => (i.status || 'Active') !== 'Active').length;

  const filteredData = manufacturingItems.filter(item => {
    const isAct = (item.status || 'Active') === 'Active';
    if (statusFilter === 'Active') return isAct;
    if (statusFilter === 'Archived') return !isAct;
    return true;
  }).filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.code.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleOpenModal = (mode, data = null) => {
    setModalMode(mode);
    if (data) {
      setFormData(data);
    } else {
      setFormData({ code: '', name: '', type: 'Finished Good', uom: 'pcs', routing: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      addToast('Please fill all required fields.', 'error');
      return;
    }
    
    if (modalMode === 'add') {
      addMfgItem(formData);
      addToast('Manufacturing Item added successfully.');
    } else if (modalMode === 'edit') {
      updateMfgItem(formData.id, formData);
      addToast('Manufacturing Item updated successfully.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMfgItem(id);
      addToast('Manufacturing Item deleted.');
    }
  };

  const tableCols = [
    { key: 'code', label: 'Item Code' },
    { key: 'name', label: 'Item Name' },
    { key: 'type', label: 'Product Type' },
    { key: 'uom', label: 'UOM' },
    { key: 'routing', label: 'Default Routing' },
    { key: 'status', label: 'Status', render: (val) => {
      const cls = val === 'Active' ? 'badge-success' : 'badge-primary';
      return <span className={`status-badge ${cls}`}>{val}</span>;
    }},
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/app/master-data/manufacturing-master/${row.id || row.name || row.code}`} style={{ padding: '4px', color: '#64748b', display: 'flex' }}><Eye size={16} /></Link>
        <button onClick={() => handleOpenModal('edit', row)} style={{ padding: '4px', color: '#3b82f6' }}><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(row.id || row.name || row.code)} style={{ padding: '4px', color: '#ef4444' }}><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                              <div className="flex-between" style={{ padding: '8px 0' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Manufacturing Master</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage finished goods, sub-assemblies and routings.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px' }}><Download size={16} style={{marginRight:'8px'}}/> Export</button>
          <button className="btn-dark-pill" onClick={() => handleOpenModal('add')}><Plus size={18} style={{marginRight:'4px'}}/> Add Item</button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div 
              onClick={() => setStatusFilter('All')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                borderBottom: statusFilter === 'All' ? '2px solid var(--color-primary)' : '2px solid transparent', 
                paddingBottom: '18px', marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: statusFilter === 'All' ? '700' : '600', fontSize: '14px', color: statusFilter === 'All' ? 'var(--color-primary)' : 'var(--color-text-gray)' }}>All Records</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: statusFilter === 'All' ? 'var(--color-primary)' : 'var(--color-text-gray)' }}>{manufacturingItems.length}</span>
            </div>
            <div 
              onClick={() => setStatusFilter('Active')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                borderBottom: statusFilter === 'Active' ? '2px solid var(--color-primary)' : '2px solid transparent', 
                paddingBottom: '18px', marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: statusFilter === 'Active' ? '700' : '600', fontSize: '14px', color: statusFilter === 'Active' ? 'var(--color-primary)' : 'var(--color-text-gray)' }}>Active</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: statusFilter === 'Active' ? 'var(--color-primary)' : 'var(--color-text-gray)' }}>{activeCount}</span>
            </div>
            <div 
              onClick={() => setStatusFilter('Archived')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                borderBottom: statusFilter === 'Archived' ? '2px solid var(--color-primary)' : '2px solid transparent', 
                paddingBottom: '18px', marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: statusFilter === 'Archived' ? '700' : '600', fontSize: '14px', color: statusFilter === 'Archived' ? 'var(--color-primary)' : 'var(--color-text-gray)' }}>Archived</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: statusFilter === 'Archived' ? 'var(--color-primary)' : 'var(--color-text-gray)' }}>{archivedCount}</span>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Manufacturing Item' : modalMode === 'edit' ? 'Edit Item' : 'View Item'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Item Code *</label>
            <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} disabled={modalMode === 'view'} required className="form-input" />
          </div>
          <div className="form-group">
            <label>Item Name *</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={modalMode === 'view'} required className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Product Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} disabled={modalMode === 'view'} className="form-input">
                <option value="Finished Good">Finished Good</option>
                <option value="Sub-Assembly">Sub-Assembly</option>
                <option value="Component">Component</option>
              </select>
            </div>
            <div className="form-group">
              <label>UOM</label>
              <select value={formData.uom} onChange={e => setFormData({...formData, uom: e.target.value})} disabled={modalMode === 'view'} className="form-input">
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="ltr">ltr</option>
                <option value="meters">meters</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Default Routing</label>
              <input type="text" value={formData.routing} onChange={e => setFormData({...formData, routing: e.target.value})} disabled={modalMode === 'view'} className="form-input" placeholder="e.g. RT-001" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} disabled={modalMode === 'view'} className="form-input">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Obsolete">Obsolete</option>
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
