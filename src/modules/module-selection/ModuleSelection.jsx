import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, ShoppingCart, Factory, BarChart2, Users, Search, Bell, Settings, ArrowRight, ChevronDown, ChevronLeft, Landmark } from 'lucide-react';
import { useStore } from '../../data/mockStore';
import './ModuleSelection.css';

export default function ModuleSelection() {
  const navigate = useNavigate();
  const store = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = store.currentUser || { name: 'System Admin', role: 'Super Admin', companyId: 'SYSTEM' };
  const currentCompany = store.companies?.find(c => c.id === currentUser.companyId);
  const companyModules = currentCompany ? currentCompany.modules : null;

  const modules = [
    { 
      name: 'Master Data', 
      icon: <Database size={24}/>, 
      path: '/app/master-data/dashboard', 
      desc: 'Company codes, raw materials, vendors, customers and warehouses.',
      bgClass: 'bg-blue',
      blobColor: 'rgba(59, 130, 246, 0.4)'
    },
    { 
      name: 'Procurement', 
      icon: <ShoppingCart size={24}/>, 
      path: '/app/procurement/purchase-orders', 
      desc: 'Purchase orders, vendor invoice entry with automated GL flow.',
      bgClass: 'bg-green',
      blobColor: 'rgba(16, 185, 129, 0.4)'
    },
    { 
      name: 'Sales & Billing', 
      icon: <BarChart2 size={24}/>, 
      path: '/app/sales/billing', 
      desc: 'Sales orders, customer billing, dispatch and invoicing.',
      bgClass: 'bg-orange',
      blobColor: 'rgba(249, 115, 22, 0.4)'
    },
    { 
      name: 'Finance & GL', 
      icon: <Landmark size={24}/>, 
      path: '/app/finance/journal-entries', 
      desc: 'Journal vouchers, chart of accounts, P&L statement, balance sheet & automated ledger.',
      bgClass: 'bg-purple',
      blobColor: 'rgba(139, 92, 246, 0.4)'
    },
    { 
      name: 'Manufacturing', 
      icon: <Factory size={24}/>, 
      path: '/app/manufacturing/dashboard', 
      desc: 'Plan production, work orders, BOMs, routing and work centers.',
      bgClass: 'bg-pink',
      blobColor: 'rgba(236, 72, 153, 0.4)'
    },
    { 
      name: 'HR & Payroll', 
      icon: <Users size={24}/>, 
      path: '/app/hr/dashboard', 
      desc: 'Manage employees, HR policies and payroll runs.',
      bgClass: 'bg-orange',
      blobColor: 'rgba(249, 115, 22, 0.4)'
    }
  ];

  const displayedModules = modules.filter(m => {
    if (companyModules && !companyModules.includes(m.name)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q);
  });

  return (
    <div className="workspace-page">
      {/* Background Shapes */}
      <div className="workspace-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Top Nav */}
      <nav className="workspace-nav">
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate('/');
            }}
            title="Go Back"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              color: '#0f172a'
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <img src="/logo.png" alt="Flex ERP" style={{ height: '36px', objectFit: 'contain' }} />
        </div>

        <div className="nav-center">
          <div className="nav-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search modules, records or help..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-right">
          <div className="nav-icons">
            <button title="Notifications"><Bell size={20} /></button>
            <button title="Settings"><Settings size={20} /></button>
          </div>
          <div className="nav-divider"></div>
          <div className="nav-profile">
            <div className="profile-avatar">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff`} alt={currentUser.name} />
              <div className="status-dot"></div>
            </div>
            <div className="profile-info">
              <span className="profile-name">{currentUser.name}</span>
              <span className="profile-role">{currentUser.role || 'Admin'}</span>
            </div>
            <ChevronDown size={16} color="#64748b" />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="workspace-header">
        <div className="ws-pill">
          <div className="pill-dot"></div> SELECT WORKSPACE
        </div>
        <h1>Welcome, <span>{currentUser.name.split(' ')[0]}</span></h1>
        <p>Select an ERP module to launch operations, transactions, and reports</p>
      </div>
      
      {/* Cards Grid */}
      <div className="workspace-grid">
        {displayedModules.map(m => (
          <Link key={m.name} to={m.path} className="workspace-card">
            <div className="card-blob" style={{ background: `radial-gradient(circle, ${m.blobColor} 0%, rgba(255,255,255,0) 70%)` }}></div>
            <div className="workspace-card-content">
              <div className={`card-icon ${m.bgClass}`}>
                {m.icon}
              </div>
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
              <div className="card-arrow">
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
