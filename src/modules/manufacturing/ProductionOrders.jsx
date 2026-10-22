import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';

export default function ListScreen() {
  const store = useStore();
  const allData = store.productionOrders || [];
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
      store.addProductionOrder(formData);
    } else if (modalMode === 'edit') {
      store.updateProductionOrder(formData.id, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      store.deleteProductionOrder(id);
    }
  };

  const tableCols = [
    { key: 'id', label: 'Order ID', render: val => val },
    { key: 'item', label: 'Item', render: val => val },
    { key: 'qty', label: 'Quantity', render: val => val },
    { key: 'status', label: 'Status', render: val => val },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/app/manufacturing/production-orders/${row.id || row.name || row.code}`} style={{ padding: '4px', color: '#64748b', display: 'flex' }}><Eye size={16} /></Link>
        <button onClick={() => handleOpenModal('edit', row)} style={{ padding: '4px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(row.id)} style={{ padding: '4px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Production Orders</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage active manufacturing orders.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px' }}><Download size={16} style={{marginRight:'8px'}}/> Export</button>
          <button className="btn-dark-pill" onClick={() => handleOpenModal('add')}><Plus size={18} style={{marginRight:'4px'}}/> Add Order</button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Order' : modalMode === 'edit' ? 'Edit Order' : 'View Order'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Finished Good *</label>
              
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
              <label>Target Qty *</label>
              
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
              <label>BOM *</label>
              
              <input 
                type="text" 
                value={formData.bom || ''} 
                onChange={e => setFormData({...formData, bom: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Routing *</label>
              
              <input 
                type="text" 
                value={formData.routing || ''} 
                onChange={e => setFormData({...formData, routing: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Start Date *</label>
              
              <input 
                type="date" 
                value={formData.startDate || ''} 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Due Date *</label>
              
              <input 
                type="date" 
                value={formData.dueDate || ''} 
                onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                required 
                className="form-input" 
                disabled={modalMode === 'view'}
              />
              
            </div>
            <div className="form-group" style={{ gridColumn: 'auto' }}>
              <label>Status *</label>
              
              <select value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value})} required className="form-input" disabled={modalMode === 'view'}>
                <option value="">Select...</option>
                <option value="Planned">Planned</option>
<option value="Released">Released</option>
<option value="In Progress">In Progress</option>
<option value="Completed">Completed</option>
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
