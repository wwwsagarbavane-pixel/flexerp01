import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye, Receipt, FileText, CheckCircle2, Building2, ArrowRight } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';
import { useToastStore } from '../../data/toastStore';

export default function PurchaseOrders() {
  const store = useStore();
  const addToast = useToastStore(state => state.addToast);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'invoices'
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({});

  // Invoice Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '',
    poNumber: '',
    vendorId: '',
    vendorName: '',
    from: '',
    companyCode: '1000',
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10),
    items: [
      { item: 'Steel Sheet 3mm', qty: 2000, uom: 'kg', unitPrice: 1.2, amount: 2400 }
    ],
    subtotal: 2400,
    taxRate: 0,
    tax: 0,
    amount: 2400,
    status: 'Posted',
    glAccount: '5010',
    notes: ''
  });

  const companyCodes = store.companyCodes || [
    { code: '1000', name: 'Flex Manufacturing Corp' },
    { code: '2000', name: 'Flex Industries Europe Ltd' },
    { code: '3000', name: 'Flex Tech India Solutions' }
  ];

  const allPOs = purchaseOrders.length > 0 ? purchaseOrders : (store.purchaseOrders || []);
  const currentUser = store.currentUser || { companyId: 'SYSTEM', role: 'Super Admin' };
  const scopedPOs = (!currentUser.companyId || currentUser.companyId === 'SYSTEM')
    ? allPOs
    : allPOs.filter(item => !item.companyId || item.companyId === currentUser.companyId || item.companyId === 'C-001');

  const filteredPOs = scopedPOs.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const procurementInvoices = store.procurementInvoices || [];
  const filteredInvoices = procurementInvoices.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExport = () => {
    const list = activeTab === 'pos' ? filteredPOs : filteredInvoices;
    if (list.length === 0) return;
    const headers = Object.keys(list[0]).join(',');
    const csv = [headers, ...list.map(row => Object.values(row).map(v => typeof v === 'object' ? JSON.stringify(v) : `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'pos' ? 'purchase_orders.csv' : 'procurement_invoices.csv';
    a.click();
  };

  const handleOpenModal = (mode, row = {}) => {
    setModalMode(mode);
    setFormData(mode === 'add' ? {
      companyCode: '1000',
      from: 'Apex Steel Traders (Main Mills, NY)',
      vendorId: 'V-001',
      vendorName: 'Apex Steel Traders',
      date: new Date().toISOString().slice(0, 10),
      expectedDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().slice(0, 10),
      warehouse: 'WH-RAW',
      amount: 2500,
      status: 'Draft'
    } : { ...row });
    setIsModalOpen(true);
  };

  const handleSubmitPO = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      orderNumber: formData.orderNumber || formData.id || `PO-26-${Date.now().toString().slice(-4)}`,
      vendorId: formData.vendorId || 'V-001',
      vendorName: formData.vendorName || 'Apex Steel Traders',
      from: formData.from || 'Supplier Facility, NY',
      companyCode: formData.companyCode || '1000',
      orderDate: formData.date || formData.orderDate || new Date().toISOString().slice(0, 10),
      expectedDate: formData.expectedDate || '2026-10-25',
      warehouse: formData.warehouse || 'WH-RAW',
      total: parseFloat(formData.amount || formData.total || 1000),
      amount: parseFloat(formData.amount || formData.total || 1000),
      status: formData.status || 'Draft',
      companyId: currentUser.companyId || 'C-001'
    };

    if (modalMode === 'add') {
      store.addPO(payload);
      addToast(`Purchase Order ${payload.orderNumber} created!`, 'success');
    } else {
      store.updatePO(formData.id || formData.orderNumber, payload);
      addToast(`Purchase Order updated!`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      store.deletePO ? store.deletePO(id) : store.genericDelete('purchaseOrders', id);
      setPurchaseOrders(prev => prev.filter(p => p.id !== id && p.orderNumber !== id));
      addToast('Purchase Order deleted', 'info');
    }
  };

  // Open Invoice Modal
  const handleOpenInvoiceModal = (po = null) => {
    const selectedPO = po || filteredPOs[0] || {};
    const defaultItems = selectedPO.items && selectedPO.items.length > 0 
      ? selectedPO.items.map(it => ({
          item: it.item || 'Item',
          qty: parseFloat(it.qty || it.rcvQty || 1),
          uom: it.uom || 'pcs',
          unitPrice: parseFloat(it.price || it.unitPrice || (selectedPO.amount / (it.qty || 1))),
          amount: parseFloat(it.amount || ((it.qty || 1) * (it.price || 1)))
        }))
      : [
          { item: 'Raw Material Delivery', qty: 1, uom: 'lot', unitPrice: selectedPO.amount || selectedPO.total || 2400, amount: selectedPO.amount || selectedPO.total || 2400 }
        ];

    const sub = defaultItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);

    setInvoiceForm({
      invoiceNumber: `INV-PR-${Date.now().toString().slice(-4)}`,
      poNumber: selectedPO.id || selectedPO.orderNumber || 'PO-26-1001',
      vendorId: selectedPO.vendorId || 'V-001',
      vendorName: selectedPO.vendorName || 'Apex Steel Traders',
      from: selectedPO.from || `${selectedPO.vendorName || 'Apex Steel Traders'} (Main Mills)`,
      companyCode: selectedPO.companyCode || '1000',
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10),
      items: defaultItems,
      subtotal: sub,
      taxRate: 0,
      tax: 0,
      amount: sub,
      status: 'Posted',
      glAccount: '5010',
      notes: `Invoice against PO ${selectedPO.id || selectedPO.orderNumber || ''}`
    });
    setIsInvoiceModalOpen(true);
  };

  const handleSelectPOForInvoice = (poId) => {
    const po = allPOs.find(p => (p.id === poId || p.orderNumber === poId));
    if (po) {
      const items = po.items && po.items.length > 0
        ? po.items.map(it => ({
            item: it.item,
            qty: parseFloat(it.qty || 1),
            uom: it.uom || 'pcs',
            unitPrice: parseFloat(it.price || 1),
            amount: parseFloat(it.amount || (it.qty * it.price))
          }))
        : [{ item: 'Procurement Item', qty: 1, uom: 'pcs', unitPrice: po.amount || po.total || 1000, amount: po.amount || po.total || 1000 }];
      
      const sub = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
      const tax = Math.round(sub * (invoiceForm.taxRate / 100));

      setInvoiceForm(prev => ({
        ...prev,
        poNumber: po.id || po.orderNumber,
        vendorId: po.vendorId || '',
        vendorName: po.vendorName || '',
        from: po.from || `${po.vendorName} Works`,
        companyCode: po.companyCode || '1000',
        items,
        subtotal: sub,
        tax,
        amount: sub + tax,
        notes: `Vendor invoice for Purchase Order ${po.id || po.orderNumber}`
      }));
    }
  };

  const handleInvoiceItemChange = (idx, field, value) => {
    const updatedItems = [...invoiceForm.items];
    updatedItems[idx] = { ...updatedItems[idx], [field]: value };
    if (field === 'qty' || field === 'unitPrice') {
      const q = parseFloat(field === 'qty' ? value : updatedItems[idx].qty) || 0;
      const p = parseFloat(field === 'unitPrice' ? value : updatedItems[idx].unitPrice) || 0;
      updatedItems[idx].amount = Math.round(q * p * 100) / 100;
    }
    const newSubtotal = updatedItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
    const newTax = Math.round(newSubtotal * (invoiceForm.taxRate / 100));
    setInvoiceForm(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: newSubtotal,
      tax: newTax,
      amount: newSubtotal + newTax
    }));
  };

  const handleAddInvoiceItem = () => {
    setInvoiceForm(prev => {
      const updated = [...prev.items, { item: '', qty: 1, uom: 'pcs', unitPrice: 0, amount: 0 }];
      return { ...prev, items: updated };
    });
  };

  const handleRemoveInvoiceItem = (idx) => {
    if (invoiceForm.items.length <= 1) return;
    const updatedItems = invoiceForm.items.filter((_, i) => i !== idx);
    const newSubtotal = updatedItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
    const newTax = Math.round(newSubtotal * (invoiceForm.taxRate / 100));
    setInvoiceForm(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: newSubtotal,
      tax: newTax,
      amount: newSubtotal + newTax
    }));
  };

  const handleSubmitInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceForm.invoiceNumber || !invoiceForm.amount) {
      addToast('Please provide Invoice Number and line items', 'error');
      return;
    }

    // Check duplicate
    const isDuplicate = procurementInvoices.some(inv => 
      String(inv.invoiceNumber || inv.id).toLowerCase() === String(invoiceForm.invoiceNumber).trim().toLowerCase()
    );
    if (isDuplicate) {
      addToast(`Validation Error: Invoice ${invoiceForm.invoiceNumber} already exists! Duplicate prevented.`, 'error');
      return;
    }

    const res = await store.addProcurementInvoice({
      ...invoiceForm,
      invoiceNumber: invoiceForm.invoiceNumber.trim(),
      amount: parseFloat(invoiceForm.amount),
      total: parseFloat(invoiceForm.amount),
      subtotal: parseFloat(invoiceForm.subtotal || invoiceForm.amount)
    });

    if (res) {
      setIsInvoiceModalOpen(false);
      setActiveTab('invoices');
    }
  };

  // Table Columns for POs
  const poCols = [
    { key: 'orderNumber', label: 'PO Number', render: (val, row) => <span style={{ fontWeight: '700', color: '#0f172a' }}>{val || row.id}</span> },
    { key: 'vendorName', label: 'Vendor', render: (val, row) => val || row.vendorId || 'Apex Steel' },
    { 
      key: 'from', 
      label: 'From (Origin)', 
      render: (val, row) => (
        <span style={{ fontSize: '13px', color: '#475569' }}>
          {val || row.from || `${row.vendorName || 'Vendor'} Hub`}
        </span>
      )
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
    { key: 'orderDate', label: 'PO Date', render: (val, row) => {
      const d = val || row.date;
      return d ? new Date(d).toLocaleDateString() : '-';
    }},
    { key: 'expectedDate', label: 'Expected Date', render: (val, row) => {
      const d = val || row.expectedDate;
      return d ? new Date(d).toLocaleDateString() : '-';
    }},
    { key: 'total', label: 'Amount', render: (val, row) => <span style={{ fontWeight: '700', color: '#0f172a' }}>${(val !== undefined && val !== null) ? val : (row.amount || 0)}</span> },
    { key: 'status', label: 'Status', render: val => (
      <span className={`status-badge ${val==="Released"||val==="Received"?"badge-success":val==="Draft"?"badge-warning":"badge-primary"}`}>
        {val || 'Draft'}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          onClick={() => handleOpenInvoiceModal(row)} 
          title="Create Invoice from PO"
          style={{ padding: '4px 8px', borderRadius: '12px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Receipt size={14} /> Bill
        </button>
        <Link to={`/app/procurement/purchase-orders/${row.id || row.orderNumber}`} style={{ padding: '4px', color: '#64748b', display: 'flex' }}><Eye size={16} /></Link>
        <button onClick={() => handleOpenModal('edit', row)} style={{ padding: '4px', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(row.id || row.orderNumber)} style={{ padding: '4px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
      </div>
    )}
  ];

  // Table Columns for Invoices
  const invoiceCols = [
    { key: 'invoiceNumber', label: 'Invoice #', render: (val, row) => <span style={{ fontWeight: '700', color: '#2563eb' }}>{val || row.id}</span> },
    { key: 'poNumber', label: 'PO Ref', render: val => <span style={{ fontFamily: 'monospace' }}>{val || '—'}</span> },
    { key: 'vendorName', label: 'Vendor', render: val => val },
    { key: 'from', label: 'From (Origin)', render: val => <span style={{ fontSize: '12px', color: '#64748b' }}>{val || '—'}</span> },
    { key: 'companyCode', label: 'Co. Code', render: val => <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '12px' }}>{val || '1000'}</span> },
    { key: 'date', label: 'Inv Date', render: val => val },
    { key: 'amount', label: 'Total Amount', render: val => <span style={{ fontWeight: '700', color: '#0f172a' }}>${val}</span> },
    { key: 'glAccount', label: 'GL Account', render: val => <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#334155' }}>GL-{val || '5010'}</span> },
    { key: 'status', label: 'Status', render: val => <span className={`status-badge ${val === 'Paid' ? 'badge-success' : 'badge-primary'}`}>{val || 'Posted'}</span> },
    { key: 'flow', label: 'Finance Flow', render: () => <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '12px', fontWeight: '600' }}><CheckCircle2 size={14}/> Flowed to GL</span> }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#16a34a', background: 'rgba(22,163,74,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Procurement & Payables</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px', color: '#0f172a' }}>Procurement & Invoicing</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manage supplier purchase orders, origin locations, vendor invoices, and automatic Finance GL entry.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px', cursor: 'pointer' }}>
            <Download size={16} style={{ marginRight: '8px' }}/> Export
          </button>
          
          {/* REQUIREMENT: Add Invoice button */}
          <button 
            onClick={() => handleOpenInvoiceModal()} 
            style={{ 
              background: '#2563eb', 
              color: '#ffffff', 
              border: 'none', 
              boxShadow: '0 4px 14px rgba(37,99,235,0.25)', 
              padding: '12px 22px', 
              borderRadius: '40px', 
              fontWeight: '700', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseOver={e=>e.currentTarget.style.transform='translateY(-1px)'}
            onMouseOut={e=>e.currentTarget.style.transform='none'}
          >
            <Receipt size={18} /> Add Invoice
          </button>

          {/* Add PO button */}
          <button className="btn-dark-pill" onClick={() => handleOpenModal('add')} style={{ cursor: 'pointer' }}>
            <Plus size={18} style={{ marginRight: '4px' }}/> Add PO
          </button>
        </div>
      </div>

      {/* Main Card with Tabs */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 0 24px 0', background: '#ffffff', borderRadius: '24px' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid var(--color-border)', padding: '16px 32px 0 32px' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div 
              onClick={() => setActiveTab('pos')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer', 
                borderBottom: activeTab === 'pos' ? '2px solid #2563eb' : '2px solid transparent', 
                paddingBottom: '16px', 
                marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: '700', fontSize: '14px', color: activeTab === 'pos' ? '#2563eb' : '#64748b' }}>Purchase Orders</span>
              <span style={{ fontWeight: '700', fontSize: '12px', background: activeTab === 'pos' ? 'rgba(37,99,235,0.1)' : '#f1f5f9', color: activeTab === 'pos' ? '#2563eb' : '#64748b', padding: '2px 8px', borderRadius: '12px' }}>
                {filteredPOs.length}
              </span>
            </div>

            <div 
              onClick={() => setActiveTab('invoices')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer', 
                borderBottom: activeTab === 'invoices' ? '2px solid #2563eb' : '2px solid transparent', 
                paddingBottom: '16px', 
                marginBottom: '-1px' 
              }}
            >
              <span style={{ fontWeight: '700', fontSize: '14px', color: activeTab === 'invoices' ? '#2563eb' : '#64748b' }}>Vendor Invoices (Flowed to Finance)</span>
              <span style={{ fontWeight: '700', fontSize: '12px', background: activeTab === 'invoices' ? 'rgba(37,99,235,0.1)' : '#f1f5f9', color: activeTab === 'invoices' ? '#2563eb' : '#64748b', padding: '2px 8px', borderRadius: '12px' }}>
                {filteredInvoices.length}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search orders, origin, vendors..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '10px 16px 10px 38px', borderRadius: '40px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', width: '260px', fontSize: '14px' }} 
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>
        </div>
        
        <div style={{ padding: '0 32px' }}>
          {activeTab === 'pos' ? (
            <DataTable columns={poCols} data={filteredPOs} />
          ) : (
            <DataTable columns={invoiceCols} data={filteredInvoices} />
          )}
        </div>
      </div>

      {/* MODAL 1: ADD/EDIT PURCHASE ORDER */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Purchase Order' : 'Edit Purchase Order'}>
        <form onSubmit={handleSubmitPO} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* REQUIREMENT: Company Code field */}
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

            {/* Vendor */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Vendor *</label>
              <select 
                value={formData.vendorId || ''} 
                onChange={e => {
                  const vendor = store.vendors?.find(v => v.id === e.target.value || v.code === e.target.value);
                  setFormData({
                    ...formData, 
                    vendorId: vendor?.id || e.target.value, 
                    vendorName: vendor?.name || '',
                    from: vendor ? `${vendor.name} (${vendor.location || 'Terminal Hub'})` : formData.from
                  });
                }} 
                required 
                className="form-input" 
              >
                <option value="">Select Vendor...</option>
                {store.vendors?.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.code})</option>
                ))}
              </select>
            </div>

            {/* REQUIREMENT: From field */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>From (Supplier Origin Facility / Address) *</label>
              <input 
                type="text" 
                value={formData.from || ''} 
                onChange={e => setFormData({ ...formData, from: e.target.value })} 
                required 
                className="form-input" 
                placeholder="e.g. Apex Steel Traders (Main Mills, New York Dock)"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>PO Date *</label>
              <input 
                type="date" 
                value={formData.date || ''} 
                onChange={e => setFormData({ ...formData, date: e.target.value })} 
                required 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Expected Date *</label>
              <input 
                type="date" 
                value={formData.expectedDate || ''} 
                onChange={e => setFormData({ ...formData, expectedDate: e.target.value })} 
                required 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Destination Warehouse *</label>
              <select 
                value={formData.warehouse || 'WH-RAW'} 
                onChange={e => setFormData({ ...formData, warehouse: e.target.value })} 
                required 
                className="form-input" 
              >
                <option value="WH-RAW">WH-RAW (Raw Materials Storage)</option>
                <option value="WH-MAIN">WH-MAIN (Main Distribution Center)</option>
                <option value="WH-CHEM">WH-CHEM (Hazardous Chemicals)</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Total Amount ($) *</label>
              <input 
                type="number" 
                value={formData.amount || ''} 
                onChange={e => setFormData({ ...formData, amount: e.target.value })} 
                required 
                className="form-input" 
                placeholder="2500"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Status</label>
              <select 
                value={formData.status || 'Draft'} 
                onChange={e => setFormData({ ...formData, status: e.target.value })} 
                className="form-input"
              >
                <option value="Draft">Draft</option>
                <option value="Released">Released</option>
                <option value="Received">Received</option>
                <option value="Pending Approval">Pending Approval</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
            <button type="submit" className="btn-dark-pill" style={{ cursor: 'pointer' }}>{modalMode === 'add' ? 'Save Purchase Order' : 'Update PO'}</button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD INVOICE (Procurement -> Finance Automated Flow) */}
      <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} title="Record Vendor Invoice (Procurement → Finance GL)">
        <form onSubmit={handleSubmitInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Receipt size={20} color="#2563eb" />
            <span style={{ fontSize: '13px', color: '#1e40af' }}>
              Saving this invoice automatically records a balanced <strong>Journal Entry</strong> into the General Ledger (Debit: 5010 Purchases, Credit: 2010 Accounts Payable).
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Invoice Number *</label>
              <input 
                type="text" 
                value={invoiceForm.invoiceNumber} 
                onChange={e => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })} 
                required 
                className="form-input" 
                placeholder="INV-PR-1004"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Reference Purchase Order *</label>
              <select 
                value={invoiceForm.poNumber} 
                onChange={e => handleSelectPOForInvoice(e.target.value)}
                className="form-input"
                required
              >
                {scopedPOs.map(po => (
                  <option key={po.id || po.orderNumber} value={po.id || po.orderNumber}>
                    {po.id || po.orderNumber} - {po.vendorName} (${po.amount || po.total})
                  </option>
                ))}
              </select>
            </div>

            {/* REQUIREMENT: Company Code */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Company Code *</label>
              <select 
                value={invoiceForm.companyCode} 
                onChange={e => setInvoiceForm({ ...invoiceForm, companyCode: e.target.value })}
                className="form-input"
                required
              >
                {companyCodes.map(cc => (
                  <option key={cc.code} value={cc.code}>{cc.code} - {cc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Vendor Name</label>
              <input 
                type="text" 
                value={invoiceForm.vendorName} 
                onChange={e => setInvoiceForm({ ...invoiceForm, vendorName: e.target.value })} 
                required 
                className="form-input" 
              />
            </div>

            {/* REQUIREMENT: From Field */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>From (Vendor Origin / Dispatch Facility) *</label>
              <input 
                type="text" 
                value={invoiceForm.from} 
                onChange={e => setInvoiceForm({ ...invoiceForm, from: e.target.value })} 
                required 
                className="form-input" 
                placeholder="e.g. Apex Steel Traders (Main Mills, NY)"
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Invoice Date *</label>
              <input 
                type="date" 
                value={invoiceForm.date} 
                onChange={e => setInvoiceForm({ ...invoiceForm, date: e.target.value })} 
                required 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Payment Due Date *</label>
              <input 
                type="date" 
                value={invoiceForm.dueDate} 
                onChange={e => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} 
                required 
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Invoice Posting Status *</label>
              <select 
                value={invoiceForm.status} 
                onChange={e => setInvoiceForm({ ...invoiceForm, status: e.target.value })} 
                className="form-input"
              >
                <option value="Posted">Posted (Generate General Ledger Entry)</option>
                <option value="Draft">Draft (Save Unposted to GL)</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>General Ledger Expense Account *</label>
              <select 
                value={invoiceForm.glAccount} 
                onChange={e => setInvoiceForm({ ...invoiceForm, glAccount: e.target.value })} 
                className="form-input"
              >
                <option value="5010">5010 - Raw Material Purchases & COGS</option>
                <option value="5020">5020 - Factory Power & Utilities Expense</option>
                <option value="5040">5040 - Logistics, Freight & Shipping</option>
              </select>
            </div>

            {/* REQUIREMENT: Line Items */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Invoice Line Items *</label>
                <button 
                  type="button" 
                  onClick={handleAddInvoiceItem}
                  style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'none', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  + Add Item
                </button>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ minWidth: '560px', width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '8px 12px' }}>Product / Material</th>
                      <th style={{ padding: '8px 12px', width: '90px' }}>Qty</th>
                      <th style={{ padding: '8px 12px', width: '80px' }}>UOM</th>
                      <th style={{ padding: '8px 12px', width: '110px' }}>Unit Price ($)</th>
                      <th style={{ padding: '8px 12px', width: '110px' }}>Total ($)</th>
                      <th style={{ padding: '8px 12px', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceForm.items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 8px' }}>
                          <input 
                            type="text" 
                            required 
                            placeholder="Item description..." 
                            value={it.item} 
                            onChange={e => handleInvoiceItemChange(idx, 'item', e.target.value)} 
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input 
                            type="number" 
                            min="1" 
                            required 
                            value={it.qty} 
                            onChange={e => handleInvoiceItemChange(idx, 'qty', e.target.value)} 
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input 
                            type="text" 
                            value={it.uom} 
                            onChange={e => handleInvoiceItemChange(idx, 'uom', e.target.value)} 
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
                            onChange={e => handleInvoiceItemChange(idx, 'unitPrice', e.target.value)} 
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 12px', fontWeight: '700', color: '#0f172a' }}>
                          ${(parseFloat(it.amount) || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          {invoiceForm.items.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveInvoiceItem(idx)}
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

            {/* Subtotal & Taxes */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Subtotal ($)</label>
              <input 
                type="number" 
                readOnly 
                className="form-input" 
                value={invoiceForm.subtotal || invoiceForm.amount} 
                style={{ background: '#f8fafc', color: '#64748b', fontWeight: '600' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Tax Rate (%)</label>
              <select 
                value={invoiceForm.taxRate} 
                onChange={e => {
                  const rate = parseFloat(e.target.value) || 0;
                  const sub = parseFloat(invoiceForm.subtotal || invoiceForm.amount) || 0;
                  const tx = Math.round(sub * (rate / 100));
                  setInvoiceForm(prev => ({
                    ...prev,
                    taxRate: rate,
                    tax: tx,
                    amount: sub + tx
                  }));
                }} 
                className="form-input"
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
                value={invoiceForm.tax || 0} 
                style={{ background: '#f8fafc', color: '#64748b' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Grand Total ($) *</label>
              <input 
                type="number" 
                readOnly 
                className="form-input" 
                value={invoiceForm.amount} 
                style={{ background: '#f8fafc', fontWeight: '800', color: '#0f172a', fontSize: '15px' }}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Notes / Description</label>
              <input 
                type="text" 
                value={invoiceForm.notes} 
                onChange={e => setInvoiceForm({ ...invoiceForm, notes: e.target.value })} 
                className="form-input" 
                placeholder="e.g. Approved against shipment receipt"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsInvoiceModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}>
              Cancel
            </button>
            <button type="submit" style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '30px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Receipt size={16} /> {invoiceForm.status === 'Draft' ? 'Save Draft Invoice' : 'Post Invoice to GL'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
