import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock, CheckCircle2, User, Wrench } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';

export default function ManufacturingProcess() {
  const store = useStore();
  const allData = store.operations || [];
  const currentUser = store.currentUser || { companyId: 'SYSTEM', role: 'Super Admin' };
  const data = currentUser.companyId === 'SYSTEM' ? allData : allData.filter(item => item.companyId === currentUser.companyId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '',
    prodOrder: '',
    op: '',
    wc: '',
    operator: '',
    status: 'Started',
    plannedQty: '',
    goodQty: '',
    scrapQty: ''
  });

  const filteredData = data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));

  const handleOpenModal = (mode, row = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      const generatedId = `OP-26-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        id: generatedId,
        prodOrder: '',
        op: '',
        wc: '',
        operator: '',
        status: 'Started',
        plannedQty: '',
        goodQty: '',
        scrapQty: ''
      });
    } else {
      setFormData({ ...row });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      await store.genericAdd('operations', {
        ...formData,
        op: formData.op ? Number(formData.op) : 10,
        plannedQty: formData.plannedQty ? Number(formData.plannedQty) : 0,
        goodQty: formData.goodQty ? Number(formData.goodQty) : 0,
        scrapQty: formData.scrapQty ? Number(formData.scrapQty) : 0,
        status: formData.status || 'Started'
      });
    } else {
      await store.genericUpdate('operations', formData.id, {
        ...formData,
        op: formData.op ? Number(formData.op) : 10,
        plannedQty: formData.plannedQty ? Number(formData.plannedQty) : 0,
        goodQty: formData.goodQty ? Number(formData.goodQty) : 0,
        scrapQty: formData.scrapQty ? Number(formData.scrapQty) : 0
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete operation record ${id}?`)) {
      await store.genericDelete('operations', id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return { bg: '#dcfce7', color: '#166534' };
      case 'Started':
      case 'In Progress':
        return { bg: '#e0f2fe', color: '#0369a1' };
      case 'Pending':
        return { bg: '#fef3c7', color: '#b45309' };
      default:
        return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Manufacturing Process</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Track live production operations, work centers, and time recording.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            id="btn-record-time" 
            className="btn-dark-pill" 
            onClick={() => handleOpenModal('add')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Plus size={18} style={{ marginRight: '6px' }} /> Record Time
          </button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '2px solid var(--color-primary)', paddingBottom: '18px', marginBottom: '-1px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>Live Operations</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>{filteredData.length}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search operations..." 
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
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Operation ID</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Order Ref</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Step #</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Work Center</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Operator</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Good Qty</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Scrap</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => {
                const badge = getStatusBadge(row.status);
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>{row.id}</td>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{row.prodOrder || '—'}</td>
                    <td style={{ padding: '16px' }}>Step {row.op || 10}</td>
                    <td style={{ padding: '16px', color: '#64748b', fontWeight: '500' }}>{row.wc || '—'}</td>
                    <td style={{ padding: '16px' }}>{row.operator || '—'}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#16a34a' }}>
                      {row.goodQty ?? '—'} <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ {row.plannedQty || '—'}</span>
                    </td>
                    <td style={{ padding: '16px', color: row.scrapQty > 0 ? '#ef4444' : '#64748b' }}>
                      {row.scrapQty ?? 0}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', background: badge.bg, color: badge.color, fontSize: '12px', fontWeight: '600' }}>
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenModal('edit', row)} 
                          title="Edit Operation"
                          style={{ padding: '6px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)} 
                          title="Delete Operation"
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
                  <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-gray)' }}>
                    No operations recorded yet. Click "Record Time" to log progress!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal for Record Time / Add Operation */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'add' ? 'Record Operation Time & Output' : `Edit Operation: ${formData.id}`}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Operation ID *</label>
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
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Production Order *</label>
              <input 
                type="text" 
                value={formData.prodOrder || ''} 
                onChange={e => setFormData({ ...formData, prodOrder: e.target.value })} 
                required 
                placeholder="Enter Order ID (e.g. MO-000184)"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Work Center *</label>
              <select 
                value={formData.wc || ''} 
                onChange={e => setFormData({ ...formData, wc: e.target.value })} 
                required
                className="form-input"
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
              >
                <option value="">Select Work Center...</option>
                <option value="WC-SMT">WC-SMT (Surface Mount)</option>
                <option value="WC-TEST">WC-TEST (Testing & QA)</option>
                <option value="WC-MOLD">WC-MOLD (Injection Molding)</option>
                <option value="WC-LASER">WC-LASER (Laser Cutting)</option>
                <option value="WC-PRESS">WC-PRESS (Bending & Press)</option>
                <option value="WC-ASSM">WC-ASSM (Final Assembly)</option>
                <option value="WC-PACK">WC-PACK (Packaging)</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Step # / Sequence</label>
              <input 
                type="number" 
                value={formData.op || ''} 
                onChange={e => setFormData({ ...formData, op: e.target.value })} 
                placeholder="e.g. 10, 20, 30"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Operator / Badge *</label>
              <input 
                type="text" 
                value={formData.operator || ''} 
                onChange={e => setFormData({ ...formData, operator: e.target.value })} 
                required 
                placeholder="Enter operator name or badge ID"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Planned Quantity</label>
              <input 
                type="number" 
                min="0"
                value={formData.plannedQty || ''} 
                onChange={e => setFormData({ ...formData, plannedQty: e.target.value })} 
                placeholder="Enter planned quantity"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Good / Completed Quantity *</label>
              <input 
                type="number" 
                min="0"
                value={formData.goodQty !== undefined ? formData.goodQty : ''} 
                onChange={e => setFormData({ ...formData, goodQty: e.target.value })} 
                required 
                placeholder="Enter completed units"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Scrap / Rejected Quantity</label>
              <input 
                type="number" 
                min="0"
                value={formData.scrapQty !== undefined ? formData.scrapQty : ''} 
                onChange={e => setFormData({ ...formData, scrapQty: e.target.value })} 
                placeholder="Enter scrap quantity (optional)"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Operation Status *</label>
              <select 
                value={formData.status || 'Started'} 
                onChange={e => setFormData({ ...formData, status: e.target.value })} 
                className="form-input"
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
              >
                <option value="Started">Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
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
              {modalMode === 'add' ? 'Record Operation' : 'Update Operation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
