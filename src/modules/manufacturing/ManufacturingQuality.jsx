import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';

export default function ManufacturingQuality() {
  const store = useStore();
  const allData = store.inspections || [];
  const currentUser = store.currentUser || { companyId: 'SYSTEM', role: 'Super Admin' };
  const data = currentUser.companyId === 'SYSTEM' ? allData : allData.filter(item => item.companyId === currentUser.companyId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: '',
    ref: '',
    item: '',
    type: '',
    inspector: '',
    qty: '',
    defectQty: '',
    result: 'Pass',
    status: 'Completed'
  });

  const filteredData = data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())));

  const handleOpenModal = (mode, row = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      const generatedId = `INSP-26-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        id: generatedId,
        ref: '',
        item: '',
        type: '',
        inspector: '',
        qty: '',
        defectQty: '',
        result: 'Pass',
        status: 'Completed'
      });
    } else {
      setFormData({ 
        ...row,
        ref: row.ref || row.source || '',
        inspector: row.inspector || '',
        result: row.result || (row.status === 'Completed' ? 'Pass' : 'Pending')
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      await store.genericAdd('inspections', {
        ...formData,
        source: formData.ref || formData.source,
        qty: formData.qty ? Number(formData.qty) : 1,
        defectQty: formData.defectQty ? Number(formData.defectQty) : 0,
        result: formData.result || 'Pass',
        status: formData.status || 'Completed'
      });
    } else {
      await store.genericUpdate('inspections', formData.id, {
        ...formData,
        source: formData.ref || formData.source,
        qty: formData.qty ? Number(formData.qty) : 1,
        defectQty: formData.defectQty ? Number(formData.defectQty) : 0
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete inspection record ${id}?`)) {
      await store.genericDelete('inspections', id);
    }
  };

  const getResultBadge = (result, status) => {
    const res = result || (status === 'Completed' ? 'Pass' : 'Pending');
    if (res === 'Pass') {
      return { bg: '#dcfce7', color: '#166534', text: 'Pass' };
    }
    if (res === 'Fail') {
      return { bg: '#fee2e2', color: '#991b1b', text: 'Fail' };
    }
    return { bg: '#fef3c7', color: '#b45309', text: res || 'Pending' };
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Manufacturing Quality</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Review quality inspections for in-process, receiving, and finished goods.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            id="btn-new-inspection" 
            className="btn-dark-pill" 
            onClick={() => handleOpenModal('add')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Plus size={18} style={{ marginRight: '6px' }} /> New Inspection
          </button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '2px solid var(--color-primary)', paddingBottom: '18px', marginBottom: '-1px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>Inspections</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>{filteredData.length}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search inspections..." 
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
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Inspection ID</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Reference</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Item</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Inspector</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Result</th>
                <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => {
                const badge = getResultBadge(row.result, row.status);
                const ref = row.ref || row.source || '—';
                const inspector = row.inspector || '—';
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>{row.id}</td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{ref}</td>
                    <td style={{ padding: '16px' }}>{row.item || '—'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: '500' }}>
                        {row.type || 'Standard'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#64748b' }}>{inspector}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', background: badge.bg, color: badge.color, fontSize: '12px', fontWeight: '700' }}>
                        {badge.text}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenModal('edit', row)} 
                          title="Edit Inspection"
                          style={{ padding: '6px', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)} 
                          title="Delete Inspection"
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
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-gray)' }}>
                    No quality inspections found. Click "New Inspection" to log one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal for New / Edit Inspection */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'add' ? 'New Quality Inspection' : `Edit Inspection: ${formData.id}`}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Inspection ID *</label>
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
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Source / Order Reference *</label>
              <input 
                type="text" 
                value={formData.ref || ''} 
                onChange={e => setFormData({ ...formData, ref: e.target.value })} 
                required 
                placeholder="Enter Reference (e.g. MO-000184)"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Item Inspected *</label>
              <input 
                type="text" 
                value={formData.item || ''} 
                onChange={e => setFormData({ ...formData, item: e.target.value })} 
                required 
                placeholder="Enter item or component name"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Inspection Type *</label>
              <select 
                value={formData.type || ''} 
                onChange={e => setFormData({ ...formData, type: e.target.value })} 
                required
                className="form-input"
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
              >
                <option value="">Select Inspection Type...</option>
                <option value="In-Process">In-Process Inspection</option>
                <option value="Final">Final QC Inspection</option>
                <option value="Receiving">Receiving / Incoming QC</option>
                <option value="Packaging">Packaging QC</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Inspector Name *</label>
              <input 
                type="text" 
                value={formData.inspector || ''} 
                onChange={e => setFormData({ ...formData, inspector: e.target.value })} 
                required 
                placeholder="Enter inspector name or ID"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Sample / Tested Quantity *</label>
              <input 
                type="number" 
                min="1"
                value={formData.qty || ''} 
                onChange={e => setFormData({ ...formData, qty: e.target.value })} 
                required 
                placeholder="Enter sample quantity"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Defects Found (Qty)</label>
              <input 
                type="number" 
                min="0"
                value={formData.defectQty !== undefined ? formData.defectQty : ''} 
                onChange={e => setFormData({ ...formData, defectQty: e.target.value })} 
                placeholder="Enter defect quantity (optional)"
                className="form-input" 
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Inspection Result *</label>
              <select 
                value={formData.result || 'Pass'} 
                onChange={e => setFormData({ ...formData, result: e.target.value })} 
                className="form-input"
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: 'white' }}
              >
                <option value="Pass">Pass (Approved)</option>
                <option value="Fail">Fail (Rejected)</option>
                <option value="Conditional">Conditional / Under Review</option>
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
              {modalMode === 'add' ? 'Log Inspection' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
