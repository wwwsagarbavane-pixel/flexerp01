import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye, Building2, Globe, DollarSign, ShieldCheck } from 'lucide-react';
import { useStore } from '../../data/mockStore';
import { useToastStore } from '../../data/toastStore';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';

export default function CompanyCodes() {
  const store = useStore();
  const addToast = useToastStore(state => state.addToast);
  const companyCodes = store.companyCodes || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    currency: 'USD',
    country: 'United States',
    city: '',
    taxId: '',
    chartOfAccounts: 'COA-GLOBAL',
    status: 'Active'
  });

  const activeCount = companyCodes.filter(c => (c.status || 'Active') === 'Active').length;
  const archivedCount = companyCodes.filter(c => (c.status || 'Active') !== 'Active').length;

  const filteredData = companyCodes.filter(item => {
    const isAct = (item.status || 'Active') === 'Active';
    if (statusFilter === 'Active') return isAct;
    if (statusFilter === 'Archived') return !isAct;
    return true;
  }).filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExport = () => {
    if (filteredData.length === 0) return;
    const headers = ['Code', 'Company Name', 'Currency', 'Country', 'City', 'Tax ID', 'Chart of Accounts', 'Status'];
    const csvRows = filteredData.map(r => `"${r.code}","${r.name}","${r.currency}","${r.country}","${r.city || ''}","${r.taxId || ''}","${r.chartOfAccounts || ''}","${r.status}"`);
    const csv = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company_codes.csv';
    a.click();
  };

  const handleOpenModal = (mode, row = null) => {
    setModalMode(mode);
    if (row) {
      setFormData({ ...row });
    } else {
      setFormData({
        code: `${(companyCodes.length + 1) * 1000}`,
        name: '',
        currency: 'USD',
        country: 'United States',
        city: '',
        taxId: '',
        chartOfAccounts: 'COA-GLOBAL',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      addToast('Please enter both Company Code and Company Name', 'error');
      return;
    }

    if (modalMode === 'add') {
      const isDuplicate = companyCodes.some(c => String(c.code).toLowerCase() === String(formData.code).trim().toLowerCase());
      if (isDuplicate) {
        addToast(`Validation Error: Company Code ${formData.code} already exists! Uniqueness required.`, 'error');
        return;
      }
      const res = await store.addCompanyCode({ ...formData, code: formData.code.trim() });
      if (!res) return;
      addToast(`Company Code ${formData.code} created successfully!`, 'success');
    } else if (modalMode === 'edit') {
      store.updateCompanyCode(formData.id, formData);
      addToast(`Company Code ${formData.code} updated successfully!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, code) => {
    if (window.confirm(`Are you sure you want to delete Company Code ${code}?`)) {
      store.deleteCompanyCode(id);
      addToast(`Company Code ${code} deleted`, 'info');
    }
  };

  const tableCols = [
    { 
      key: 'code', 
      label: 'Company Code', 
      render: val => (
        <span style={{ 
          fontFamily: 'monospace', 
          fontWeight: '700', 
          fontSize: '13px', 
          background: 'rgba(37,99,235,0.08)', 
          color: '#2563eb', 
          padding: '4px 10px', 
          borderRadius: '16px' 
        }}>
          {val}
        </span>
      )
    },
    { 
      key: 'name', 
      label: 'Company Name',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '600', color: '#0f172a' }}>{val}</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{row.city ? `${row.city}, ` : ''}{row.country}</span>
        </div>
      )
    },
    { 
      key: 'currency', 
      label: 'Currency', 
      render: val => <span style={{ fontWeight: '600', color: '#047857' }}>{val}</span> 
    },
    { 
      key: 'taxId', 
      label: 'Tax / GSTIN ID', 
      render: val => val || '—' 
    },
    { 
      key: 'chartOfAccounts', 
      label: 'Chart of Accounts', 
      render: val => val || 'COA-GLOBAL' 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: val => (
        <span className={`status-badge ${val === 'Active' ? 'badge-success' : 'badge-warning'}`}>
          {val}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => handleOpenModal('edit', row)} style={{ padding: '6px', color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Edit Company Code">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(row.id, row.code)} style={{ padding: '6px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Delete Company Code">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Master Data Management</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a' }}>Company Code Master</h1>
          <p style={{ color: '#64748b' }}>Define and manage enterprise legal entities, currencies, fiscal localizations, and transaction boundaries.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px', cursor: 'pointer' }}>
            <Download size={16} style={{ marginRight: '8px' }}/> Export
          </button>
          <button className="btn-dark-pill" onClick={() => handleOpenModal('add')} style={{ cursor: 'pointer' }}>
            <Plus size={18} style={{ marginRight: '6px' }}/> Add Company Code
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Entities</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{companyCodes.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Active Status</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{companyCodes.filter(c => c.status === 'Active').length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Currencies</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{new Set(companyCodes.map(c => c.currency)).size} Active</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Chart of Accounts</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>COA-GLOBAL</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 0 24px 0', background: '#ffffff', borderRadius: '24px' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div 
              onClick={() => setStatusFilter('All')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                borderBottom: statusFilter === 'All' ? '2px solid #2563eb' : '2px solid transparent', 
                paddingBottom: '16px', marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: statusFilter === 'All' ? '700' : '600', fontSize: '14px', color: statusFilter === 'All' ? '#2563eb' : '#64748b' }}>All Records</span>
              <span style={{ fontWeight: '700', fontSize: '12px', background: statusFilter === 'All' ? 'rgba(37,99,235,0.1)' : '#f1f5f9', color: statusFilter === 'All' ? '#2563eb' : '#64748b', padding: '2px 8px', borderRadius: '12px' }}>{companyCodes.length}</span>
            </div>
            <div 
              onClick={() => setStatusFilter('Active')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                borderBottom: statusFilter === 'Active' ? '2px solid #2563eb' : '2px solid transparent', 
                paddingBottom: '16px', marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: statusFilter === 'Active' ? '700' : '600', fontSize: '14px', color: statusFilter === 'Active' ? '#2563eb' : '#64748b' }}>Active</span>
              <span style={{ fontWeight: '700', fontSize: '12px', background: statusFilter === 'Active' ? 'rgba(37,99,235,0.1)' : '#f1f5f9', color: statusFilter === 'Active' ? '#2563eb' : '#64748b', padding: '2px 8px', borderRadius: '12px' }}>{activeCount}</span>
            </div>
            <div 
              onClick={() => setStatusFilter('Archived')} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                borderBottom: statusFilter === 'Archived' ? '2px solid #2563eb' : '2px solid transparent', 
                paddingBottom: '16px', marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: statusFilter === 'Archived' ? '700' : '600', fontSize: '14px', color: statusFilter === 'Archived' ? '#2563eb' : '#64748b' }}>Archived</span>
              <span style={{ fontWeight: '700', fontSize: '12px', background: statusFilter === 'Archived' ? 'rgba(37,99,235,0.1)' : '#f1f5f9', color: statusFilter === 'Archived' ? '#2563eb' : '#64748b', padding: '2px 8px', borderRadius: '12px' }}>{archivedCount}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search codes or names..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '10px 16px 10px 38px', borderRadius: '40px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', width: '260px', fontSize: '14px' }} 
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>
        </div>
        
        <div style={{ padding: '0 32px' }}>
          <DataTable columns={tableCols} data={filteredData} />
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Company Code Master' : 'Edit Company Code'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Company Code * (e.g. 1000, 2000)</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={formData.code} 
                onChange={e => setFormData({ ...formData, code: e.target.value })} 
                placeholder="1000"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Base Currency *</label>
              <select 
                className="form-input" 
                value={formData.currency} 
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="CAD">CAD ($ - Canadian Dollar)</option>
                <option value="AUD">AUD ($ - Australian Dollar)</option>
                <option value="JPY">JPY (¥ - Japanese Yen)</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Legal Company Name *</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Flex Manufacturing Corp"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Country *</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={formData.country} 
                onChange={e => setFormData({ ...formData, country: e.target.value })} 
                placeholder="e.g. United States"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>City</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.city || ''} 
                onChange={e => setFormData({ ...formData, city: e.target.value })} 
                placeholder="e.g. New York"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Tax / Registration ID (EIN / GSTIN)</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.taxId || ''} 
                onChange={e => setFormData({ ...formData, taxId: e.target.value })} 
                placeholder="e.g. US-987654321"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Chart of Accounts (COA)</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.chartOfAccounts || 'COA-GLOBAL'} 
                onChange={e => setFormData({ ...formData, chartOfAccounts: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Status</label>
              <select 
                className="form-input" 
                value={formData.status} 
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}>
              Cancel
            </button>
            <button type="submit" className="btn-dark-pill" style={{ cursor: 'pointer' }}>
              {modalMode === 'add' ? 'Save Company Code' : 'Update Company Code'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
