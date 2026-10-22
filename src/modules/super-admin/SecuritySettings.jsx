import React, { useState } from 'react';
import { Shield, Lock, Key, AlertTriangle, Save } from 'lucide-react';

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  return (
    <div style={{ padding: '32px 40px', background: '#f8fafc', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>Security Policies</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Configure system-wide security, password rules, and access control.</p>
        </div>
        <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000) }} disabled={loading} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
          <Save size={16} /> {loading ? 'Saving...' : 'Save Policies'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="#4f46e5" /> Password Rules
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Minimum Length</span>
              <input type="number" defaultValue={8} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '80px' }} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Require Uppercase</span>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Require Numbers</span>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Require Special Characters</span>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
            </label>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={20} color="#f59e0b" /> MFA & Authentication
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Require MFA for Super Admins</span>
              <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px' }} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Require MFA for Company Admins</span>
              <input type="checkbox" style={{ width: '16px', height: '16px' }} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Session Timeout (minutes)</span>
              <input type="number" defaultValue={60} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '80px' }} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
