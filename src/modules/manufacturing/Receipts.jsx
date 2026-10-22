import React from 'react';
import { Package, CheckCircle2 } from 'lucide-react';

export default function Receipts() {
  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Production Receipt</h1>
          <p style={{ color: 'var(--color-text-gray)' }}>Manufacturing &gt; Shop Floor &gt; Receipt from Production</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16}/> Post Receipt</button>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Production Order</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>MO-000184</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Item</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>FG-INS-100</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Order Quantity</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>2,500 EA</p></div>
        <div><label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Previously Received</label><p style={{ fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>0 EA</p></div>
      </div>

      <div className="card-glass" style={{ padding: '24px', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={20} color="#3b82f6"/> Enter Receipt Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Receipt Quantity *</label>
            <input type="text" defaultValue="2,430" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '16px', fontWeight: '600' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Target Warehouse *</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }}>
              <option>FG-TOL - Finished Goods Toledo</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Target Bin</label>
            <input type="text" defaultValue="RACK-04-A" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Lot Number</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="text" defaultValue="LOT-FG-260921" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
              <button className="btn-outline" style={{ background: 'white', padding: '0 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '600' }}>Generate</button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <input type="checkbox" id="closeOrder" style={{ width: '16px', height: '16px' }} />
            <label htmlFor="closeOrder" style={{ fontSize: '14px', fontWeight: '500' }}>Close production order (no further receipts expected)</label>
          </div>
        </div>
      </div>
    </div>
  );
}
