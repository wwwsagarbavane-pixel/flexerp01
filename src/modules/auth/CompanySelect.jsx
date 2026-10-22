import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../data/mockStore';
import { Search, Building2, ArrowRight, Filter, Users, Box, MapPin, Crown } from 'lucide-react';
import '../auth/Login.css';

export default function CompanySelect() {
  const navigate = useNavigate();
  const store = useStore();
  const [companies, setCompanies] = useState([]);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockCompanies = [
      { id: 'C-001', code: 'ABC', name: 'ABC Manufacturing Pvt Ltd', slug: 'abc-manufacturing', industry: 'Manufacturing', status: 'Active', logoUrl: '/logo.png' }
    ];

    const enriched = mockCompanies.map(c => ({
      ...c,
      usersCount: c.usersCount || Math.floor(Math.random() * 50) + 10,
      modulesCount: c.modules?.length || Math.floor(Math.random() * 5) + 3,
      location: c.location || (c.code === 'ABC' ? 'Pune' : c.code === 'XYZ' ? 'Mumbai' : 'Bengaluru')
    }));
    setCompanies(enriched);
    setLoading(false);
  }, []);

  const filtered = companies.filter(c => c.name.toLowerCase().includes(term.toLowerCase()) || c.code.toLowerCase().includes(term.toLowerCase()));

  const handleSelect = (company) => {
    store.setSelectedTenant(company);
    navigate('/login');
  };

  const getColorTheme = (code) => {
    const themes = {
      ABC: { bg: '#eff6ff', color: '#3b82f6', grad: 'linear-gradient(135deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.1) 100%)' },
      XYZ: { bg: '#faf5ff', color: '#a855f7', grad: 'linear-gradient(135deg, rgba(168,85,247,0) 0%, rgba(168,85,247,0.1) 100%)' },
      DEMO: { bg: '#fff7ed', color: '#f97316', grad: 'linear-gradient(135deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.1) 100%)' },
      DEFAULT: { bg: '#f0fdf4', color: '#22c55e', grad: 'linear-gradient(135deg, rgba(34,197,94,0) 0%, rgba(34,197,94,0.1) 100%)' }
    };
    return themes[code] || themes.DEFAULT;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation Bar */}
      <div style={{ width: '100%', height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Flex ERP" style={{ height: '40px', objectFit: 'contain' }} />
        </div>

        {/* Super Admin placed in Navbar */}
        <div 
          onClick={() => handleSelect({ id: 'SYSTEM', name: 'Global System Management', code: 'SYS', industry: 'System' })}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#fef3c7', color: '#b45309', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = '#fde68a'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#fef3c7'; }}
        >
          <Crown size={16} /> Super Admin
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ padding: '4px 12px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '16px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <Building2 size={14} /> Welcome Back
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', textAlign: 'center', letterSpacing: '-1px' }}>
          Select Your <span style={{ color: '#3b82f6' }}>Company</span>
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '32px', textAlign: 'center' }}>
          Choose the workspace you want to access.
        </p>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '700px', marginBottom: '32px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={term}
              onChange={e => setTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 16px 12px 44px', borderRadius: '12px', 
                border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', 
                background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                fontWeight: '500', color: '#0f172a'
              }}
            />
          </div>
          <button style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <Filter size={18} />
          </button>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>Loading available workspaces...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', width: '100%', maxWidth: '1000px', marginBottom: '32px' }}>
            {filtered.map(c => {
              const theme = getColorTheme(c.code);
              return (
                <div 
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  style={{ 
                    background: 'white', borderRadius: '16px', padding: '20px', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden',
                    border: '1px solid #e2e8f0', transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', gap: '16px'
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.08)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'; }}
                >
                  {/* Decorative Gradient Blob */}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100px', height: '100px', background: theme.grad, borderTopLeftRadius: '100%', zIndex: 0, pointerEvents: 'none' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {c.logoUrl ? <img src={c.logoUrl} alt={c.name} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'contain', background: 'white' }} /> : <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: theme.bg, color: theme.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>{c.code}</div>}
                      <div style={{ paddingTop: '2px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px', letterSpacing: '-0.2px' }}>{c.name}</h3>
                        <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{c.industry} ERP</p>
                      </div>
                    </div>
                    
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }} className="arrow-btn">
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  {/* Footer Stats - Removed Modules */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '11px', fontWeight: '600' }}>
                      <Users size={12} /> {c.usersCount} Users
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '11px', fontWeight: '600' }}>
                      <MapPin size={12} /> {c.location}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      <style>{`
        .arrow-btn:hover { background: #3b82f6 !important; color: white !important; }
      `}</style>
    </div>
  );
}



