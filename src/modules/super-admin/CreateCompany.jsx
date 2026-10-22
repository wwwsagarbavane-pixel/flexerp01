import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../data/mockStore';
import { Save, ArrowLeft, Building2 } from 'lucide-react';

export default function CreateCompany() {
  const navigate = useNavigate();
  const store = useStore();
  
  const [formData, setFormData] = useState({
    name: '', code: '', legalName: '', gstin: '', pan: '',
    email: '', phone: '', address: '', city: '', state: '',
    pincode: '', country: '', currency: 'INR', timezone: 'Asia/Kolkata',
    financialYearStartMonth: 4,
    adminName: '', adminEmail: '', adminPassword: '',
    logoUrl: '',
    modules: ['Master Data', 'Procurement', 'Manufacturing', 'Quality & Maintenance', 'Sales', 'HR', 'Reports']
  });

  const availableModules = [
    'Master Data', 'Procurement', 'Manufacturing', 
    'Quality & Maintenance', 'Sales', 'HR', 'Reports'
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('flex_erp_token');
      const res = await fetch('/api/system/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: formData.name,
          companyCode: formData.code,
          legalName: formData.legalName,
          gstin: formData.gstin,
          pan: formData.pan,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          currency: formData.currency,
          timezone: formData.timezone,
          financialYearStartMonth: parseInt(formData.financialYearStartMonth),
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword,
          logoUrl: formData.logoUrl
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create company');
      }

      // Keep mock store updated just in case UI relies on it for now
      store.addCompany({
        ...formData,
        id: data.data.id,
        status: data.data.status,
        created: new Date().toISOString().split('T')[0],
        modules: formData.modules
      });
      
      navigate('/app/super-admin/companies');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px', background: '#f8fafc', minHeight: '100%' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Companies
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>Create New Company</h1>
      </div>

      {error && <div style={{ padding: '16px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

      <div className="card-glass" style={{ padding: '32px', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="#4f46e5" /> Company Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Company Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. Acme Corp" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Company Code *</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. ACM" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Legal Name</label>
                <input type="text" value={formData.legalName} onChange={e => setFormData({...formData, legalName: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. Acme Corporation Pvt Ltd" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>GSTIN</label>
                <input type="text" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value.toUpperCase()})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. 29ABCDE1234F1Z5" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>PAN</label>
                <input type="text" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. ABCDE1234F" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Company Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. info@acmecorp.com" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Phone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. +91 9876543210" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Company Logo</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.logoUrl && (
                    <img src={formData.logoUrl} alt="Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }} />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({...formData, logoUrl: reader.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }} style={{ padding: '8px', borderRadius: '8px', border: '1px dashed #cbd5e1', width: '100%', fontSize: '13px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }}></div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Address & Localization
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. 123 Industrial Area" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>City</label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. Mumbai" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>State</label>
                <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. Maharashtra" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Pincode</label>
                <input type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. 400001" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Country</label>
                <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. India" />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Base Currency</label>
                <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Timezone</label>
                <select value={formData.timezone} onChange={e => setFormData({...formData, timezone: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Financial Year Start</label>
                <select value={formData.financialYearStartMonth} onChange={e => setFormData({...formData, financialYearStartMonth: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <option value="4">April (India)</option>
                  <option value="1">January (Global)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }}></div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Module Allocation
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Select the ERP modules this company is licensed to use.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {availableModules.map(mod => (
                <label key={mod} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: formData.modules.includes(mod) ? '#eff6ff' : 'white', borderColor: formData.modules.includes(mod) ? '#3b82f6' : '#e2e8f0' }}>
                  <input 
                    type="checkbox" 
                    checked={formData.modules.includes(mod)}
                    disabled={mod === 'Master Data'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, modules: [...formData.modules, mod]});
                      } else {
                        setFormData({...formData, modules: formData.modules.filter(m => m !== mod)});
                      }
                    }}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>{mod}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }}></div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Primary Administrator Setup
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>This user will have full access to set up the ERP modules for this company.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Admin Full Name *</label>
                <input required type="text" value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. Rahul Sharma" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Admin Login Email *</label>
                <input required type="email" value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="e.g. rahul@acmecorp.com" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Admin Login Password *</label>
                <input required type="password" value={formData.adminPassword} onChange={e => setFormData({...formData, adminPassword: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Set a secure password" />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0' }}></div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
              <Save size={16} /> {loading ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
