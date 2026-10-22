import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, ArrowRight, Hexagon, Building2, BarChart2, Package, Users, FileText, Factory, PieChart } from 'lucide-react';
import { useStore } from '../../data/mockStore';
import './Login.css';

export default function Login() {
  const nav = useNavigate();
  const store = useStore();
  const selectedTenant = store.selectedTenant;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Protect the route: if no tenant selected, go back to select
  useEffect(() => {
    if (!selectedTenant) {
      nav('/company-select');
    }
  }, [selectedTenant, nav]);

  if (!selectedTenant) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Bypass backend and log in directly
      const mockUser = {
        id: 'U-MOCK',
        name: 'Mock User',
        email: email || 'user@example.com',
        companyId: selectedTenant.id,
        roleScope: selectedTenant.id === 'SYSTEM' ? 'SYSTEM' : 'COMPANY'
      };

      store.setCurrentUser(mockUser);
      localStorage.setItem('flex_erp_token', 'mock_token_123');
      localStorage.setItem('flex_erp_user', JSON.stringify(mockUser));
      
      if (mockUser.roleScope === 'SYSTEM') {
        nav('/app/super-admin/dashboard');
      } else {
        nav('/modules');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      {/* Dynamic flowing background */}
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-orbit-container">
        {/* Left Orbit */}
        <div className="orbit orbit-left">
          <div className="orbit-path"></div>
          <div className="orbit-node node-l-1"><div className="dot"></div><div className="orbit-card"><div className="icon-box bg-blue"><BarChart2 size={20}/></div><span>Sales</span></div></div>
          <div className="orbit-node node-l-2"><div className="dot"></div><div className="orbit-card"><div className="icon-box bg-green"><Package size={20}/></div><span>Inventory</span></div></div>
          <div className="orbit-node node-l-3"><div className="dot"></div><div className="orbit-card"><div className="icon-box bg-purple"><Users size={20}/></div><span>HR</span></div></div>
        </div>

        {/* Center Login Card */}
        <div className="login-card">
          <div className="login-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="Flex ERP" style={{ height: '48px', objectFit: 'contain' }} />
          </div>
          
          <div className="login-header">
            <h2>Welcome <span>Back</span></h2>
            <p>Sign in to your {selectedTenant.id === 'SYSTEM' ? 'System Control Center' : 'ERP workspace'}</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div style={{ textAlign: 'center', marginBottom: '24px', color: '#64748b' }}>
              No ID or Password required for this demo.
            </div>

            <button type="submit" disabled={loading} className="login-submit" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, width: '100%', height: '52px', fontSize: '16px', borderRadius: '12px' }}>
              {loading ? 'Entering...' : 'Click to Login Direct'} <ArrowRight size={18} />
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link to="/company-select" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none' }}>
                Change Workspace
              </Link>
            </div>
          </form>
        </div>

        {/* Right Orbit */}
        <div className="orbit orbit-right">
          <div className="orbit-path"></div>
          <div className="orbit-node node-r-1"><div className="dot"></div><div className="orbit-card"><div className="icon-box bg-blue-alt"><FileText size={20}/></div><span>Procurement</span></div></div>
          <div className="orbit-node node-r-2"><div className="dot"></div><div className="orbit-card"><div className="icon-box bg-purple-alt"><Factory size={20}/></div><span>Manufacturing</span></div></div>
          <div className="orbit-node node-r-3"><div className="dot"></div><div className="orbit-card"><div className="icon-box bg-orange"><PieChart size={20}/></div><span>Reports</span></div></div>
        </div>
      </div>
    </div>
  );
}


