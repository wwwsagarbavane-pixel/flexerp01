import React from 'react';

export default function DataTable({ columns, data }) {
  return (
    <div className="table-responsive" style={{ width: '100%', overflowX: 'auto', background: 'var(--color-surface)', borderRadius: 'var(--border-radius-sm)' }}>
      <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)', fontSize: '12px', textTransform: 'uppercase' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-light)' }}>No data available</td></tr>
          ) : data.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-text-dark)' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
