import React, { useState } from 'react';
import { LayoutGrid, Table, Inbox } from 'lucide-react';
import './DataTable.css';

export default function DataTable({ columns = [], data = [] }) {
  // Mode: 'cards' or 'table' on mobile
  const [viewMode, setViewMode] = useState('cards');

  // Identify special columns for mobile cards
  const actionsCol = columns.find(c => c.key === 'actions' || c.label?.toLowerCase() === 'actions');
  const statusCol = columns.find(c => c.key === 'status' || c.label?.toLowerCase() === 'status');
  
  // Primary identifier column (code, id, employeeId, orderNumber, invoiceNumber, etc.)
  const primaryCodeCol = columns.find(c => 
    ['code', 'id', 'employeeId', 'orderNumber', 'invoiceNumber', 'voucher', 'key'].includes(c.key)
  ) || columns[0];

  // Title / Name column (name, title, customer, vendorName, companyName, etc.)
  const titleCol = columns.find(c => 
    ['name', 'title', 'companyName', 'customer', 'vendorName', 'item', 'description'].includes(c.key)
  ) || (columns[1] && columns[1] !== primaryCodeCol ? columns[1] : null);

  // Other detail columns
  const otherCols = columns.filter(c => 
    c !== actionsCol && 
    c !== statusCol && 
    c !== primaryCodeCol && 
    c !== titleCol
  );

  return (
    <div className={`data-table-container mode-${viewMode}`}>
      {/* Mobile View Toggle */}
      {data.length > 0 && (
        <div className="data-table-view-toggle">
          <button 
            type="button"
            className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Card View"
          >
            <LayoutGrid size={14} /> Cards
          </button>
          <button 
            type="button"
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Spreadsheet Table View"
          >
            <Table size={14} /> Table
          </button>
        </div>
      )}

      {/* 1. DESKTOP TABLE VIEW */}
      <div className="desktop-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-light)' }}>
                  No data available
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr key={row.id || row.code || i}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE CARDS VIEW (DEFAULT ON PHONES) */}
      <div className="mobile-cards-wrapper">
        {data.length === 0 ? (
          <div className="mobile-empty-state">
            <Inbox size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
            <div>No records available</div>
          </div>
        ) : (
          data.map((row, i) => (
            <div className="mobile-data-card" key={row.id || row.code || i}>
              {/* Top Row: Primary Tag + Status Badge */}
              <div className="mobile-card-top">
                {primaryCodeCol && (
                  <div className="mobile-card-primary-tag">
                    {primaryCodeCol.render ? primaryCodeCol.render(row[primaryCodeCol.key], row) : (row[primaryCodeCol.key] || `#${i+1}`)}
                  </div>
                )}
                {statusCol && (
                  <div>
                    {statusCol.render ? statusCol.render(row[statusCol.key], row) : row[statusCol.key]}
                  </div>
                )}
              </div>

              {/* Title Row */}
              {titleCol && (
                <div className="mobile-card-title">
                  {titleCol.render ? titleCol.render(row[titleCol.key], row) : (row[titleCol.key] ?? '')}
                </div>
              )}

              {/* Key Details Grid */}
              {otherCols.length > 0 && (
                <div className="mobile-card-fields-grid">
                  {otherCols.map(col => (
                    <div className="mobile-card-field-row" key={col.key}>
                      <span className="mobile-field-key">{col.label}:</span>
                      <span className="mobile-field-val">
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions Footer Row */}
              {actionsCol && (
                <div className="mobile-card-actions-row">
                  {actionsCol.render(row[actionsCol.key], row)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
