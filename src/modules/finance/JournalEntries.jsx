import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, Edit2, Trash2, Eye, Landmark, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, FileSpreadsheet, Building2, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { useStore } from '../../data/mockStore';
import { useToastStore } from '../../data/toastStore';
import './JournalEntries.css';

export default function JournalEntries() {
  const store = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const addToast = useToastStore(state => state.addToast);
  
  const journalEntries = store.journalEntries || [];
  const glAccounts = store.glAccounts || [];
  const companyCodes = store.companyCodes || [
    { code: '1000', name: 'Flex Manufacturing Corp' },
    { code: '2000', name: 'Flex Industries Europe Ltd' },
    { code: '3000', name: 'Flex Tech India Solutions' }
  ];

  // Derive activeTab from URL path
  const activeTab = location.pathname.includes('general-ledger')
    ? 'ledger'
    : location.pathname.includes('invoices')
    ? 'flow'
    : 'entries';

  const handleTabChange = (tab) => {
    if (tab === 'ledger') navigate('/app/finance/general-ledger');
    else if (tab === 'flow') navigate('/app/finance/invoices');
    else navigate('/app/finance/journal-entries');
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('ALL');
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    entryNumber: '',
    date: new Date().toISOString().slice(0, 10),
    companyCode: '1000',
    description: '',
    sourceModule: 'Manual / Adjustment',
    lines: [
      { accountCode: '1010', accountName: 'Cash & Bank Operations', debit: 5000, credit: 0 },
      { accountCode: '3010', accountName: 'Shareholder Capital', debit: 0, credit: 5000 }
    ]
  });

  const filteredEntries = journalEntries.filter(item => {
    const matchesSearch = Object.values(item).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.lines && item.lines.some(l => l.accountName?.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCompany = selectedCompanyFilter === 'ALL' || item.companyCode === selectedCompanyFilter;
    const matchesSource = selectedSourceFilter === 'ALL' || item.sourceModule === selectedSourceFilter;
    return matchesSearch && matchesCompany && matchesSource;
  });

  // Calculate live dynamic balances for GL Accounts based on all Journal Entries
  const calculatedGLAccounts = glAccounts.map(acc => {
    let debits = 0;
    let credits = 0;
    journalEntries.forEach(entry => {
      if (selectedCompanyFilter === 'ALL' || entry.companyCode === selectedCompanyFilter) {
        if (entry.lines) {
          entry.lines.forEach(l => {
            if (String(l.accountCode) === String(acc.code)) {
              debits += parseFloat(l.debit || 0);
              credits += parseFloat(l.credit || 0);
            }
          });
        }
      }
    });

    let currentBalance = acc.balance || 0;
    if (acc.normalBalance === 'Debit') {
      currentBalance = currentBalance + debits - credits;
    } else {
      currentBalance = currentBalance + credits - debits;
    }

    return {
      ...acc,
      periodDebits: debits,
      periodCredits: credits,
      effectiveBalance: currentBalance
    };
  });

  const totalEntriesCount = filteredEntries.length;
  const procurementCount = journalEntries.filter(e => e.sourceModule === 'Procurement').length;
  const salesCount = journalEntries.filter(e => e.sourceModule === 'Sales').length;
  const totalVolume = filteredEntries.reduce((sum, e) => sum + (parseFloat(e.totalAmount) || 0), 0);

  const handleExport = () => {
    if (filteredEntries.length === 0) return;
    const headers = ['Entry Number', 'Date', 'Company Code', 'Source Module', 'Reference', 'Description', 'Total Amount', 'Status'];
    const rows = filteredEntries.map(r => `"${r.entryNumber || r.id}","${r.date}","${r.companyCode || '1000'}","${r.sourceModule || ''}","${r.reference || ''}","${r.description || ''}","${r.totalAmount || 0}","${r.status || 'Posted'}"`);
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'journal_entries_gl.csv';
    a.click();
  };

  const handleOpenModal = () => {
    setNewEntry({
      entryNumber: `JE-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      companyCode: '1000',
      description: 'Monthly office rent & maintenance accrual',
      sourceModule: 'Manual / Adjustment',
      lines: [
        { accountCode: '5020', accountName: 'Factory Power & Utilities Expense', debit: 3500, credit: 0 },
        { accountCode: '1010', accountName: 'Cash & Bank Operations', debit: 0, credit: 3500 }
      ]
    });
    setIsModalOpen(true);
  };

  const handleAddLine = () => {
    setNewEntry(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        { accountCode: '1010', accountName: 'Cash & Bank Operations', debit: 0, credit: 0 }
      ]
    }));
  };

  const handleRemoveLine = (idx) => {
    if (newEntry.lines.length <= 2) {
      addToast('A double-entry voucher requires at least two lines', 'error');
      return;
    }
    setNewEntry(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== idx)
    }));
  };

  const handleLineChange = (idx, field, value) => {
    setNewEntry(prev => {
      const updatedLines = [...prev.lines];
      if (field === 'accountCode') {
        const acc = glAccounts.find(a => a.code === value);
        updatedLines[idx] = {
          ...updatedLines[idx],
          accountCode: value,
          accountName: acc ? acc.name : updatedLines[idx].accountName
        };
      } else {
        updatedLines[idx] = {
          ...updatedLines[idx],
          [field]: parseFloat(value) || 0
        };
      }
      return { ...prev, lines: updatedLines };
    });
  };

  const sumDebits = newEntry.lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0);
  const sumCredits = newEntry.lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0);
  const isBalanced = Math.abs(sumDebits - sumCredits) < 0.01 && sumDebits > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isBalanced) {
      addToast('Cannot post: Total Debits must equal Total Credits!', 'error');
      return;
    }

    const res = await store.addJournalEntry({
      ...newEntry,
      totalAmount: sumDebits
    });

    if (res) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to reverse/delete this journal entry?')) {
      store.deleteJournalEntry(id);
      addToast('Journal Entry removed', 'info');
    }
  };

  return (
    <div className="journal-entries-page">
      {/* Header */}
      <div className="je-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7c3aed', background: 'rgba(124,58,237,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Finance & Accounting</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a' }}>General Ledger & Journal Entries</h1>
          <p style={{ color: '#64748b' }}>Complete double-entry accounting ledger. Procurement and Sales invoices automatically post into respective GL accounts.</p>
        </div>
        <div className="je-header-actions">
          <button className="btn-outline" onClick={handleExport} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 24px', borderRadius: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={16} /> Export
          </button>
          <button 
            onClick={handleOpenModal} 
            style={{ 
              background: '#7c3aed', 
              color: '#ffffff', 
              border: 'none', 
              boxShadow: '0 4px 14px rgba(124,58,237,0.25)', 
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
            <Plus size={18} /> New Journal Entry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid-responsive">
        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Landmark size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Journal Entries</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>{totalEntriesCount}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Balance Integrity</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>100% Balanced</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Procurement Inflows</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>{procurementCount} Auto-Posted</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(234,88,12,0.1)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Sales Outflows</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#ea580c' }}>{salesCount} Auto-Posted</div>
          </div>
        </div>
      </div>

      {/* Main Content Card with Sub-tabs */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 0 24px 0', background: '#ffffff', borderRadius: '24px', overflow: 'hidden' }}>
        <div className="je-card-header">
          <div className="je-tabs-scroll">
            <div 
              className="je-tab-item"
              onClick={() => handleTabChange('entries')}
              style={{ 
                borderBottom: activeTab === 'entries' ? '2px solid #7c3aed' : '2px solid transparent', 
                color: activeTab === 'entries' ? '#7c3aed' : '#64748b'
              }}
            >
              <span>Journal Entries (Vouchers)</span>
              <span style={{ fontWeight: '700', fontSize: '12px', background: activeTab === 'entries' ? 'rgba(124,58,237,0.1)' : '#f1f5f9', color: activeTab === 'entries' ? '#7c3aed' : '#64748b', padding: '2px 8px', borderRadius: '12px' }}>
                {filteredEntries.length}
              </span>
            </div>

            <div 
              className="je-tab-item"
              onClick={() => handleTabChange('ledger')}
              style={{ 
                borderBottom: activeTab === 'ledger' ? '2px solid #7c3aed' : '2px solid transparent', 
                color: activeTab === 'ledger' ? '#7c3aed' : '#64748b'
              }}
            >
              <span>GL Accounts (Chart of Accounts)</span>
              <span style={{ fontWeight: '700', fontSize: '12px', background: activeTab === 'ledger' ? 'rgba(124,58,237,0.1)' : '#f1f5f9', color: activeTab === 'ledger' ? '#7c3aed' : '#64748b', padding: '2px 8px', borderRadius: '12px' }}>
                {calculatedGLAccounts.length}
              </span>
            </div>

            <div 
              className="je-tab-item"
              onClick={() => handleTabChange('flow')}
              style={{ 
                borderBottom: activeTab === 'flow' ? '2px solid #7c3aed' : '2px solid transparent', 
                color: activeTab === 'flow' ? '#7c3aed' : '#64748b'
              }}
            >
              <span>Automated Invoice Flow Audit</span>
            </div>
          </div>

          <div className="je-filters-container">
            {/* Filter by Company Code */}
            <select 
              value={selectedCompanyFilter} 
              onChange={e => setSelectedCompanyFilter(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '30px', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '13px', fontWeight: '600', color: '#334155' }}
            >
              <option value="ALL">All Company Codes</option>
              {companyCodes.map(cc => (
                <option key={cc.code} value={cc.code}>Co. {cc.code} - {cc.name}</option>
              ))}
            </select>

            {/* Filter by Source */}
            {activeTab === 'entries' && (
              <select 
                value={selectedSourceFilter} 
                onChange={e => setSelectedSourceFilter(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '30px', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '13px', fontWeight: '600', color: '#334155' }}
              >
                <option value="ALL">All Sources</option>
                <option value="Procurement">Procurement (Vendor Invoices)</option>
                <option value="Sales">Sales (Customer Bills)</option>
                <option value="Manual / Adjustment">Manual Adjustments</option>
              </select>
            )}

            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search entries or GL..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '10px 16px 10px 38px', borderRadius: '40px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', width: '220px', fontSize: '14px' }} 
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>
        </div>
        
        {/* TAB 1: JOURNAL ENTRIES LIST WITH ACCORDION DETAILS */}
        {activeTab === 'entries' && (
          <div className="je-entries-list-container">
            {filteredEntries.map(entry => {
              const isExpanded = expandedEntryId === entry.id;
              const isProc = entry.sourceModule === 'Procurement';
              const isSales = entry.sourceModule === 'Sales';

              return (
                <div 
                  key={entry.id} 
                  className="je-entry-card"
                  style={{ background: isExpanded ? '#fafafa' : '#ffffff' }}
                >
                  <div 
                    className="je-entry-header"
                    onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                  >
                    <div className="je-entry-info">
                      <div style={{ color: '#64748b', marginTop: '2px', flexShrink: 0 }}>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, gap: '4px' }}>
                        <div className="je-entry-title-row">
                          <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a', whiteSpace: 'nowrap' }}>
                            {entry.entryNumber || entry.id}
                          </span>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '700', color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                            Co. {entry.companyCode || '1000'}
                          </span>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            padding: '2px 8px', 
                            borderRadius: '12px',
                            whiteSpace: 'nowrap',
                            background: isProc ? 'rgba(37,99,235,0.1)' : isSales ? 'rgba(234,88,12,0.1)' : 'rgba(124,58,237,0.1)',
                            color: isProc ? '#2563eb' : isSales ? '#ea580c' : '#7c3aed'
                          }}>
                            {isProc ? 'Procurement Auto-Post' : isSales ? 'Sales Auto-Post' : 'Manual Journal'}
                          </span>
                        </div>
                        <span style={{ fontSize: '13px', color: '#475569', wordBreak: 'break-word' }}>
                          {entry.description} • Ref: <strong>{entry.reference || 'N/A'}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="je-entry-meta">
                      <div className="je-entry-amount-block" style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap' }}>
                          ${entry.totalAmount?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>{entry.date}</div>
                      </div>
                      <div className="je-entry-meta-right">
                        <span className="status-badge badge-success">Posted</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }} 
                          style={{ padding: '6px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                          title="Delete Journal Entry"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Multi-Line Double-Entry Ledger Details */}
                  {isExpanded && (
                    <div style={{ padding: '16px 20px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '8px' }}>
                        Double-Entry Ledger Lines
                      </div>
                      <div className="table-responsive" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ width: '100%', minWidth: '450px', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                              <th style={{ padding: '8px 0' }}>GL Account Code</th>
                              <th style={{ padding: '8px 0' }}>Account Title</th>
                              <th style={{ padding: '8px 0', textAlign: 'right' }}>Debit ($)</th>
                              <th style={{ padding: '8px 0', textAlign: 'right' }}>Credit ($)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.lines && entry.lines.map((line, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '10px 0', fontFamily: 'monospace', fontWeight: '600', color: '#2563eb' }}>GL-{line.accountCode}</td>
                                <td style={{ padding: '10px 0', fontWeight: '500', color: '#0f172a' }}>{line.accountName}</td>
                                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: line.debit > 0 ? '700' : '400', color: line.debit > 0 ? '#0f172a' : '#94a3b8' }}>
                                  {line.debit > 0 ? `$${line.debit.toLocaleString()}` : '—'}
                                </td>
                                <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: line.credit > 0 ? '700' : '400', color: line.credit > 0 ? '#0f172a' : '#94a3b8' }}>
                                  {line.credit > 0 ? `$${line.credit.toLocaleString()}` : '—'}
                                </td>
                              </tr>
                            ))}
                            <tr style={{ borderTop: '2px solid #e2e8f0', fontWeight: '800' }}>
                              <td colSpan={2} style={{ padding: '10px 0', color: '#047857' }}>
                                ✔ Balanced Ledger (Debits = Credits)
                              </td>
                              <td style={{ padding: '10px 0', textAlign: 'right', color: '#0f172a' }}>${entry.totalAmount?.toLocaleString()}</td>
                              <td style={{ padding: '10px 0', textAlign: 'right', color: '#0f172a' }}>${entry.totalAmount?.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: GENERAL LEDGER CHART OF ACCOUNTS */}
        {activeTab === 'ledger' && (
          <div className="table-responsive" style={{ padding: '0 20px', width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px' }}>Account Code</th>
                  <th style={{ padding: '12px 8px' }}>Account Name</th>
                  <th style={{ padding: '12px 8px' }}>Category</th>
                  <th style={{ padding: '12px 8px' }}>Normal Side</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Period Debits</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Period Credits</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Net Balance</th>
                </tr>
              </thead>
              <tbody>
                {calculatedGLAccounts.map(acc => {
                  const isAsset = acc.type === 'Asset';
                  const isRev = acc.type === 'Revenue';
                  const isExp = acc.type === 'Expense';
                  const isLiab = acc.type === 'Liability';

                  return (
                    <tr key={acc.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: '700', color: '#2563eb' }}>
                        {acc.code}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: '600', color: '#0f172a' }}>
                        {acc.name}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          padding: '3px 8px', 
                          borderRadius: '12px',
                          background: isAsset ? 'rgba(37,99,235,0.08)' : isRev ? 'rgba(16,185,129,0.08)' : isExp ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                          color: isAsset ? '#2563eb' : isRev ? '#10b981' : isExp ? '#ef4444' : '#d97706'
                        }}>
                          {acc.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#64748b' }}>{acc.normalBalance}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>
                        {acc.periodDebits > 0 ? `$${acc.periodDebits.toLocaleString()}` : '$0'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '500' }}>
                        {acc.periodCredits > 0 ? `$${acc.periodCredits.toLocaleString()}` : '$0'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>
                        ${acc.effectiveBalance.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: AUTOMATED INVOICE FLOW AUDIT */}
        {activeTab === 'flow' && (
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px 20px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Automated Accounting Integration Rules</h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Every Procurement invoice triggers: <code>Dr. 5010 Raw Material Purchases | Cr. 2010 Accounts Payable</code>.<br/>
                Every Sales billing triggers: <code>Dr. 1020 Accounts Receivable | Cr. 4010 Sales Revenue & Cr. 2020 VAT</code>.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Procurement Invoices */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} /> Procurement Invoices Flow ({store.procurementInvoices?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {store.procurementInvoices?.map(inv => (
                    <div key={inv.id} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px' }}>{inv.invoiceNumber || inv.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>From: {inv.from || inv.vendorName} • Co. {inv.companyCode}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>${inv.amount}</div>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>→ GL-5010 / 2010</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Invoices */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#ea580c', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileSpreadsheet size={16} /> Sales Billing Flow ({store.salesInvoices?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {store.salesInvoices?.map(inv => (
                    <div key={inv.id} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px' }}>{inv.invoiceNumber || inv.id}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>To: {inv.customer} • Co. {inv.companyCode}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>${inv.total || inv.amount}</div>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>→ GL-1020 / 4010</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: NEW JOURNAL ENTRY */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Journal Entry Voucher">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Voucher / JE # *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                value={newEntry.entryNumber} 
                onChange={e => setNewEntry({ ...newEntry, entryNumber: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Posting Date *</label>
              <input 
                type="date" 
                required 
                className="form-input" 
                value={newEntry.date} 
                onChange={e => setNewEntry({ ...newEntry, date: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Company Code *</label>
              <select 
                className="form-input" 
                value={newEntry.companyCode} 
                onChange={e => setNewEntry({ ...newEntry, companyCode: e.target.value })}
                required
              >
                {companyCodes.map(cc => (
                  <option key={cc.code} value={cc.code}>{cc.code} - {cc.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 3' }}>
              <label style={{ fontSize: '13px', fontWeight: '600' }}>Voucher Narration / Description *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                value={newEntry.description} 
                onChange={e => setNewEntry({ ...newEntry, description: e.target.value })} 
                placeholder="e.g. Month-end depreciation adjustment"
              />
            </div>
          </div>

          {/* Ledger Lines */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Double-Entry Lines</span>
              <button 
                type="button" 
                onClick={handleAddLine} 
                style={{ padding: '6px 14px', borderRadius: '16px', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
              >
                + Add Line
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {newEntry.lines.map((line, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <select 
                      className="form-input" 
                      value={line.accountCode} 
                      onChange={e => handleLineChange(idx, 'accountCode', e.target.value)}
                    >
                      {glAccounts.map(a => (
                        <option key={a.code} value={a.code}>{a.code} - {a.name} ({a.type})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="Debit" 
                      className="form-input" 
                      value={line.debit || ''} 
                      onChange={e => handleLineChange(idx, 'debit', e.target.value)}
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="Credit" 
                      className="form-input" 
                      value={line.credit || ''} 
                      onChange={e => handleLineChange(idx, 'credit', e.target.value)}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveLine(idx)} 
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Validation Totals */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '12px 16px', background: isBalanced ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: '14px', border: `1px solid ${isBalanced ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isBalanced ? <CheckCircle2 size={18} color="#059669" /> : <AlertTriangle size={18} color="#dc2626" />}
                <span style={{ fontSize: '13px', fontWeight: '700', color: isBalanced ? '#059669' : '#dc2626' }}>
                  {isBalanced ? 'Voucher is perfectly balanced' : `Out of balance by $${Math.abs(sumDebits - sumCredits).toLocaleString()}`}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '700' }}>
                <span>Total Debits: <strong>${sumDebits.toLocaleString()}</strong></span>
                <span>Total Credits: <strong>${sumCredits.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', fontWeight: '600' }}>
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!isBalanced}
              style={{ 
                background: isBalanced ? '#7c3aed' : '#cbd5e1', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '30px', 
                padding: '10px 24px', 
                fontWeight: '700', 
                cursor: isBalanced ? 'pointer' : 'not-allowed' 
              }}
            >
              Post Journal Voucher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
