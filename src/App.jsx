import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ToastContainer from './components/common/ToastContainer';
import { useStore } from './data/mockStore';

// Pages
import Landing from './modules/landing/Landing';
import CompanySelect from './modules/auth/CompanySelect';
import Login from './modules/auth/Login';
import ModuleSelection from './modules/module-selection/ModuleSelection';

// Master Data
import MDDashboard from './modules/master-data/Dashboard';
import CompanyCodes from './modules/master-data/CompanyCodes';
import RawMaterials from './modules/master-data/RawMaterials';
import Vendors from './modules/master-data/Vendors';
import ManufacturingMaster from './modules/master-data/ManufacturingMaster';
import Customers from './modules/master-data/Customers';
import Employees from './modules/master-data/Employees';
import Warehouses from './modules/master-data/Warehouses';
import Finance from './modules/master-data/Finance';
import FinancialYears from './modules/master-data/FinancialYears';

// Procurement
import ProcurementDashboard from './modules/procurement/Dashboard';
import PurchaseOrders from './modules/procurement/PurchaseOrders';
import GRN from './modules/procurement/GRN';
import QualityProcurement from './modules/procurement/QualityProcurement';

// Manufacturing
import MfgDashboard from './modules/manufacturing/Dashboard';
import PlannedOrders from './modules/manufacturing/PlannedOrders';
import ManufacturingOrders from './modules/manufacturing/ManufacturingOrders';
import ManufacturingProcess from './modules/manufacturing/ManufacturingProcess';
import ManufacturingQuality from './modules/manufacturing/ManufacturingQuality';

// Quality & Maintenance
import QMDashboard from './modules/quality-maintenance/QMDashboard';
import InspectionsList from './modules/quality-maintenance/InspectionsList';
import Inspections from './modules/quality/Inspections';
import NonconformanceList from './modules/quality-maintenance/NonconformanceList';
import Nonconformance from './modules/quality/Nonconformance';
import WorkOrdersList from './modules/quality-maintenance/WorkOrdersList';
import WorkOrders from './modules/maintenance/WorkOrders';

// Sales
import SalesDashboard from './modules/sales/Dashboard';
import SalesOrders from './modules/sales/SalesOrders';
import Billing from './modules/sales/Billing';
import Dispatch from './modules/sales/Dispatch';
import Returns from './modules/sales/Returns';

// Finance & General Ledger
import JournalEntries from './modules/finance/JournalEntries';

// Reports
import ReportsDashboard from './modules/reports/Dashboard';
import PnL from './modules/reports/PnL';
import BalanceSheet from './modules/reports/BalanceSheet';

// HR
import HRDashboard from './modules/hr/Dashboard';
import Policy from './modules/hr/Policy';
import Payroll from './modules/hr/Payroll';

// Super Admin
import SuperDashboard from './modules/super-admin/SuperDashboard';
import CompaniesList from './modules/super-admin/CompaniesList';
import CreateCompany from './modules/super-admin/CreateCompany';
import AdminsList from './modules/super-admin/AdminsList';
import RolesList from './modules/super-admin/RolesList';
import ModulesList from './modules/super-admin/ModulesList';
import SecuritySettings from './modules/super-admin/SecuritySettings';
import Placeholder from './modules/super-admin/Placeholder';

import RecordDetail from './components/common/RecordDetail';
import UserProfile from './components/common/UserProfile';

export const RoleContext = createContext();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('flex_erp_token');
  if (!token) {
    return <Navigate to="/company-select" replace />;
  }
  return children;
};

