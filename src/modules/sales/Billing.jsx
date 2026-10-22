import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye, Receipt, CheckCircle2, Clock, DollarSign, Building2, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';
import { useToastStore } from '../../data/toastStore';

export default function Billing() {
  const store = useStore();
  const location = useLocation();
  const addToast = useToastStore(state => state.addToast);
  
  const salesInvoices = store.salesInvoices || [];
  const salesOrders = store.salesOrders || [];
  const companyCodes = store.companyCodes || [
    { code: '1000', name: 'Flex Manufacturing Corp' },
    { code: '2000', name: 'Flex Industries Europe Ltd' },
    { code: '3000', name: 'Flex Tech India Solutions' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    soId: '',
    customer: '',
    companyCode: '1000',
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10),
    items: [
      { product: 'Heavy Duty Pump Component', qty: 250, uom: 'pcs', unitPrice: 100, amount: 25000 }
    ],
    amount: 25000,
    taxRate: 18,
    tax: 4500,
    total: 29500,
    glAccount: '4010',
    status: 'Posted',
    notes: ''
  });

  // Check if routed from Sales Orders with pre-filled SO
  React.useEffect(() => {
    if (location.state?.createForSO) {
      handleOpenCreateModal(location.state.createForSO);
    }
  }, [location.state]);

  const filteredInvoices = salesInvoices.filter(item => {
    const matchesSearch = Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCompany = selectedCompanyFilter === 'ALL' || item.companyCode === selectedCompanyFilter;
    return matchesSearch && matchesCompany;
  });

  const totalBilled = filteredInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
  const totalPaid = filteredInvoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);
  const totalPending = filteredInvoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + (parseFloat(inv.total || inv.amount) || 0), 0);

  const handleExport = () => {
    if (filteredInvoices.length === 0) return;
    const headers = ['Invoice Number', 'SO Ref', 'Customer', 'Company Code', 'Issue Date', 'Due Date', 'Subtotal', 'Tax', 'Total', 'Status'];
    const rows = filteredInvoices.map(r => `"${r.invoiceNumber || r.id}","${r.soId || ''}","${r.customer}","${r.companyCode || '1000'}","${r.date}","${r.dueDate || ''}","${r.amount}","${r.tax || 0}","${r.total}","${r.status}"`);
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_invoices_billing.csv';
    a.click();
  };

  const handleOpenCreateModal = (so = null) => {
    setModalMode('add');
    const baseSubtotal = so ? (so.total || 10000) : 25000;
    const tax = Math.round(baseSubtotal * 0.18);
    const items = so 
      ? [{ product: `Finished Goods Order ${so.id}`, qty: 1, uom: 'lot', unitPrice: baseSubtotal, amount: baseSubtotal }]
      : [{ product: 'Heavy Duty Pump Component', qty: 250, uom: 'pcs', unitPrice: 100, amount: 25000 }];

    setFormData({
      invoiceNumber: `INV-SL-${Date.now().toString().slice(-4)}`,
      soId: so ? (so.id || so.orderNumber) : (salesOrders[0]?.id || 'SO-26-2001'),
      customer: so ? (so.customer || 'Global AutoCorp') : 'Global AutoCorp',
      companyCode: so?.companyCode || '1000',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10),
      items,
      amount: baseSubtotal,
      taxRate: 18,
      tax: tax,
      total: baseSubtotal + tax,
      glAccount: '4010',
      status: 'Posted',
      notes: so ? `Customer invoice for Sales Order ${so.id || so.orderNumber}` : 'Standard commercial sales invoice'
    });
    setIsModalOpen(true);
  };

  const handleSOSelect = (soId) => {
    const so = salesOrders.find(s => s.id === soId);
    if (so) {
      const subtotal = parseFloat(so.total || 0);
      const tax = Math.round(subtotal * (formData.taxRate / 100));
      const items = [{ product: `Contract Supply for ${so.id}`, qty: 1, uom: 'lot', unitPrice: subtotal, amount: subtotal }];
      setFormData(prev => ({
        ...prev,
        soId: so.id,
        customer: so.customer,
        companyCode: so.companyCode || '1000',
        items,
        amount: subtotal,
        tax,
        total: subtotal + tax,
        notes: `Billed for Sales Order ${so.id} - ${so.customer}`
      }));
    }
  };

  const handleItemChange = (idx, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[idx] = { ...updatedItems[idx], [field]: value };
    if (field === 'qty' || field === 'unitPrice') {
      const q = parseFloat(field === 'qty' ? value : updatedItems[idx].qty) || 0;
      const p = parseFloat(field === 'unitPrice' ? value : updatedItems[idx].unitPrice) || 0;
      updatedItems[idx].amount = Math.round(q * p * 100) / 100;
    }
    const newSubtotal = updatedItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
    const newTax = Math.round(newSubtotal * (formData.taxRate / 100));
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      amount: newSubtotal,
      tax: newTax,
      total: newSubtotal + newTax
    }));
  };

  const handleAddItem = () => {
    setFormData(prev => {
      const updated = [...prev.items, { product: '', qty: 1, uom: 'pcs', unitPrice: 0, amount: 0 }];
      return { ...prev, items: updated };
    });
  };

  const handleRemoveItem = (idx) => {
    if (formData.items.length <= 1) return;
    const updatedItems = formData.items.filter((_, i) => i !== idx);
    const newSubtotal = updatedItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
    const newTax = Math.round(newSubtotal * (formData.taxRate / 100));
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      amount: newSubtotal,
      tax: newTax,
      total: newSubtotal + newTax
    }));
  };

  const handleAmountChange = (newAmount, taxRate = formData.taxRate) => {
    const amt = parseFloat(newAmount) || 0;
    const tax = Math.round(amt * (taxRate / 100));
    setFormData(prev => ({
      ...prev,
      amount: amt,
      taxRate,
      tax,
      total: amt + tax
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.invoiceNumber || !formData.amount) {
      addToast('Please enter an Invoice Number and line items', 'error');
      return;
    }

    if (modalMode === 'add') {
      // Duplicate invoice prevention
      const isDuplicate = salesInvoices.some(inv => 
        String(inv.invoiceNumber || inv.id).toLowerCase() === String(formData.invoiceNumber).trim().toLowerCase()
      );
      if (isDuplicate) {
        addToast(`Validation Error: Sales Invoice ${formData.invoiceNumber} already exists! Duplicate prevented.`, 'error');
        return;
      }

      const res = await store.addSalesInvoice({
        ...formData,
        invoiceNumber: formData.invoiceNumber.trim(),
        amount: parseFloat(formData.amount),
        tax: parseFloat(formData.tax || 0),
        total: parseFloat(formData.total)
      });
      if (!res) return;
    } else {
      store.updateSalesInvoice(formData.id || formData.invoiceNumber, formData);
      addToast('Invoice updated successfully', 'success');
    }
    setIsModalOpen(false);
  };

  const handleMarkAsPaid = (inv) => {
    store.updateSalesInvoice(inv.id, { ...inv, status: 'Paid' });
    addToast(`Invoice ${inv.invoiceNumber || inv.id} marked as Paid!`, 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      store.deleteSalesInvoice(id);
      addToast('Sales Invoice deleted', 'info');
    }
  };

  const tableCols = [
    { 
      key: 'invoiceNumber', 
      label: 'Invoice #', 
      render: (val, row) => (
        <span style={{ fontWeight: '700', color: '#ea580c' }}>
          {val || row.id}
        </span>
      ) 
    },
    { 
      key: 'soId', 
      label: 'SO Ref', 
      render: val => val ? <span style={{ fontFamily: 'monospace', color: '#64748b' }}>{val}</span> : '—' 
    },
    { 
      key: 'customer', 
      label: 'Customer', 
      render: val => <span style={{ fontWeight: '600', color: '#0f172a' }}>{val}</span> 
    },
    { 
      key: 'companyCode', 
      label: 'Co. Code', 
      render: val => (
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '12px' }}>
          {val || '1000'}
        </span>
      ) 
    },
    { key: 'date', label: 'Issue Date', render: val => val },
    { key: 'dueDate', label: 'Due Date', render: val => val || '—' },
    { 
      key: 'amount', 
      label: 'Subtotal', 
      render: val => `$${val?.toLocaleString()}` 
    },
    { 
      key: 'tax', 
      label: 'Tax', 
      render: val => val ? `$${val?.toLocaleString()}` : '$0' 
    },
    { 
      key: 'total', 
      label: 'Total Bill', 
      render: (val, row) => (
        <span style={{ fontWeight: '800', color: '#0f172a' }}>
          ${(val || row.amount)?.toLocaleString()}
        </span>
      ) 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: val => (
        <span className={`status-badge ${val === 'Paid' ? 'badge-success' : val === 'Pending' ? 'badge-warning' : 'badge-primary'}`}>
          {val}
        </span>
      ) 
    },
    {
      key: 'glFlow',
      label: 'GL Recorded',
      render: () => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '12px', fontWeight: '600' }}>
          <CheckCircle2 size={13} /> GL-4010
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {row.status !== 'Paid' && (
            <button 
              onClick={() => handleMarkAsPaid(row)} 
              title="Mark Invoice as Paid" 
              style={{ padding: '4px 8px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#059669', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
            >
              Pay
            </button>
          )}
          <button 
            onClick={() => setSelectedInvoiceForView(row)} 
            title="Preview Printable Invoice"
            style={{ padding: '6px', color: '#64748b', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handleDelete(row.id || row.invoiceNumber)} 
            style={{ padding: '6px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
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
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ea580c', background: 'rgba(234,88,12,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Sales & Accounts Receivable</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a' }}>Sales Invoicing & Billing</h1>
          <p style={{ color: '#64748b' }}>Generate customer tax invoices, manage receivables, and automate double-entry postings into Finance General Ledger.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px', cursor: 'pointer' }}>
            <Download size={16} style={{ marginRight: '8px' }}/> Export
          </button>
          <button 
            onClick={() => handleOpenCreateModal()} 
            style={{ 
              background: '#ea580c', 
              color: '#ffffff', 
              border: 'none', 
              boxShadow: '0 4px 14px rgba(234,88,12,0.25)', 
              padding: '12px 24px', 
              borderRadius: '40px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} /> Create Sales Bill
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234,88,12,0.1)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Invoiced</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>${totalBilled.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Paid Receivables</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>${totalPaid.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Pending Collection</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>${totalPending.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Automated GL Posts</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{filteredInvoices.length} Entries</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 0 24px 0', background: '#ffffff', borderRadius: '24px' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: '700', fontSize: '14px', color: '#ea580c' }}>Customer Billing Invoices</span>
            <span style={{ fontWeight: '700', fontSize: '12px', background: 'rgba(234,88,12,0.1)', color: '#ea580c', padding: '2px 8px', borderRadius: '12px' }}>{filteredInvoices.length}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            {/* Filter by Company Code */}
            <select 
              value={selectedCompanyFilter} 
              onChange={e => setSelectedCompanyFilter(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '30px', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '13px', fontWeight: '600', color: '#334155' }}
            >
              <option value="ALL">All Company Codes</option>
              {companyCodes.map(cc => (
                <option key={cc.code} value={cc.code}>Co. {cc.code} - {cc.name}</option>
              ))}
            </select>

            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search bills, customer, invoice #..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '10px 16px 10px 38px', borderRadius: '40px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', width: '260px', fontSize: '14px' }} 
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>
        </div>
        
        <div style={{ padding: '0 32px' }}>
          <DataTable columns={tableCols} data={filteredInvoices} />
        </div>
      </div>

      {/* MODAL: CREATE SALES INVOICE */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Customer Bill / Sales Invoice">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(234,88,12,0.06)', border: '1px solid rgba(234,88,12,0.2)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Receipt size={20} color="#ea580c" />
            <span style={{ fontSize: '13px', color: '#9a3412' }}>
              Submitting this bill will automatically post a double-entry to <strong>Finance GL</strong> (Debit: 1020 Accounts Receivable, Credit: 4010 Finished Goods Sales Revenue).
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Invoice Number *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                value={formData.invoiceNumber} 
                onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })} 
                placeholder="INV-SL-2004"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Reference Sales Order</label>
              <select 
                className="form-input" 
                value={formData.soId} 
                onChange={e => handleSOSelect(e.target.value)}
              >
                <option value="">Manual / No Sales Order</option>
                {salesOrders.map(so => (
                  <option key={so.id} value={so.id}>{so.id} - {so.customer} (${so.total})</option>
                ))}
              </select>
            </div>

            {/* REQUIREMENT: Company Code */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Company Code *</label>
              <select 
                className="form-input" 
                value={formData.companyCode} 
                onChange={e => setFormData({ ...formData, companyCode: e.target.value })}
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
                required 
                className="form-input" 
                value={formData.customer} 
                onChange={e => setFormData({ ...formData, customer: e.target.value })} 
                placeholder="e.g. Global AutoCorp"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Issue Date *</label>
              <input 
                type="date" 
                required 
                className="form-input" 
                value={formData.date} 
                onChange={e => setFormData({ ...formData, date: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Payment Due Date *</label>
              <input 
                type="date" 
                required 
                className="form-input" 
                value={formData.dueDate} 
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Invoice Posting Status *</label>
              <select 
                className="form-input" 
                value={formData.status} 
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Posted">Posted (Generate General Ledger Entry)</option>
                <option value="Pending">Pending Approval</option>
                <option value="Draft">Draft (Save Unposted to GL)</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>General Ledger Revenue Account</label>
              <select 
                className="form-input" 
                value={formData.glAccount} 
                onChange={e => setFormData({ ...formData, glAccount: e.target.value })}
              >
                <option value="4010">4010 - Finished Goods Sales Revenue</option>
                <option value="4020">4020 - Service & Maintenance Revenue</option>
              </select>
            </div>

            {/* REQUIREMENT: Products, Quantities, Pricing Line Items */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Invoice Line Items (Products & Pricing) *</label>
                <button 
                  type="button" 
                  onClick={handleAddItem}
                  style={{ background: 'rgba(234,88,12,0.08)', color: '#ea580c', border: 'none', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  + Add Product
                </button>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '8px 12px' }}>Product / Service</th>
                      <th style={{ padding: '8px 12px', width: '90px' }}>Qty</th>
                      <th style={{ padding: '8px 12px', width: '80px' }}>UOM</th>
                      <th style={{ padding: '8px 12px', width: '110px' }}>Unit Price ($)</th>
                      <th style={{ padding: '8px 12px', width: '110px' }}>Total ($)</th>
                      <th style={{ padding: '8px 12px', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 8px' }}>
                          <input 
                            type="text" 
                            required 
                            placeholder="Product or service description..." 
                            value={it.product} 
                            onChange={e => handleItemChange(idx, 'product', e.target.value)} 
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input 
                            type="number" 
                            min="1" 
                            required 
                            value={it.qty} 
                            onChange={e => handleItemChange(idx, 'qty', e.target.value)} 
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input 
                            type="text" 
                            value={it.uom} 
                            onChange={e => handleItemChange(idx, 'uom', e.target.value)} 
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            required 
                            value={it.unitPrice} 
                            onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)} 
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 12px', fontWeight: '700', color: '#0f172a' }}>
                          ${(parseFloat(it.amount) || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          {formData.items.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveItem(idx)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete line"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Subtotal Amount ($)</label>
              <input 
                type="number" 
                readOnly 
                className="form-input" 
                value={formData.amount} 
                style={{ background: '#f8fafc', color: '#64748b', fontWeight: '600' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Tax Rate (%)</label>
              <select 
                className="form-input" 
                value={formData.taxRate} 
                onChange={e => handleAmountChange(formData.amount, parseFloat(e.target.value))}
              >
                <option value={0}>0% - Tax Exempt</option>
                <option value={5}>5% - Reduced VAT</option>
                <option value={12}>12% - Standard GST</option>
                <option value={18}>18% - Integrated GST / VAT</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Tax Amount ($)</label>
              <input 
                type="number" 
                readOnly 
                className="form-input" 
                value={formData.tax} 
                style={{ background: '#f8fafc', color: '#64748b' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Total Invoice Amount ($)</label>
              <input 
                type="number" 
                readOnly 
                className="form-input" 
                value={formData.total} 
                style={{ background: '#f8fafc', fontWeight: '800', color: '#0f172a', fontSize: '15px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}>
              Cancel
            </button>
            <button type="submit" style={{ background: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '30px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Receipt size={16} /> Generate Bill & Post to GL
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: VIEW PRINTABLE INVOICE */}
      {selectedInvoiceForView && (
        <Modal isOpen={!!selectedInvoiceForView} onClose={() => setSelectedInvoiceForView(null)} title={`Invoice Preview: ${selectedInvoiceForView.invoiceNumber || selectedInvoiceForView.id}`}>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>TAX INVOICE</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Invoice #: <span style={{ fontWeight: '700', color: '#0f172a' }}>{selectedInvoiceForView.invoiceNumber || selectedInvoiceForView.id}</span></div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Company Code: <span style={{ fontWeight: '700', color: '#2563eb' }}>{selectedInvoiceForView.companyCode || '1000'}</span></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Flex ERP Enterprise</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Date: {selectedInvoiceForView.date}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Due Date: {selectedInvoiceForView.dueDate || '30 days net'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Bill To:</span>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{selectedInvoiceForView.customer}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Ref SO: {selectedInvoiceForView.soId || 'N/A'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Payment Status:</span>
                <div>
                  <span className={`status-badge ${selectedInvoiceForView.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                    {selectedInvoiceForView.status}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ paddingBottom: '8px' }}>Description</th>
                    <th style={{ paddingBottom: '8px', textAlign: 'right' }}>GL Account</th>
                    <th style={{ paddingBottom: '8px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ paddingTop: '8px', fontWeight: '600' }}>Finished Goods Fulfillment ({selectedInvoiceForView.soId || 'Contract'})</td>
                    <td style={{ paddingTop: '8px', textAlign: 'right', color: '#64748b' }}>GL-4010</td>
                    <td style={{ paddingTop: '8px', textAlign: 'right', fontWeight: '600' }}>${(selectedInvoiceForView.amount || selectedInvoiceForView.total)?.toLocaleString()}</td>
                  </tr>
                  {selectedInvoiceForView.tax > 0 && (
                    <tr>
                      <td style={{ paddingTop: '6px', color: '#64748b' }}>Sales Tax / VAT</td>
                      <td style={{ paddingTop: '6px', textAlign: 'right', color: '#64748b' }}>GL-2020</td>
                      <td style={{ paddingTop: '6px', textAlign: 'right', color: '#64748b' }}>${selectedInvoiceForView.tax?.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '2px solid #e2e8f0', fontWeight: '800', fontSize: '15px' }}>
                    <td style={{ paddingTop: '10px' }}>Total Due</td>
                    <td></td>
                    <td style={{ paddingTop: '10px', textAlign: 'right', color: '#ea580c' }}>${(selectedInvoiceForView.total || selectedInvoiceForView.amount)?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => window.print()} style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: '600' }}>
                Print Invoice
              </button>
              <button onClick={() => setSelectedInvoiceForView(null)} style={{ padding: '8px 20px', borderRadius: '20px', background: '#0f172a', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
