import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Factory, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';

export default function ManufacturingOrders() {
  const store = useStore();
  const allData = store.productionOrders || [];
  const currentUser = store.currentUser || { companyId: 'SYSTEM', role: 'Super Admin' };
  const data = (currentUser.companyId === 'SYSTEM' ? allData : allData.filter(item => item.companyId === currentUser.companyId)).filter(item => item.status !== 'Planned');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '',
    item: '',
    qty: '',
    plant: '',
    bom: '',
    routing: '',
    startDate: '',
    dueDate: '',
    status: 'Released',
    progress: ''
  });

  const filteredData = data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));

  const handleOpenModal = (mode, row = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      const generatedId = `MO-26-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        id: generatedId,
        item: '',
        qty: '',
        plant: '',
        bom: '',
        routing: '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'Released',
        progress: ''
      });
    } else {
      setFormData({ ...row });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      await store.genericAdd('productionOrders', {
        ...formData,
        qty: formData.qty ? Number(formData.qty) : 1,
        progress: formData.progress ? Number(formData.progress) : 0,
        status: formData.status || 'Released'
      });
    } else {
      await store.genericUpdate('productionOrders', formData.id, {
        ...formData,
        qty: formData.qty ? Number(formData.qty) : 1,
        progress: formData.progress ? Number(formData.progress) : 0
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete order ${id}?`)) {
      await store.genericDelete('productionOrders', id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return { bg: '#dcfce7', color: '#166534' };
      case 'In Progress':
        return { bg: '#e0f2fe', color: '#0369a1' };
      case 'Released':
        return { bg: '#fef3c7', color: '#b45309' };
      default:
        return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Manufacturing Orders</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage active and released manufacturing orders.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            id="btn-new-order" 
            className="btn-dark-pill" 
            onClick={() => handleOpenModal('add')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Plus size={18} style={{ marginRight: '6px' }} /> New Order
          </button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '2px solid var(--color-primary)', paddingBottom: '18px', marginBottom: '-1px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>Active Orders</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>{filteredData.length}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                style={{ padding: '10px 16px 10px 40px', borderRadius: '40px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', width: '220px', fontSize: '14px' }} 
              />
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '11px', color: 'var(--color-text-gray)' }} />
            </div>
          </div>
        </div>

        <div style={{ padding: '0 32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-gray)' }}>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Item</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Quantity</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Plant</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Due Date</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Progress</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => {
                const badge = getStatusBadge(row.status);
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>{row.id}</td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{row.item}</td>
                    <td style={{ padding: '16px' }}>{row.qty?.toLocaleString() || row.qty}</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>{row.plant || 'Plant-Main'}</td>
                    <td style={{ padding: '16px' }}>{row.dueDate || '—'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', background: badge.bg, color: badge.color, fontSize: '12px', fontWeight: '600' }}>
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, Math.max(0, row.progress || 0))}%`, background: row.progress === 100 ? '#10b981' : '#3b82f6', height: '100%', borderRadius: '4px', transition: 'width 0.3s' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', minWidth: '32px' }}>{row.progress || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenModal('edit', row)} 
                          title="Edit Order"
                          style={{ padding: '6px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)} 
                          title="Delete Order"
                          style={{ padding: '6px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-gray)' }}>
                    No manufacturing orders found. Click "New Order" to create one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal for New / Edit Order */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'add' ? 'Create Manufacturing Order' : `Edit Order: ${formData.id}`}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Order ID *</label>
              <input 
                type="text" 
                value={formData.id || ''} 
                onChange={e => setFormData({ ...formData, id: e.target.value })} 
                required 
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                disabled={modalMode === 'edit'}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Item / Product *</label>
              <input 
                type="text" 
                value={formData.item || ''} 
                onChange={e => setFormData({ ...formData, item: e.target.value })} 
                required 
                placeholder="Enter product / item name"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Order Quantity *</label>
              <input 
                type="number" 
                min="1"
                value={formData.qty || ''} 
                onChange={e => setFormData({ ...formData, qty: e.target.value })} 
                required 
                placeholder="Enter quantity"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Plant / Shopfloor *</label>
              <select 
                value={formData.plant || ''} 
                onChange={e => setFormData({ ...formData, plant: e.target.value })} 
                required
                className="form-input"
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
              >
                <option value="">Select Plant / Shopfloor...</option>
                <option value="Plant-Main">Plant-Main</option>
                <option value="Plant-Electronics">Plant-Electronics</option>
                <option value="Plant-Molding">Plant-Molding</option>
                <option value="Assembly-Line-1">Assembly-Line-1</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>BOM Reference</label>
              <input 
                type="text" 
                value={formData.bom || ''} 
                onChange={e => setFormData({ ...formData, bom: e.target.value })} 
                placeholder="e.g. BOM-101 (optional)"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Routing Reference</label>
              <input 
                type="text" 
                value={formData.routing || ''} 
                onChange={e => setFormData({ ...formData, routing: e.target.value })} 
                placeholder="e.g. RT-101 (optional)"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Start Date *</label>
              <input 
                type="date" 
                value={formData.startDate || ''} 
                onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
                required 
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Due Date *</label>
              <input 
                type="date" 
                value={formData.dueDate || ''} 
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })} 
                required 
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Order Status *</label>
              <select 
                value={formData.status || 'Released'} 
                onChange={e => setFormData({ ...formData, status: e.target.value })} 
                className="form-input"
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
              >
                <option value="Released">Released</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Completion Progress (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                value={formData.progress !== undefined ? formData.progress : ''} 
                onChange={e => setFormData({ ...formData, progress: e.target.value })} 
                placeholder="e.g. 0 to 100"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button 
              type="button" 
              className="btn-outline" 
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ padding: '10px 24px', borderRadius: '8px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}
            >
              {modalMode === 'add' ? 'Create Order' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
