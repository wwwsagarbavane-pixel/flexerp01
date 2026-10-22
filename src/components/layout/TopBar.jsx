import React, { useContext, useState } from 'react';
import { Search, Bell, Mail, LogOut, Shield, ChevronLeft, ChevronDown, User, Settings, Building2, Check, Database, RefreshCw, Home } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../../data/mockStore';
import './TopBar.css';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  
  const currentUser = store.currentUser || { name: 'System Admin', role: 'Super Admin', companyId: 'SYSTEM', email: 'admin@flexerp.com' };
  const companies = store.companies || [];

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const currentPathParts = location.pathname.replace('/app/', '').split('/').filter(Boolean);

  // Global search mock logic
  const searchResults = () => {
    if (searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase();
    const results = [];
    
    const tables = [
      { name: 'Vendors', path: 'master-data/vendors', data: store.vendors || [] },
      { name: 'Purchase Orders', path: 'procurement/purchase-orders', data: store.purchaseOrders || [] },
      { name: 'Sales Invoices', path: 'sales/billing', data: store.salesInvoices || [] },
      { name: 'Journal Entries', path: 'finance/journal-entries', data: store.journalEntries || [] },
      { name: 'Company Codes', path: 'master-data/company-codes', data: store.companyCodes || [] },
      { name: 'Items', path: 'master-data/raw-materials', data: store.rawMaterials || [] },
      { name: 'Employees', path: 'master-data/employees', data: store.employees || [] }
    ];

    tables.forEach(table => {
      const tenantData = currentUser.companyId === 'SYSTEM' ? table.data : table.data.filter(item => item.companyId === currentUser.companyId);
      tenantData.forEach(item => {
        if (Object.values(item).some(v => String(v).toLowerCase().includes(term))) {
          results.push({ ...item, _type: table.name, _path: table.path });
        }
      });
    });

    return results.slice(0, 10);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Navigation Control Group: Back & Home on EVERY screen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <button 
            className="nav-action-btn back-btn" 
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/modules');
              }
            }} 
            title="Go Back to Previous Screen"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>

          <button 
            className="nav-action-btn home-btn" 
            onClick={() => navigate('/modules')} 
            title="Return to Home / Workspace Modules"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 15px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.12)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
          >
            <Home size={16} />
            <span>Home</span>
          </button>
        </div>

        {/* Dynamic Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: '500', marginRight: '16px' }}>
          <span 
            style={{ cursor: 'pointer', color: '#2563eb', fontWeight: '600' }} 
            onClick={() => navigate('/modules')}
          >
            Home
          </span>
          {currentPathParts.map((part, idx) => {
            const isLast = idx === currentPathParts.length - 1;
            const targetModule = currentPathParts[0];

            const handleBreadcrumbClick = () => {
              if (isLast) return;
              if (idx === 0) {
                if (targetModule === 'finance') {
                  navigate('/app/finance/journal-entries');
                } else {
                  navigate(`/app/${targetModule}/dashboard`);
                }
              }
            };

            return (
              <React.Fragment key={idx}>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <span 
                  onClick={handleBreadcrumbClick}
                  style={{ 
                    textTransform: 'capitalize', 
                    color: isLast ? '#0f172a' : '#2563eb', 
                    fontWeight: isLast ? '700' : '600',
                    cursor: isLast ? 'default' : 'pointer'
                  }}
                  onMouseOver={e => { if (!isLast) e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseOut={e => { e.currentTarget.style.textDecoration = 'none'; }}
                >
                  {part.replace(/-/g, ' ')}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Global Search */}
        <div className="search-container-glass" style={{ position: 'relative' }}>
          <Search size={18} className="topbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search records, invoices, orders..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchOpen(e.target.value.length >= 2);
            }}
            onFocus={() => {
              if (searchTerm.length >= 2) setSearchOpen(true);
            }}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          {searchOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 1000, marginTop: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {searchResults().length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No results found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {searchResults().map((res, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        navigate(`/app/${res._path}/${res.id}`);
                        setSearchOpen(false);
                      }}
                      style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} 
                      onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} 
                      onMouseOut={e=>e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>{res.name || res.code || res.id}</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{res._type} • {res.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="topbar-right">
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Mail Dropdown */}
          <div style={{ position: 'relative' }} tabIndex={0} onBlur={() => setTimeout(() => setMailOpen(false), 200)}>
            <button className="icon-btn-glass" onClick={() => setMailOpen(!mailOpen)} title="Messages">
              <Mail size={20} />
            </button>
            {mailOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, width: '320px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 1000, marginTop: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Messages</h3>
                  <span style={{ fontSize: '12px', color: '#3b82f6', cursor: 'pointer' }}>Mark all read</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                    <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Welcome to Flex ERP!</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>System Admin • 1 day ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} tabIndex={0} onBlur={() => setTimeout(() => setNotifOpen(false), 200)}>
            <button className="icon-btn-glass" onClick={() => setNotifOpen(!notifOpen)} title="Notifications">
              <Bell size={20} />
              <span className="badge">2</span>
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, width: '320px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 1000, marginTop: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Notifications</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='#f8fafc'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                    <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>PO-26-1004 requires billing review</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Just now</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Profile Dropdown */}
        <div style={{ position: 'relative', cursor: 'pointer' }} className="user-profile-glass" onClick={() => setProfileOpen(!profileOpen)} onBlur={() => setTimeout(() => setProfileOpen(false), 200)} tabIndex={0}>
          <div className="avatar">
            <img src={currentUser.role === 'Super Admin' ? "https://i.pravatar.cc/150?img=12" : "https://i.pravatar.cc/150?img=11"} alt="User" />
          </div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-email">{currentUser.role || 'Admin'}</span>
          </div>
          <ChevronDown size={14} className="user-arrow" />
          
          {profileOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, width: '240px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', zIndex: 1000, marginTop: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{currentUser.name}</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>{currentUser.email}</p>
              </div>
              <div style={{ padding: '8px' }}>
                <Link to="/app/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', textDecoration: 'none', color: '#0f172a', borderRadius: '8px' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                  <User size={16} color="#64748b" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>My Profile</span>
                </Link>
                <Link to="/app/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', textDecoration: 'none', color: '#0f172a', borderRadius: '8px' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                  <Settings size={16} color="#64748b" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Settings</span>
                </Link>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', padding: '8px' }}>
                <button 
                  onClick={() => {
                    localStorage.removeItem('flex_erp_token');
                    localStorage.removeItem('flex_erp_user');
                    store.setCurrentUser(null);
                    store.setSelectedTenant(null);
                    navigate('/');
                  }} 
                  style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', textDecoration: 'none', color: '#ef4444', borderRadius: '8px' }} 
                  onMouseOver={e=>e.currentTarget.style.background='#fef2f2'} 
                  onMouseOut={e=>e.currentTarget.style.background='transparent'}
                >
                  <LogOut size={16} color="#ef4444" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
