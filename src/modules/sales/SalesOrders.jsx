import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye, Receipt, ArrowRight } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';
import { useToastStore } from '../../data/toastStore';

export default function SalesOrders() {
  const store = useStore();
  const navigate = useNavigate();
  const addToast = useToastStore(state => state.addToast);
  const allData = store.salesOrders || [];
  const currentUser = store.currentUser || { companyId: 'SYSTEM', role: 'Super Admin' };
  const data = currentUser.companyId === 'SYSTEM' ? allData : allData.filter(item => item.companyId === currentUser.companyId);
  const companyCodes = store.companyCodes || [
    { code: '1000', name: 'Flex Manufacturing Corp' },
    { code: '2000', name: 'Flex Industries Europe Ltd' },
    { code: '3000', name: 'Flex Tech India Solutions' }
  ];

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
    a.download = 'sales_orders.csv';
    a.click();
  };

  const handleOpenModal = (mode, row = {}) => {
    setModalMode(mode);
    setFormData(mode === 'add' ? {
      companyCode: '1000',
      customer: 'Global AutoCorp',
      date: new Date().toISOString().slice(0, 10),
      deliveryDate: new Date(Date.now() + 20*24*60*60*1000).toISOString().slice(0, 10),
      total: 15000,
      status: 'Confirmed'
    } : { ...row });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      store.addSalesOrder({
        ...formData,
        id: formData.id || `SO-26-${Date.now().toString().slice(-4)}`,
        companyCode: formData.companyCode || '1000',
        total: parseFloat(formData.total || 0)
      });
      addToast('Sales Order created successfully!');
    } else if (modalMode === 'edit') {
      store.updateSalesOrder(formData.id, formData);
      addToast('Sales Order updated successfully!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      store.genericDelete('salesOrders', id);
      addToast('Sales Order deleted', 'info');
    }
  };

  const tableCols = [
    { key: 'id', label: 'Order ID', render: val => <span style={{ fontWeight: '700', color: '#0f172a' }}>{val}</span> },
    { key: 'customer', label: 'Customer', render: val => <span style={{ fontWeight: '600' }}>{val}</span> },
    { 
      key: 'companyCode', 
      label: 'Co. Code', 
      render: val => (
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '12px' }}>
          {val || '1000'}
        </span>
      ) 
    },
    { key: 'date', label: 'Order Date', render: val => val || '2026-10-01' },
    { key: 'total', label: 'Total Value', render: val => <span style={{ fontWeight: '700', color: '#047857' }}>${val}</span> },
    { key: 'status', label: 'Status', render: val => (
      <span className={`status-badge ${val === 'Confirmed' ? 'badge-success' : val === 'Draft' ? 'badge-warning' : 'badge-primary'}`}>
        {val}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/app/sales/billing', { state: { createForSO: row } })} 
          title="Bill Order in Billing Tab"
          style={{ padding: '4px 8px', borderRadius: '12px', background: 'rgba(249,115,22,0.1)', color: '#ea580c', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Receipt size={14} /> Bill
        </button>
        <Link to={`/app/sales/sales-orders/${row.id || row.name || row.code}`} style={{ padding: '4px', color: '#64748b', display: 'flex' }}><Eye size={16} /></Link>
        <button onClick={() => handleOpenModal('edit', row)} style={{ padding: '4px', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(row.id)} style={{ padding: '4px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c', background: 'rgba(234,88,12,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Sales & Distribution</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px', color: '#0f172a' }}>Sales Orders</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage customer orders, delivery commitments, and billings.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={() => navigate('/app/sales/billing')} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 20px', borderRadius: '40px', fontWeight: '600', color: '#ea580c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Receipt size={16} /> Open Billing Tab <ArrowRight size={14} />
          </button>
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px', cursor: 'pointer' }}>
            <Download size={16} style={{ marginRight: '8px' }}/> Export
          </button>
          <button className="btn-dark-pill" onClick={() => handleOpenModal('add')} style={{ cursor: 'pointer' }}>
            <Plus size={18} style={{ marginRight: '4px' }}/> Add Sales Order
          </button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 0 24px 0', background: '#ffffff', borderRadius: '24px' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderBottom: '2px solid var(--color-primary)', paddingBottom: '18px', marginBottom: '-1px' }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>All Orders</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>{filteredData.length}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search orders, customers..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '10px 16px 10px 40px', borderRadius: '40px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', width: '240px', fontSize: '14px' }} 
              />
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            </div>
          </div>
        </div>
        
        <div style={{ padding: '0 32px' }}>
          <DataTable columns={tableCols} data={filteredData} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Sales Order' : 'Edit Sales Order'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* REQUIREMENT: Company Code */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Company Code *</label>
              <select 
                value={formData.companyCode || '1000'} 
                onChange={e => setFormData({ ...formData, companyCode: e.target.value })}
                className="form-input"
                required
              >
                {companyCodes.map(cc => (
                  <option key={cc.code} value={cc.code}>{cc.code} - {cc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Customer Name *</label>
              <input 
                type="text" 
                value={formData.customer || ''} 
                onChange={e => setFormData({...formData, customer: e.target.value})} 
                required 
                className="form-input" 
                placeholder="e.g. Global AutoCorp"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Order Date *</label>
              <input 
                type="date" 
                value={formData.date || ''} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                required 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Delivery Date *</label>
              <input 
                type="date" 
                value={formData.deliveryDate || ''} 
                onChange={e => setFormData({...formData, deliveryDate: e.target.value})} 
                required 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Total Value ($) *</label>
              <input 
                type="number" 
                value={formData.total || ''} 
                onChange={e => setFormData({...formData, total: e.target.value})} 
                required 
                className="form-input" 
                placeholder="15000"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Status *</label>
              <select value={formData.status || 'Confirmed'} onChange={e => setFormData({...formData, status: e.target.value})} required className="form-input">
                <option value="Draft">Draft</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Ready to Dispatch">Ready to Dispatch</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
            <button type="submit" className="btn-dark-pill" style={{ cursor: 'pointer' }}>Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