function App() {
  const [role, setRole] = useState('System Admin');
  const store = useStore();

  useEffect(() => {
    store.syncBackend();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <ToastContainer />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/company-select" element={<CompanySelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/modules" element={<ModuleSelection />} />
          
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/modules" replace />} />
            
            {/* Master Data */}
            <Route path="master-data/dashboard" element={<MDDashboard />} />
            <Route path="master-data/company-codes" element={<CompanyCodes />} />
            <Route path="master-data/raw-materials" element={<RawMaterials />} />
            <Route path="master-data/vendors" element={<Vendors />} />
            <Route path="master-data/manufacturing" element={<ManufacturingMaster />} />
            <Route path="master-data/customers" element={<Customers />} />
            <Route path="master-data/employees" element={<Employees />} />
            <Route path="master-data/warehouses" element={<Warehouses />} />
            <Route path="master-data/finance" element={<Finance />} />
            <Route path="master-data/financial-years" element={<FinancialYears />} />

            {/* Procurement */}
            <Route path="procurement/dashboard" element={<ProcurementDashboard />} />
            <Route path="procurement/purchase-orders" element={<PurchaseOrders />} />
            <Route path="procurement/grn" element={<GRN />} />
            <Route path="procurement/quality" element={<QualityProcurement />} />

            {/* Manufacturing */}
            <Route path="manufacturing/dashboard" element={<MfgDashboard />} />
            <Route path="manufacturing/planned" element={<PlannedOrders />} />
            <Route path="manufacturing/order" element={<ManufacturingOrders />} />
            <Route path="manufacturing/process" element={<ManufacturingProcess />} />
            <Route path="manufacturing/quality" element={<ManufacturingQuality />} />

            {/* Quality & Maintenance */}
            <Route path="quality-maintenance/dashboard" element={<QMDashboard />} />
            <Route path="quality-maintenance/inspections" element={<InspectionsList />} />
            <Route path="quality-maintenance/inspections/:id" element={<Inspections />} />
            <Route path="quality-maintenance/nonconformance" element={<NonconformanceList />} />
            <Route path="quality-maintenance/nonconformance/:id" element={<Nonconformance />} />
            <Route path="quality-maintenance/work-orders" element={<WorkOrdersList />} />
            <Route path="quality-maintenance/work-orders/:id" element={<WorkOrders />} />

            {/* Sales */}
            <Route path="sales/dashboard" element={<SalesDashboard />} />
            <Route path="sales/orders" element={<SalesOrders />} />
            <Route path="sales/billing" element={<Billing />} />
            <Route path="sales/dispatch" element={<Dispatch />} />
            <Route path="sales/returns" element={<Returns />} />

            {/* Finance & General Ledger */}
            <Route path="finance/journal-entries" element={<JournalEntries />} />
            <Route path="finance/general-ledger" element={<JournalEntries />} />
            <Route path="finance/invoices" element={<JournalEntries />} />
            <Route path="finance/pnl" element={<PnL />} />
            <Route path="finance/balance-sheet" element={<BalanceSheet />} />
            <Route path="finance/taxes" element={<Finance />} />

            {/* Reports */}
            <Route path="reports/dashboard" element={<ReportsDashboard />} />
            <Route path="reports/pnl" element={<PnL />} />
            <Route path="reports/balance-sheet" element={<BalanceSheet />} />

            {/* HR */}
            <Route path="hr/dashboard" element={<HRDashboard />} />
            <Route path="hr/policy" element={<Policy />} />
            <Route path="hr/payroll" element={<Payroll />} />

            {/* Super Admin */}
            <Route path="super-admin/dashboard" element={<SuperDashboard />} />
            <Route path="super-admin/companies" element={<CompaniesList />} />
            <Route path="super-admin/companies/create" element={<CreateCompany />} />
            <Route path="super-admin/admins" element={<AdminsList />} />
            <Route path="super-admin/roles" element={<RolesList />} />
            <Route path="super-admin/modules" element={<ModulesList />} />
            <Route path="super-admin/security" element={<SecuritySettings />} />
            <Route path="super-admin/audit" element={<Placeholder title="System Audit Logs" />} />
            <Route path="super-admin/settings" element={<Placeholder title="System Settings" />} />
            <Route path="super-admin" element={<Navigate to="/app/super-admin/dashboard" replace />} />

            {/* Profile */}
            <Route path="profile" element={<UserProfile />} />

            {/* Universal Detail Route */}
            <Route path=":module/:entity/:id" element={<RecordDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RoleContext.Provider>
  );
}

export default App;
