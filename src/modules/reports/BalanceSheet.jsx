import React, { useState } from 'react';
import { Download, Printer, Filter, Calendar, Building2, CheckCircle2, ShieldCheck, Scale, AlertTriangle } from 'lucide-react';
import { useStore } from '../../data/mockStore';

export default function BalanceSheet() {
  const store = useStore();
  const journalEntries = store.journalEntries || [];
  const glAccounts = store.glAccounts || [];
  const companyCodes = store.companyCodes || [
    { code: '1000', name: 'Flex Manufacturing Corp' },
    { code: '2000', name: 'Flex Industries Europe Ltd' },
    { code: '3000', name: 'Flex Tech India Solutions' }
  ];

  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().slice(0, 10));

  // Filter entries based on company code and strictly POSTED status
  const scopedEntries = (Array.isArray(journalEntries) ? journalEntries : []).filter(entry => {
    if (!entry) return false;
    if (entry.status && entry.status !== 'Posted') return false;
    return selectedCompany === 'ALL' || String(entry.companyCode) === String(selectedCompany);
  });

  // Baseline opening balance allocated to primary entity (1000) or ALL
  const getAccountOpening = (code) => {
    if (selectedCompany !== 'ALL' && selectedCompany !== '1000') return 0;
    const acc = glAccounts.find(a => String(a.code) === String(code));
    return acc ? (parseFloat(acc.balance) || 0) : 0;
  };

  // Calculate dynamic account net from journal entries
  const getAccountNet = (code, normalBalance) => {
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

    if (normalBalance === 'Debit') {
      return debits - credits;
    }
    return credits - debits;
  };

  const getAccountBalance = (code, normalBalance) => {
    const opening = getAccountOpening(code);
    const net = getAccountNet(code, normalBalance);
    return Math.max(0, opening + net);
  };

  // ASSETS
  const cashAndBank = getAccountBalance('1010', 'Debit');
  const accountsReceivable = getAccountBalance('1020', 'Debit');
  const rawMaterialInventory = getAccountBalance('1030', 'Debit');
  const totalCurrentAssets = cashAndBank + accountsReceivable + rawMaterialInventory;

  const fixedAssets = getAccountBalance('1040', 'Debit');
  const totalNonCurrentAssets = fixedAssets;

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  // LIABILITIES
  const accountsPayable = getAccountBalance('2010', 'Credit');
  const taxPayable = getAccountBalance('2020', 'Credit');
  const totalLiabilities = accountsPayable + taxPayable;

  // EQUITY & P&L INTEGRATION
  // Compute net income from revenues and expenses
  const salesRev = getAccountBalance('4010', 'Credit');
  const serviceRev = getAccountBalance('4020', 'Credit');
  const cogs = getAccountBalance('5010', 'Debit');
  const utils = getAccountBalance('5020', 'Debit');
  const salaries = getAccountBalance('5030', 'Debit');
  const logistics = getAccountBalance('5040', 'Debit');
  const currentNetIncome = (salesRev + serviceRev) - (cogs + utils + salaries + logistics);

  const shareCapital = getAccountBalance('3010', 'Credit');
  const retainedEarnings = getAccountBalance('3020', 'Credit');
  const totalEquity = shareCapital + retainedEarnings + currentNetIncome;

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1;

  const handleExport = () => {
    const headers = ['Classification', 'Account Code', 'Description', 'Amount ($)'];
    const rows = [
      ['Current Assets', '1010', 'Cash & Bank Operations', cashAndBank],
      ['Current Assets', '1020', 'Accounts Receivable (Customers)', accountsReceivable],
      ['Current Assets', '1030', 'Raw Material Inventory & Stock', rawMaterialInventory],
      ['Total Current Assets', '', '', totalCurrentAssets],
      ['Non-Current Assets', '1040', 'Property, Plant & Equipment', fixedAssets],
      ['TOTAL ASSETS', '', '', totalAssets],
      ['Current Liabilities', '2010', 'Accounts Payable (Vendors)', accountsPayable],
      ['Current Liabilities', '2020', 'Sales Tax & VAT Payable', taxPayable],
      ['Total Liabilities', '', '', totalLiabilities],
      ['Equity', '3010', 'Shareholder Capital', shareCapital],
      ['Equity', '3020', 'Retained Earnings', retainedEarnings],
      ['Equity', 'RE-PL', 'Current Period Retained Profit (from P&L)', currentNetIncome],
      ['Total Equity', '', '', totalEquity],
      ['TOTAL LIABILITIES & EQUITY', '', '', totalLiabilitiesAndEquity]
    ];

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Balance_Sheet_${selectedCompany}_${asOfDate}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex-between">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#047857', background: 'rgba(4,120,87,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Balance Sheet & Solvency</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a' }}>Balance Sheet Statement</h1>
          <p style={{ color: '#64748b' }}>Statement of Financial Position: Assets, Liabilities, and Shareholder Equity dynamically verified for accounting equation balance.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={() => window.print()} style={{ background: '#ffffff', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px 20px', borderRadius: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={16} /> Print Balance Sheet
          </button>
          <button className="btn-dark-pill" onClick={handleExport} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Ribbon & Balance Banner */}
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
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>As of Date:</span>
            <input 
              type="date" 
              value={asOfDate} 
              onChange={e => setAsOfDate(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: '600', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isBalanced ? '#059669' : '#dc2626', fontSize: '13px', fontWeight: '700', background: isBalanced ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', padding: '8px 16px', borderRadius: '20px' }}>
          {isBalanced ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{isBalanced ? '✔ Balance Sheet Perfectly Balanced (Assets = Liabilities + Equity)' : 'Warning: Out of balance'}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Total Assets</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>${totalAssets.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>Current & Capital Assets</div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Total Liabilities</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#ef4444', margin: '4px 0' }}>${totalLiabilities.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Accounts payable & taxes</div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Shareholder Equity</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#047857', margin: '4px 0' }}>${totalEquity.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#047857', fontWeight: '600' }}>Capital + Retained Earnings</div>
        </div>

        <div className="card" style={{ padding: '20px', borderRadius: '20px', background: '#ffffff' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Working Capital</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#7c3aed', margin: '4px 0' }}>
            ${(totalCurrentAssets - totalLiabilities).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#7c3aed', fontWeight: '600' }}>Current Assets - Liabilities</div>
        </div>
      </div>

      {/* Structured Two-Column Balance Sheet */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: ASSETS */}
        <div className="card" style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>ASSETS</h2>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Economic resources owned by enterprise</div>
          </div>

          {/* Current Assets */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', marginBottom: '8px' }}>
              Current Assets
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>1010</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Cash & Bank Operations</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${cashAndBank.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>1020</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Accounts Receivable (Customers)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${accountsReceivable.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>1030</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Raw Material Inventory & Stock</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${rawMaterialInventory.toLocaleString()}</td>
                </tr>
                <tr style={{ fontWeight: '700', background: 'rgba(37,99,235,0.04)' }}>
                  <td colSpan={2} style={{ padding: '8px 12px', color: '#0f172a' }}>Total Current Assets</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#2563eb' }}>${totalCurrentAssets.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Non-Current Assets */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', marginBottom: '8px' }}>
              Non-Current Assets
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#2563eb' }}>1040</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Property, Plant & Equipment (PPE)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${fixedAssets.toLocaleString()}</td>
                </tr>
                <tr style={{ fontWeight: '700', background: 'rgba(37,99,235,0.04)' }}>
                  <td colSpan={2} style={{ padding: '8px 12px', color: '#0f172a' }}>Total Non-Current Assets</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#2563eb' }}>${totalNonCurrentAssets.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTAL ASSETS FOOTER */}
          <div style={{ marginTop: 'auto', background: '#0f172a', color: '#ffffff', padding: '16px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '17px' }}>
            <span>TOTAL ASSETS</span>
            <span style={{ color: '#60a5fa' }}>${totalAssets.toLocaleString()}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
        <div className="card" style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ borderBottom: '2px solid #047857', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#047857' }}>LIABILITIES & EQUITY</h2>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Enterprise claims and shareholder equity</div>
          </div>

          {/* Current Liabilities */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', marginBottom: '8px' }}>
              Current Liabilities
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#ef4444' }}>2010</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Accounts Payable (Vendor Bills)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${accountsPayable.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#ef4444' }}>2020</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Sales Tax & VAT Payable</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${taxPayable.toLocaleString()}</td>
                </tr>
                <tr style={{ fontWeight: '700', background: 'rgba(239,68,68,0.04)' }}>
                  <td colSpan={2} style={{ padding: '8px 12px', color: '#0f172a' }}>Total Liabilities</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#ef4444' }}>${totalLiabilities.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Shareholder Equity */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', marginBottom: '8px' }}>
              Shareholder Equity
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#047857' }}>3010</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Shareholder Capital</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${shareCapital.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#047857' }}>3020</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Retained Earnings</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '600' }}>${retainedEarnings.toLocaleString()}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#047857' }}>P&L</td>
                  <td style={{ padding: '8px 12px', fontWeight: '500' }}>Current Period Net Income (from P&L)</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700', color: currentNetIncome >= 0 ? '#047857' : '#ef4444' }}>
                    ${currentNetIncome.toLocaleString()}
                  </td>
                </tr>
                <tr style={{ fontWeight: '700', background: 'rgba(4,120,87,0.04)' }}>
                  <td colSpan={2} style={{ padding: '8px 12px', color: '#0f172a' }}>Total Equity</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#047857' }}>${totalEquity.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTAL LIABILITIES & EQUITY FOOTER */}
          <div style={{ marginTop: 'auto', background: '#0f172a', color: '#ffffff', padding: '16px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '17px' }}>
            <span>TOTAL LIABILITIES & EQUITY</span>
            <span style={{ color: '#34d399' }}>${totalLiabilitiesAndEquity.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
