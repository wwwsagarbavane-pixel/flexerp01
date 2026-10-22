import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useStore } from '../../data/mockStore';
import { 
  LayoutDashboard, Database, Factory, Users, 
  Box, Truck, BarChart, Clock, Crown, ChevronRight, User,
  ShoppingCart, ShieldCheck, Activity, Settings, Wrench, ArrowLeftRight, FileText, FileSpreadsheet, LogOut, Building2, Shield, Landmark, Receipt
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const store = useStore();
  const tenant = store.selectedTenant;
  const logoUrl = '/logo.png';
  const path = location.pathname;
  const currentModule = path.split('/')[2] || 'master-data';

  const isActive = (pathPart) => (path === pathPart || path.startsWith(pathPart + '/')) ? 'nav-link active' : 'nav-link';

  const menuConfig = {
    'super-admin': [
      { to: '/app/super-admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/super-admin/companies', icon: Building2, label: 'Companies' },
      { to: '/app/super-admin/admins', icon: Users, label: 'Admins' },
      { to: '/app/super-admin/roles', icon: ShieldCheck, label: 'Roles' },
      { to: '/app/super-admin/modules', icon: Box, label: 'Modules' },
      { to: '/app/super-admin/security', icon: Shield, label: 'Security' },
      { to: '/app/super-admin/audit', icon: Activity, label: 'Audit Logs' },
      { to: '/app/super-admin/settings', icon: Settings, label: 'System Settings' }
    ],
    'master-data': [
      { to: '/app/master-data/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/master-data/company-codes', icon: Building2, label: 'Company Code' },
      { to: '/app/master-data/raw-materials', icon: Box, label: 'Raw Material' },
      { to: '/app/master-data/vendors', icon: Truck, label: 'Vendor' },
      { to: '/app/master-data/manufacturing', icon: Factory, label: 'Manufacturing' },
      { to: '/app/master-data/customers', icon: Users, label: 'Customer' },
      { to: '/app/master-data/employees', icon: User, label: 'Employee' },
      { to: '/app/master-data/warehouses', icon: Database, label: 'Warehouse' },
      { to: '/app/master-data/financial-years', icon: Clock, label: 'Financial Year' }
    ],
    'procurement': [
      { to: '/app/procurement/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/procurement/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders' },
      { to: '/app/procurement/grn', icon: Box, label: 'GRN' },
      { to: '/app/procurement/quality', icon: ShieldCheck, label: 'Quality' }
    ],
    'sales': [
      { to: '/app/sales/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/sales/orders', icon: ShoppingCart, label: 'Sales Orders' },
      { to: '/app/sales/billing', icon: Receipt, label: 'Billing' },
      { to: '/app/sales/dispatch', icon: Truck, label: 'Dispatch' },
      { to: '/app/sales/returns', icon: ArrowLeftRight, label: 'Returns' }
    ],
    'finance': [
      { to: '/app/finance/journal-entries', icon: Landmark, label: 'Journal Entries' },
      { to: '/app/finance/general-ledger', icon: BarChart, label: 'General Ledger' },
      { to: '/app/finance/invoices', icon: FileSpreadsheet, label: 'Invoices Flow' },
      { to: '/app/finance/pnl', icon: FileText, label: 'P&L Statement' },
      { to: '/app/finance/balance-sheet', icon: FileSpreadsheet, label: 'Balance Sheet' },
      { to: '/app/finance/taxes', icon: Settings, label: 'Tax Settings' }
    ],
    'reports': [
      { to: '/app/reports/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/reports/pnl', icon: FileText, label: 'P&L Statement' },
      { to: '/app/reports/balance-sheet', icon: FileSpreadsheet, label: 'Balance Sheet' }
    ],
    'manufacturing': [
      { to: '/app/manufacturing/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/manufacturing/planned', icon: Clock, label: 'Planned' },
      { to: '/app/manufacturing/order', icon: Factory, label: 'Order' },
      { to: '/app/manufacturing/process', icon: Settings, label: 'Process' },
      { to: '/app/manufacturing/quality', icon: ShieldCheck, label: 'Quality' }
    ],
    'quality-maintenance': [
      { to: '/app/quality-maintenance/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/quality-maintenance/inspections', icon: ShieldCheck, label: 'Inspections' },
      { to: '/app/quality-maintenance/nonconformance', icon: Activity, label: 'Nonconformance' },
      { to: '/app/quality-maintenance/work-orders', icon: Wrench, label: 'Work Orders' }
    ],
    'hr': [
      { to: '/app/hr/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/app/hr/policy', icon: FileText, label: 'Policy' },
      { to: '/app/hr/payroll', icon: BarChart, label: 'Payroll' }
    ]
  };

  const currentLinks = menuConfig[currentModule] || menuConfig['master-data'];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Link to="/modules" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <img src={logoUrl} alt={tenant ? tenant.name : "Flex ERP"} style={{ height: '40px', objectFit: 'contain' }} />
          </Link>
        </div>
      </div>
      
      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          <ul>
            {currentLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <li key={idx}>
                  <NavLink to={link.to} className={isActive(link.to)}>
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div onClick={() => { localStorage.removeItem('flex_erp_token'); localStorage.removeItem('flex_erp_user'); store.setCurrentUser(null); store.setSelectedTenant(null); window.location.href = '/'; }} className="pro-upgrade-card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div className="pro-icon-container" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <LogOut size={20} className="pro-icon" />
          </div>
          <div className="pro-text">
            <h4>Log Out</h4>
            <p>Disconnect session</p>
          </div>
          <ChevronRight size={16} className="pro-arrow" />
        </div>
      </div>
    </aside>
  );
}
