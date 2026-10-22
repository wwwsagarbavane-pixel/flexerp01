import React, { useState } from 'react';
import { Plus, Search, Eye, Building2 } from 'lucide-react';
import { useStore } from '../../data/mockStore';
import { Link, useNavigate } from 'react-router-dom';

export default function CompaniesList() {
  const store = useStore();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchCompanies() {
      try {
        const token = localStorage.getItem('flex_erp_token');
        const res = await fetch('/api/system/companies', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setCompanies(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch companies:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const handleDelete = async (id, code, name) => {
    if (code === 'SYSTEM') {
      alert("Cannot delete the System Control company.");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete the company "${name}" and all its data? This cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('flex_erp_token');
      const res = await fetch(`/api/system/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setCompanies(companies.filter(c => c.id !== id));
      } else {
        alert(data.message || 'Failed to delete company');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while deleting.');
    }
  };

  const filtered = companies.filter(c => (c.name || '').toLowerCase().includes(term.toLowerCase()) || (c.code || '').toLowerCase().includes(term.toLowerCase()));

  return (
    <div style={{ padding: '32px 40px', background: '#f8fafc', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>Companies</h1>
          <p style={{ color: '#64748b' }}>Manage isolated ERP tenants</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/app/super-admin/companies/create')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px' }}>
          <Plus size={18} /> Add Company
        </button>
      </div>

      <div className="card-glass" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search companies by name or code..." 
              value={term}
              onChange={e => setTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Company</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Code</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Industry</th>
              <th style={{ padding: '16px', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16}/></div>
                  {c.name}
                </td>
                <td style={{ padding: '16px', color: '#64748b' }}>{c.code}</td>
                <td style={{ padding: '16px', color: '#64748b' }}>-</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: c.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9', color: c.status === 'ACTIVE' ? '#16a34a' : '#64748b' }}>{c.status || 'Active'}</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <Link to={`/app/super-admin/companies/${c.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: '#f8fafc', color: '#4f46e5', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
                      <Eye size={14} /> View
                    </Link>
                    {c.code !== 'SYSTEM' && (
                      <button 
                        onClick={() => handleDelete(c.id, c.code, c.name)}
                        style={{ background: 'none', border: '1px solid #fee2e2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                        title="Delete Company"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
