import React, { useState } from 'react';
import { Download, Printer, Filter, Calendar, TrendingUp, TrendingDown, DollarSign, Building2, CheckCircle2, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { useStore } from '../../data/mockStore';

export default function PnL() {
  const store = useStore();
  const journalEntries = store?.journalEntries || [];
  const companyCodes = store?.companyCodes || [
    { code: '1000', name: 'Flex Manufacturing Corp' },
    { code: '2000', name: 'Flex Industries Europe Ltd' },
    { code: '3000', name: 'Flex Tech India Solutions' }
  ];

  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('FY2026');

  const fmt = (n) => Number(n || 0).toLocaleString();

  // Safely filter entries based on company code and POSTED status
  const scopedEntries = (Array.isArray(journalEntries) ? journalEntries : []).filter(entry => {
    if (!entry) return false;
    if (entry.status && entry.status !== 'Posted') return false;
    return selectedCompany === 'ALL' || String(entry.companyCode) === String(selectedCompany);
  });

  // Get baseline opening balance allocated to primary corporate entity (1000) or ALL
  const getAccountOpening = (code) => {
    if (selectedCompany !== 'ALL' && selectedCompany !== '1000') return 0;
    const acc = (store?.glAccounts || []).find(a => String(a.code) === String(code));
    return acc ? (parseFloat(acc.balance) || 0) : 0;
  };

  // Calculate Account Balances directly from Journal Entries safely
  const getAccountNet = (code, type) => {
    let debits = 0;
    let credits = 0;
    scopedEntries.forEach(entry => {
      if (entry && Array.isArray(entry.lines)) {
        entry.lines.forEach(l => {
          if (l && String(l.accountCode) === String(code)) {
            debits += parseFloat(l.debit || 0) || 0;
            credits += parseFloat(l.credit || 0) || 0;
          }
        });
      }
    });

    if (type === 'Revenue') {
      return credits - debits; // Revenue normal balance is Credit
    }
    return debits - credits; // Expense normal balance is Debit
  };

  const getAccountBalance = (code, type) => {
    const opening = getAccountOpening(code);
    const net = getAccountNet(code, type);
    return Math.max(0, opening + net);
  };

  // Account balances derived strictly from General Ledger
  const salesRevenue = getAccountBalance('4010', 'Revenue');
  const serviceRevenue = getAccountBalance('4020', 'Revenue');
  const totalRevenue = salesRevenue + serviceRevenue;

  const rawMaterialPurchases = getAccountBalance('5010', 'Expense');
  const utilitiesExpense = getAccountBalance('5020', 'Expense');
  const totalCOGS = rawMaterialPurchases + utilitiesExpense;

  const grossProfit = totalRevenue - totalCOGS;
  const grossMarginPct = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  const salariesExpense = getAccountBalance('5030', 'Expense');
  const logisticsExpense = getAccountBalance('5040', 'Expense');
  const totalOperatingExpenses = salariesExpense + logisticsExpense;

  const operatingIncome = grossProfit - totalOperatingExpenses;
  const estimatedTax = operatingIncome > 0 ? Math.round(operatingIncome * 0.15) : 0;
  const netIncome = operatingIncome - estimatedTax;
  const netMarginPct = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : '0.0';

  const handleExport = () => {
    const headers = ['Category', 'Account Code', 'Description', 'Amount ($)'];
    const rows = [
      ['Revenue', '4010', 'Finished Goods Sales Revenue', salesRevenue],
      ['Revenue', '4020', 'Service & Maintenance Revenue', serviceRevenue],
      ['Total Revenue', '', '', totalRevenue],
      ['COGS', '5010', 'Raw Material Purchases & COGS', rawMaterialPurchases],
      ['COGS', '5020', 'Factory Power & Utilities', utilitiesExpense],
      ['Total COGS', '', '', totalCOGS],
      ['Gross Profit', '', '', grossProfit],
      ['Operating Expenses', '5030', 'Salaries & Staff Compensation', salariesExpense],
      ['Operating Expenses', '5040', 'Logistics, Freight & Shipping', logisticsExpense],
      ['Total OpEx', '', '', totalOperatingExpenses],
      ['Operating Income (EBIT)', '', '', operatingIncome],
      ['Income Tax (15%)', '', '', estimatedTax],
      ['Net Profit / (Loss)', '', '', netIncome]
    ];

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PnL_Report_${selectedCompany}_${selectedPeriod}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Financial Statements</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a' }}>Profit & Loss (P&L) Statement</h1>
          <p style={{ color: '#64748b' }}>Live income statement calculated directly from recorded procurement invoices, sales billings, and journal entries.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={() => window.print()} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 20px', borderRadius: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Print Statement
          </button>
          <button className="btn-dark-pill" onClick={handleExport} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="card" style={{ padding: '16px 24px', borderRadius: '20px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="#64748b" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Company Code:</span>
            <select 
              value={selectedCompany} 
              onChange={e => setSelectedCompany(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600', fontSize: '13px' }}
            >
              <option value="ALL">All Consolidated Entities</option>
              {companyCodes.map(cc => (
                <option key={cc.code} value={cc.code}>{cc.code} - {cc.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#64748b" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Fiscal Period:</span>
            <select 
              value={selectedPeriod} 
              onChange={e => setSelectedPeriod(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600', fontSize: '13px' }}
            >
              <option value="FY2026">FY 2026-2027 (Full Year)</option>
              <option value="Q3-2026">Q3 2026 (Oct - Dec)</option>
              <option value="Q2-2026">Q2 2026 (Jul - Sep)</option>
              <option value="OCT-2026">Current Month (October 2026)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '13px', fontWeight: '700', background: 'rgba(16,185,129,0.08)', padding: '6px 14px', borderRadius: '20px' }}>
          <CheckCircle2 size={16} /> Live Data Synced from General Ledger ({scopedEntries.length} entries)
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Operating Revenue</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>${fmt(totalRevenue)}</div>
          <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <TrendingUp size={14} /> +14.2% vs prior period
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Cost of Goods Sold</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#ef4444', margin: '4px 0' }}>${fmt(totalCOGS)}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Raw materials & factory costs</div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Gross Profit (Margin)</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#2563eb', margin: '4px 0' }}>${fmt(grossProfit)}</div>
          <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700' }}>{grossMarginPct}% Gross Margin</div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Net Profit (Net Margin)</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: netIncome >= 0 ? '#10b981' : '#ef4444', margin: '4px 0' }}>
            ${fmt(netIncome)}
          </div>
          <div style={{ fontSize: '12px', color: netIncome >= 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
            {netMarginPct}% Net Margin
          </div>
        </div>
      </div>

      {/* Formal Structured Income Statement Table */}
      <div className="card" style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Income Statement Schedule</h2>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Company Code: <strong>{selectedCompany === 'ALL' ? 'Consolidated All Codes' : selectedCompany}</strong> | Reporting Currency: <strong>USD ($)</strong>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Prepared as of {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. REVENUE */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
              1. Operating Revenue
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb', width: '100px' }}>GL-4010</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Finished Goods Sales Revenue (Customer Invoices)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${fmt(salesRevenue)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>GL-4020</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Service, Engineering & Maintenance Revenue</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${fmt(serviceRevenue)}</td>
                </tr>
                <tr style={{ fontWeight: '800', background: 'rgba(37,99,235,0.04)' }}>
                  <td colSpan={2} style={{ padding: '10px 12px', color: '#0f172a' }}>Total Operating Revenue</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#2563eb' }}>${fmt(totalRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2. COST OF GOODS SOLD */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
              2. Cost of Goods Sold (COGS)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb', width: '100px' }}>GL-5010</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Raw Material Purchases & Direct Production (Vendor Bills)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${fmt(rawMaterialPurchases)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>GL-5020</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Factory Power & Utilities Expense</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${fmt(utilitiesExpense)}</td>
                </tr>
                <tr style={{ fontWeight: '800', background: 'rgba(239,68,68,0.04)' }}>
                  <td colSpan={2} style={{ padding: '10px 12px', color: '#0f172a' }}>Total Cost of Goods Sold</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#ef4444' }}>${fmt(totalCOGS)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GROSS PROFIT SUB-TOTAL */}
          <div style={{ padding: '14px 16px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '15px' }}>
            <span>GROSS PROFIT</span>
            <span style={{ color: '#0f172a', fontSize: '17px' }}>${fmt(grossProfit)}</span>
          </div>

          {/* 3. OPERATING EXPENSES */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
              3. Operating Expenses (OpEx)
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb', width: '100px' }}>GL-5030</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Salaries, Wages & Employee Compensation</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${fmt(salariesExpense)}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>GL-5040</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Logistics, Freight & Outward Shipping</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${fmt(logisticsExpense)}</td>
                </tr>
                <tr style={{ fontWeight: '800', background: 'rgba(239,68,68,0.04)' }}>
                  <td colSpan={2} style={{ padding: '10px 12px', color: '#0f172a' }}>Total Operating Expenses</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#ef4444' }}>${fmt(totalOperatingExpenses)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. NET PROFIT / LOSS SUMMARY */}
          <div style={{ borderTop: '2px solid #0f172a', paddingTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 12px', fontWeight: '700' }}>Operating Income (EBIT)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700' }}>${fmt(operatingIncome)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>Provision for Corporate Tax (15%)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>${fmt(estimatedTax)}</td>
                </tr>
                <tr style={{ background: '#0f172a', color: '#ffffff', fontWeight: '800', fontSize: '16px' }}>
                  <td style={{ padding: '14px 16px', borderRadius: '12px 0 0 12px' }}>NET PROFIT / (LOSS) FOR PERIOD</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', borderRadius: '0 12px 12px 0', color: netIncome >= 0 ? '#34d399' : '#f87171' }}>
                    ${fmt(netIncome)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
