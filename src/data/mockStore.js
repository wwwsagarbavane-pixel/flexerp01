import { create } from 'zustand';
import { useToastStore } from './toastStore';

const getApiBase = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return '';
};

const getStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem('flex_erp_' + key);
    if (item) return JSON.parse(item);
  } catch (_) {}
  return fallback;
};

const setStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('flex_erp_' + key, JSON.stringify(data));
  } catch (_) {}
};

export const useStore = create((set, get) => ({
  backendOnline: true,
  lastSavedAt: null,
  isSyncing: false,

  syncBackend: async () => {
    const apiBase = getApiBase();
    if (!apiBase) {
      set({ backendOnline: true, isSyncing: false });
      return;
    }
    try {
      set({ isSyncing: true });
      const res = await fetch(`${apiBase}/api/store/sync`);
      if (!res.ok) throw new Error('Sync failed with status ' + res.status);
      const data = await res.json();
      set({ ...data, backendOnline: true, isSyncing: false });
      return data;
    } catch (e) {
      set({ backendOnline: false, isSyncing: false });
    }
  },

  currentUser: (() => {
    try {
      const u = typeof window !== 'undefined' ? localStorage.getItem('flex_erp_user') : null;
      if (u) return JSON.parse(u);
    } catch (_) {}
    return { id: 'U-001', name: 'Admin User', role: 'Super Admin', companyId: 'C-001' };
  })(),
  selectedTenant: (() => {
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem('flex_erp_tenant') : null;
      if (t) {
        const parsed = JSON.parse(t);
        if (parsed.logoUrl && parsed.logoUrl.includes('unsplash')) {
          parsed.logoUrl = '/logo.png';
          localStorage.setItem('flex_erp_tenant', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (_) {}
    return { id: 'C-001', name: 'ABC Manufacturing Pvt Ltd', type: 'Manufacturing', logoUrl: '/logo.png' };
  })(),

  setCurrentUser: (user) => {
    try { if (typeof window !== 'undefined') localStorage.setItem('flex_erp_user', JSON.stringify(user)); } catch (_) {}
    set({ currentUser: user });
  },
  setSelectedTenant: (tenant) => {
    try { if (typeof window !== 'undefined') localStorage.setItem('flex_erp_tenant', JSON.stringify(tenant)); } catch (_) {}
    set({ selectedTenant: tenant });
  },
  rawMaterials: [
    { id: 'RM-001', code: 'RM-001', name: 'Steel Sheet 3mm', category: 'Metals', uom: 'kg', unitCost: 1.2, status: 'Active' },
    { id: 'RM-002', code: 'RM-002', name: 'HDPE Granules', category: 'Plastics', uom: 'kg', unitCost: 0.8, status: 'Active' },
    { id: 'RM-003', code: 'RM-003', name: 'M8 Hex Bolts', category: 'Fasteners', uom: 'pcs', unitCost: 0.05, status: 'Active' }
  ],
  vendors: getStorage('vendors', [
    { id: 'V-001', code: 'V-001', name: 'Apex Steel Traders', type: 'Supplier', location: 'New York', status: 'Active' },
    { id: 'V-002', code: 'V-002', name: 'Polymer Synthetics', type: 'Supplier', location: 'New Jersey', status: 'Active' },
    { id: 'V-003', code: 'V-003', name: 'Fasteners Direct', type: 'Supplier', location: 'Chicago', status: 'Active' },
    { id: 'V-004', code: 'V-004', name: 'ElectroComponents Inc', type: 'Supplier', location: 'Austin', status: 'Active' },
    { id: 'V-005', code: 'V-005', name: 'Industrial Chem Ltd', type: 'Supplier', location: 'Houston', status: 'Active' }
  ]),
  customers: getStorage('customers', [
    { companyId: 'C-001', id: 'CUST-001', code: 'CUST-001', name: 'Global AutoCorp', contact: 'Michael Scott', creditLimit: '150,000', location: 'Detroit', status: 'Active' },
    { companyId: 'C-001', id: 'CUST-002', code: 'CUST-002', name: 'Tech Systems Integrators', contact: 'Dwight Schrute', creditLimit: '85,000', location: 'San Jose', status: 'Active' },
    { companyId: 'C-001', id: 'CUST-003', code: 'CUST-003', name: 'National Distributors', contact: 'Jim Halpert', creditLimit: '220,000', location: 'Dallas', status: 'Active' },
    { companyId: 'C-001', id: 'CUST-004', code: 'CUST-004', name: 'EuroTech Machinery', contact: 'Pam Beesly', creditLimit: '95,000', location: 'Frankfurt', status: 'Active' }
  ]),
  addCustomer: (item) => get().genericAdd('customers', item),
  updateCustomer: (id, item) => get().genericUpdate('customers', id, item),
  deleteCustomer: (id) => get().genericDelete('customers', id),

  companies: [
    { id: 'C-001', name: 'Demo Industries', type: 'Manufacturing', logoUrl: '/logo.png', status: 'Active' }
  ],

  users: [
    { id: 'U-001', companyId: 'C-001', name: 'Admin User', email: 'admin@demo.com', role: 'Super Admin', status: 'Active' },
    { id: 'U-002', companyId: 'C-001', name: 'Production Manager', email: 'prod@demo.com', role: 'Manager', status: 'Active' },
    { id: 'U-003', companyId: 'C-001', name: 'Quality Inspector', email: 'qa@demo.com', role: 'User', status: 'Active' }
  ],

  genericAdd: async (collection, item) => {
    const prefix = collection.substring(0, 3).toUpperCase();
    const id = item.id || `${prefix}-${Date.now().toString().slice(-6)}`;
    const currentTenant = get().selectedTenant || { id: 'C-001' };
    const newItem = { 
      ...item, 
      id, 
      companyId: item.companyId || currentTenant.id || 'C-001' 
    };

    // 1. Local state + LocalStorage update (Works anywhere: localhost & Vercel)
    set(state => {
      const list = state[collection] || [];
      const updated = [...list, newItem];
      setStorage(collection, updated);
      return { 
        [collection]: updated,
        lastSavedAt: new Date().toLocaleTimeString()
      };
    });

    // 2. Persist to Backend if available
    const apiBase = getApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/store/${collection}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (res.ok) {
          set({ backendOnline: true });
          useToastStore.getState().addToast(`Saved: ${newItem.name || newItem.item || newItem.code || newItem.id}`, 'success');
        }
      } catch (e) {
        set({ backendOnline: false });
        useToastStore.getState().addToast(`Saved: ${newItem.name || newItem.item || newItem.code || newItem.id}`, 'success');
      }
    } else {
      useToastStore.getState().addToast(`Saved: ${newItem.name || newItem.item || newItem.code || newItem.id}`, 'success');
    }
    return newItem;
  },

  genericUpdate: async (collection, id, item) => {
    // 1. Local state + LocalStorage update
    set(state => {
      const list = state[collection] || [];
      const updated = list.map(x => String(x.id) === String(id) ? { ...x, ...item } : x);
      setStorage(collection, updated);
      return { 
        [collection]: updated,
        lastSavedAt: new Date().toLocaleTimeString()
      };
    });

    // 2. Persist to Backend if available
    const apiBase = getApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/store/${collection}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (res.ok) {
          set({ backendOnline: true });
          useToastStore.getState().addToast(`Updated: ${item.name || item.item || item.code || id}`, 'success');
        }
      } catch (e) {
        set({ backendOnline: false });
        useToastStore.getState().addToast(`Updated: ${item.name || item.item || item.code || id}`, 'success');
      }
    } else {
      useToastStore.getState().addToast(`Updated: ${item.name || item.item || item.code || id}`, 'success');
    }
  },

  genericDelete: async (collection, id) => {
    // 1. Local state + LocalStorage update
    set(state => {
      const list = state[collection] || [];
      const updated = list.filter(x => String(x.id) !== String(id));
      setStorage(collection, updated);
      return { 
        [collection]: updated,
        lastSavedAt: new Date().toLocaleTimeString()
      };
    });

    // 2. Persist to Backend if available
    const apiBase = getApiBase();
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/store/${collection}/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          set({ backendOnline: true });
          useToastStore.getState().addToast(`Deleted: ${id}`, 'info');
        }
      } catch (e) {
        set({ backendOnline: false });
        useToastStore.getState().addToast(`Deleted: ${id}`, 'info');
      }
    } else {
      useToastStore.getState().addToast(`Deleted: ${id}`, 'info');
    }
  },

  resetDatabase: async () => {
    try {
      const res = await fetch('http://localhost:3000/api/store/reset', { method: 'POST' });
      if (res.ok) {
        await get().syncBackend();
        useToastStore.getState().addToast('Database reset to default demo seed!', 'success');
      }
    } catch (e) {
      console.error('Failed to reset backend database:', e);
    }
  },

  employees: [
    { companyId: 'C-001', id: 'EMP-001', code: 'EMP-001', name: 'John Doe', department: 'Production', designation: 'Operator', manager: 'Admin User', joinDate: '2021-01-15', shift: 'Morning', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-002', code: 'EMP-002', name: 'Jane Smith', department: 'Quality', designation: 'Inspector', manager: 'Admin User', joinDate: '2021-03-22', shift: 'Morning', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-003', code: 'EMP-003', name: 'Robert Johnson', department: 'Maintenance', designation: 'Technician', manager: 'Admin User', joinDate: '2022-06-10', shift: 'Night', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-004', code: 'EMP-004', name: 'Emily Davis', department: 'HR', designation: 'HR Executive', manager: 'Admin User', joinDate: '2022-11-05', shift: 'General', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-005', code: 'EMP-005', name: 'Michael Brown', department: 'Logistics', designation: 'Warehouse Manager', manager: 'Admin User', joinDate: '2023-02-18', shift: 'General', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-006', code: 'EMP-006', name: 'Sarah Wilson', department: 'Production', designation: 'Supervisor', manager: 'Admin User', joinDate: '2020-09-01', shift: 'Morning', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-007', code: 'EMP-007', name: 'David Lee', department: 'Quality', designation: 'QA Lead', manager: 'Admin User', joinDate: '2021-07-12', shift: 'General', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-008', code: 'EMP-008', name: 'Lisa Taylor', department: 'Finance', designation: 'Accountant', manager: 'Admin User', joinDate: '2023-05-20', shift: 'General', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-009', code: 'EMP-009', name: 'James Anderson', department: 'Production', designation: 'Operator', manager: 'Sarah Wilson', joinDate: '2024-01-10', shift: 'Night', status: 'Active' },
    { companyId: 'C-001', id: 'EMP-010', code: 'EMP-010', name: 'Emma Thomas', department: 'Sales', designation: 'Sales Executive', manager: 'Admin User', joinDate: '2022-08-15', shift: 'General', status: 'Active' }
  ],
  addEmployee: (item) => get().genericAdd('employees', item),
  updateEmployee: (id, item) => get().genericUpdate('employees', id, item),
  deleteEmployee: (id) => get().genericDelete('employees', id),

  warehouses: [
    { companyId: 'C-001', id: 'WH-MAIN', code: 'WH-MAIN', name: 'Main Distribution Center', location: 'New York', capacity: 50000, binCount: 1200, manager: 'Michael Brown', status: 'Active' },
    { companyId: 'C-001', id: 'WH-RAW', code: 'WH-RAW', name: 'Raw Materials Storage', location: 'New Jersey', capacity: 30000, binCount: 800, manager: 'Michael Brown', status: 'Active' },
    { companyId: 'C-001', id: 'WH-CHEM', code: 'WH-CHEM', name: 'Hazardous Chemicals', location: 'New Jersey', capacity: 5000, binCount: 100, manager: 'Jane Smith', status: 'Active' }
  ],
  addWarehouse: (item) => get().genericAdd('warehouses', item),
  updateWarehouse: (id, item) => get().genericUpdate('warehouses', id, item),
  deleteWarehouse: (id) => get().genericDelete('warehouses', id),

  financialYears: [
    { companyId: 'C-001', id: 'FY2026', code: 'FY2026', name: 'FY 2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active', locked: false },
    { companyId: 'C-001', id: 'FY2025', code: 'FY2025', name: 'FY 2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Closed', locked: true }
  ],
  addFinancialYear: (item) => get().genericAdd('financialYears', item),
  updateFinancialYear: (id, item) => get().genericUpdate('financialYears', id, item),
  deleteFinancialYear: (id) => get().genericDelete('financialYears', id),

  // --- PROCUREMENT ---
  purchaseOrders: [
    { companyId: 'C-001', companyCode: '1000', id: 'PO-26-1001', vendorId: 'V-001', vendorName: 'Apex Steel Traders', from: 'Apex Steel Traders (Main Mills, NY)', date: '2026-09-15', expectedDate: '2026-09-25', items: [{ item: 'Steel Sheet 3mm', qty: 2000, uom: 'kg', price: 1.2, amount: 2400 }], amount: 2400, warehouse: 'WH-RAW', status: 'Received' },
    { companyId: 'C-001', companyCode: '1000', id: 'PO-26-1002', vendorId: 'V-002', vendorName: 'Polymer Synthetics', from: 'Polymer Synthetics (East Terminal, NJ)', date: '2026-09-18', expectedDate: '2026-09-28', items: [{ item: 'HDPE Granules', qty: 5000, uom: 'kg', price: 0.8, amount: 4000 }], amount: 4000, warehouse: 'WH-RAW', status: 'Received' },
    { companyId: 'C-001', companyCode: '1000', id: 'PO-26-1003', vendorId: 'V-003', vendorName: 'Fasteners Direct', from: 'Fasteners Direct (Hub 4, Chicago)', date: '2026-09-22', expectedDate: '2026-10-02', items: [{ item: 'M8 Hex Bolts', qty: 10000, uom: 'pcs', price: 0.05, amount: 500 }], amount: 500, warehouse: 'WH-MAIN', status: 'Released' },
    { companyId: 'C-001', companyCode: '2000', id: 'PO-26-1004', vendorId: 'V-004', vendorName: 'ElectroComponents Inc', from: 'ElectroComponents (Frankfurt Depot)', date: '2026-09-25', expectedDate: '2026-10-10', items: [{ item: 'Circuit Boards v2', qty: 500, uom: 'pcs', price: 12.5, amount: 6250 }], amount: 6250, warehouse: 'WH-MAIN', status: 'Released' },
    { companyId: 'C-001', companyCode: '1000', id: 'PO-26-1005', vendorId: 'V-001', vendorName: 'Apex Steel Traders', from: 'Apex Steel Traders (Main Mills, NY)', date: '2026-09-28', expectedDate: '2026-10-15', items: [{ item: 'Steel Tube 50mm', qty: 1000, uom: 'm', price: 3.0, amount: 3000 }], amount: 3000, warehouse: 'WH-RAW', status: 'Draft' },
    { companyId: 'C-001', companyCode: '3000', id: 'PO-26-1006', vendorId: 'V-005', vendorName: 'Industrial Chem Ltd', from: 'Industrial Chem (Gujarat Works)', date: '2026-09-29', expectedDate: '2026-10-05', items: [{ item: 'Industrial Lubricant', qty: 200, uom: 'L', price: 8.0, amount: 1600 }], amount: 1600, warehouse: 'WH-CHEM', status: 'Pending Approval' },
    { companyId: 'C-001', companyCode: '1000', id: 'PO-26-1007', vendorId: 'V-002', vendorName: 'Polymer Synthetics', from: 'Polymer Synthetics (East Terminal, NJ)', date: '2026-10-01', expectedDate: '2026-10-20', items: [{ item: 'PVC Resin', qty: 8000, uom: 'kg', price: 0.9, amount: 7200 }], amount: 7200, warehouse: 'WH-RAW', status: 'Draft' },
    { companyId: 'C-001', companyCode: '1000', id: 'PO-26-1008', vendorId: 'V-006', vendorName: 'Packaging Pros', from: 'Packaging Pros (Central Facility)', date: '2026-10-01', expectedDate: '2026-10-08', items: [{ item: 'Cardboard Boxes Large', qty: 5000, uom: 'pcs', price: 0.2, amount: 1000 }], amount: 1000, warehouse: 'WH-MAIN', status: 'Released' },
    { companyId: 'C-001', companyCode: '2000', id: 'PO-26-1009', vendorId: 'V-007', vendorName: 'Safety Gear Co', from: 'Safety Gear Co (Munich Distribution)', date: '2026-10-02', expectedDate: '2026-10-06', items: [{ item: 'Safety Gloves', qty: 200, uom: 'pairs', price: 2.5, amount: 500 }], amount: 500, warehouse: 'WH-MAIN', status: 'Draft' },
    { companyId: 'C-001', companyCode: '1000', id: 'PO-26-1010', vendorId: 'V-004', vendorName: 'ElectroComponents Inc', from: 'ElectroComponents (Silicon Works)', date: '2026-10-02', expectedDate: '2026-10-25', items: [{ item: 'LED Displays', qty: 1000, uom: 'pcs', price: 4.5, amount: 4500 }], amount: 4500, warehouse: 'WH-MAIN', status: 'Draft' }
  ],
  addPO: (item) => get().genericAdd('purchaseOrders', item),
  updatePO: (id, item) => get().genericUpdate('purchaseOrders', id, item),
  deletePO: (id) => get().genericDelete('purchaseOrders', id),

  grns: [
    { companyId: 'C-001', id: 'GRN-26-0501', poNumber: 'PO-26-1001', vendorName: 'Apex Steel Traders', date: '2026-09-25', warehouse: 'WH-RAW', bin: 'A1', status: 'Completed', items: [{ item: 'Steel Sheet 3mm', rcvQty: 2000, rejQty: 0 }] },
    { companyId: 'C-001', id: 'GRN-26-0502', poNumber: 'PO-26-1002', vendorName: 'Polymer Synthetics', date: '2026-09-28', warehouse: 'WH-RAW', bin: 'B4', status: 'Completed', items: [{ item: 'HDPE Granules', rcvQty: 4950, rejQty: 50 }] },
    { companyId: 'C-001', id: 'GRN-26-0503', poNumber: 'PO-26-1003', vendorName: 'Fasteners Direct', date: '2026-10-02', warehouse: 'WH-MAIN', bin: 'F12', status: 'Draft', items: [{ item: 'M8 Hex Bolts', rcvQty: 10000, rejQty: 0 }] }
  ],
  addGRN: (item) => get().genericAdd('grns', item),
  updateGRN: (id, item) => get().genericUpdate('grns', id, item),
  deleteGRN: (id) => get().genericDelete('grns', id),

  procQuality: [
    { companyId: 'C-001', id: 'PQ-26-001', refId: 'GRN-26-0501', item: 'Steel Sheet 3mm', date: '2026-09-25', status: 'Passed', qty: 2000 },
    { companyId: 'C-001', id: 'PQ-26-002', refId: 'GRN-26-0502', item: 'HDPE Granules', date: '2026-09-28', status: 'Rejected', qty: 50 },
    { companyId: 'C-001', id: 'PQ-26-003', refId: 'GRN-26-0503', item: 'M8 Hex Bolts', date: '2026-10-02', status: 'Pending', qty: 10000 }
  ],
  updateProcQuality: (id, item) => get().genericUpdate('procQuality', id, item),
  deleteProcQuality: (id) => get().genericDelete('procQuality', id),

  // --- MANUFACTURING ---
  boms: [
    { companyId: 'C-001', id: 'BOM-100', code: 'BOM-100', parentItem: 'Heavy Duty Pump Component', revision: '1.0', status: 'Approved', components: [{ line: 1, item: 'Steel Sheet 3mm', desc: 'Housing Material', qty: 5, uom: 'kg', scrap: 2 }, { line: 2, item: 'M8 Hex Bolts', desc: 'Fasteners', qty: 12, uom: 'pcs', scrap: 0 }] },
    { companyId: 'C-001', id: 'BOM-101', code: 'BOM-101', parentItem: 'Electronic Control Unit', revision: '2.1', status: 'Approved', components: [{ line: 1, item: 'Circuit Boards v2', desc: 'Main PCB', qty: 1, uom: 'pcs', scrap: 0 }, { line: 2, item: 'LED Displays', desc: 'Display Panel', qty: 1, uom: 'pcs', scrap: 0 }, { line: 3, item: 'Plastic Casing', desc: 'Housing', qty: 1, uom: 'pcs', scrap: 1 }] },
    { companyId: 'C-001', id: 'BOM-102', code: 'BOM-102', parentItem: 'Plastic Gear Assembly', revision: '1.0', status: 'Approved', components: [{ line: 1, item: 'HDPE Granules', desc: 'Raw Material', qty: 0.5, uom: 'kg', scrap: 5 }] },
    { companyId: 'C-001', id: 'BOM-103', code: 'BOM-103', parentItem: 'Industrial Fan Blade', revision: '1.2', status: 'Draft', components: [{ line: 1, item: 'Aluminum Sheet 2mm', desc: 'Blade Material', qty: 1.5, uom: 'kg', scrap: 10 }] }
  ],
  addBOM: (item) => get().genericAdd('boms', item),
  updateBOM: (id, item) => get().genericUpdate('boms', id, item),
  deleteBOM: (id) => get().genericDelete('boms', id),

  routings: [
    { companyId: 'C-001', id: 'RT-100', code: 'RT-100', parentItem: 'Heavy Duty Pump Component', revision: '1.0', status: 'Approved', operations: [{ op: 10, desc: 'Laser Cutting', wc: 'WC-LASER', setup: 1.0, run: 0.05 }, { op: 20, desc: 'Bending', wc: 'WC-PRESS', setup: 0.5, run: 0.02 }, { op: 30, desc: 'Assembly', wc: 'WC-ASSM', setup: 0.2, run: 0.1 }] },
    { companyId: 'C-001', id: 'RT-101', code: 'RT-101', parentItem: 'Electronic Control Unit', revision: '2.1', status: 'Approved', operations: [{ op: 10, desc: 'SMT Assembly', wc: 'WC-SMT', setup: 2.0, run: 0.01 }, { op: 20, desc: 'Testing', wc: 'WC-TEST', setup: 0.1, run: 0.05 }, { op: 30, desc: 'Packaging', wc: 'WC-PACK', setup: 0.1, run: 0.02 }] },
    { companyId: 'C-001', id: 'RT-102', code: 'RT-102', parentItem: 'Plastic Gear Assembly', revision: '1.0', status: 'Approved', operations: [{ op: 10, desc: 'Injection Molding', wc: 'WC-MOLD', setup: 1.5, run: 0.005 }, { op: 20, desc: 'Trimming', wc: 'WC-TRIM', setup: 0.1, run: 0.01 }] }
  ],
  addRouting: (item) => get().genericAdd('routings', item),
  updateRouting: (id, item) => get().genericUpdate('routings', id, item),
  deleteRouting: (id) => get().genericDelete('routings', id),

  productionOrders: [
    { companyId: 'C-001', id: 'MFG-26-1001', item: 'Heavy Duty Pump Component', qty: 200, bom: 'BOM-100', routing: 'RT-100', plant: 'Plant-Main', startDate: '2026-09-28', dueDate: '2026-10-05', status: 'Completed', progress: 100 },
    { companyId: 'C-001', id: 'MFG-26-1002', item: 'Electronic Control Unit', qty: 500, bom: 'BOM-101', routing: 'RT-101', plant: 'Plant-Electronics', startDate: '2026-10-01', dueDate: '2026-10-10', status: 'Released', progress: 45 },
    { companyId: 'C-001', id: 'MFG-26-1003', item: 'Plastic Gear Assembly', qty: 5000, bom: 'BOM-102', routing: 'RT-102', plant: 'Plant-Molding', startDate: '2026-10-02', dueDate: '2026-10-08', status: 'Released', progress: 10 },
    { companyId: 'C-001', id: 'MFG-26-1004', item: 'Heavy Duty Pump Component', qty: 150, bom: 'BOM-100', routing: 'RT-100', plant: 'Plant-Main', startDate: '2026-10-05', dueDate: '2026-10-12', status: 'Planned', progress: 0 },
    { companyId: 'C-001', id: 'MFG-26-1005', item: 'Industrial Fan Blade', qty: 1000, bom: 'BOM-103', routing: 'RT-100', plant: 'Plant-Main', startDate: '2026-10-06', dueDate: '2026-10-15', status: 'Planned', progress: 0 },
    { companyId: 'C-001', id: 'MFG-26-1006', item: 'Electronic Control Unit', qty: 200, bom: 'BOM-101', routing: 'RT-101', plant: 'Plant-Electronics', startDate: '2026-10-10', dueDate: '2026-10-15', status: 'Draft', progress: 0 },
    { companyId: 'C-001', id: 'MFG-26-1007', item: 'Plastic Gear Assembly', qty: 10000, bom: 'BOM-102', routing: 'RT-102', plant: 'Plant-Molding', startDate: '2026-10-12', dueDate: '2026-10-20', status: 'Draft', progress: 0 },
    { companyId: 'C-001', id: 'MFG-26-1008', item: 'Heavy Duty Pump Component', qty: 50, bom: 'BOM-100', routing: 'RT-100', plant: 'Plant-Main', startDate: '2026-10-15', dueDate: '2026-10-22', status: 'Draft', progress: 0 }
  ],
  addProductionOrder: (item) => get().genericAdd('productionOrders', item),
  updateProductionOrder: (id, item) => get().genericUpdate('productionOrders', id, item),
  deleteProductionOrder: (id) => get().genericDelete('productionOrders', id),

  materialTransactions: [],
  addMaterialTransaction: (item) => get().genericAdd('materialTransactions', item),

  operations: [
    { companyId: 'C-001', id: 'OP-26-5001', prodOrder: 'MFG-26-1002', op: 10, wc: 'WC-SMT', operator: 'EMP-001', status: 'Completed', startedAt: '2026-10-01T08:00', plannedQty: 500, goodQty: 500, scrapQty: 0 },
    { companyId: 'C-001', id: 'OP-26-5002', prodOrder: 'MFG-26-1002', op: 20, wc: 'WC-TEST', operator: 'EMP-002', status: 'Started', startedAt: '2026-10-02T09:30', plannedQty: 500, goodQty: 220, scrapQty: 5 },
    { companyId: 'C-001', id: 'OP-26-5003', prodOrder: 'MFG-26-1003', op: 10, wc: 'WC-MOLD', operator: 'EMP-006', status: 'Started', startedAt: '2026-10-02T10:00', plannedQty: 5000, goodQty: 500, scrapQty: 10 },
    { companyId: 'C-001', id: 'OP-26-5004', prodOrder: 'MFG-26-1004', op: 10, wc: 'WC-LASER', operator: 'EMP-009', status: 'Pending', startedAt: null, plannedQty: 150, goodQty: 0, scrapQty: 0 }
  ],
  addOperation: (item) => get().genericAdd('operations', item),
  updateOperation: (id, item) => get().genericUpdate('operations', id, item),
  deleteOperation: (id) => get().genericDelete('operations', id),

  receipts: [],
  addReceipt: (item) => get().genericAdd('receipts', item),

  // --- QUALITY & MAINTENANCE ---
  inspections: [
    { companyId: 'C-001', id: 'INSP-26-001', type: 'In-Process', item: 'Electronic Control Unit', source: 'MFG-26-1002', qty: 220, status: 'In Progress' },
    { companyId: 'C-001', id: 'INSP-26-002', type: 'Final', item: 'Heavy Duty Pump Component', source: 'MFG-26-1001', qty: 200, status: 'Completed' },
    { companyId: 'C-001', id: 'INSP-26-003', type: 'In-Process', item: 'Plastic Gear Assembly', source: 'MFG-26-1003', qty: 500, status: 'Pending' },
    { companyId: 'C-001', id: 'INSP-26-004', type: 'Receiving', item: 'Steel Sheet 3mm', source: 'GRN-26-0501', qty: 2000, status: 'Completed' },
    { companyId: 'C-001', id: 'INSP-26-005', type: 'Receiving', item: 'HDPE Granules', source: 'GRN-26-0502', qty: 5000, status: 'Completed' },
    { companyId: 'C-001', id: 'INSP-26-006', type: 'Receiving', item: 'M8 Hex Bolts', source: 'GRN-26-0503', qty: 10000, status: 'Pending' }
  ],
  addInspection: (item) => get().genericAdd('inspections', item),
  updateInspection: (id, item) => get().genericUpdate('inspections', id, item),
  deleteInspection: (id) => get().genericDelete('inspections', id),

  ncrs: [
    { companyId: 'C-001', id: 'NCR-26-001', source: 'INSP-26-005', item: 'HDPE Granules', severity: 'Medium', status: 'Open', owner: 'Quality Team' },
    { companyId: 'C-001', id: 'NCR-26-002', source: 'INSP-26-001', item: 'Electronic Control Unit', severity: 'Low', status: 'Under Review', owner: 'Jane Smith' },
    { companyId: 'C-001', id: 'NCR-26-003', source: 'INSP-26-002', item: 'Heavy Duty Pump Component', severity: 'High', status: 'Closed', owner: 'Quality Team' }
  ],
  addNCR: (item) => get().genericAdd('ncrs', item),
  updateNCR: (id, item) => get().genericUpdate('ncrs', id, item),
  deleteNCR: (id) => get().genericDelete('ncrs', id),

  workOrders: [
    { companyId: 'C-001', id: 'WO-26-001', asset: 'CNC Machine A1', type: 'Preventive', priority: 'High', tech: 'Robert Johnson', status: 'In Progress', plannedDate: '2026-10-02' },
    { companyId: 'C-001', id: 'WO-26-002', asset: 'Laser Cutter M1', type: 'Corrective', priority: 'Critical', tech: 'Robert Johnson', status: 'Released', plannedDate: '2026-10-02' },
    { companyId: 'C-001', id: 'WO-26-003', asset: 'Injection Molder X', type: 'Preventive', priority: 'Medium', tech: 'EMP-003', status: 'Planned', plannedDate: '2026-10-15' },
    { companyId: 'C-001', id: 'WO-26-004', asset: 'SMT Line 1', type: 'Calibration', priority: 'Low', tech: 'EMP-003', status: 'Planned', plannedDate: '2026-10-20' },
    { companyId: 'C-001', id: 'WO-26-005', asset: 'Forklift F-02', type: 'Breakdown', priority: 'High', tech: 'External Service', status: 'Open', plannedDate: '2026-10-01' }
  ],
  addWorkOrder: (item) => get().genericAdd('workOrders', item),
  updateWorkOrder: (id, item) => get().genericUpdate('workOrders', id, item),
  deleteWorkOrder: (id) => get().genericDelete('workOrders', id),

  // --- SALES ---
  salesOrders: [
    { companyId: 'C-001', companyCode: '1000', id: 'SO-26-2001', customer: 'Global AutoCorp', date: '2026-09-25', total: 45000, deliveryDate: '2026-10-20', status: 'Confirmed' },
    { companyId: 'C-001', companyCode: '1000', id: 'SO-26-2002', customer: 'Tech Systems Integrators', date: '2026-09-28', total: 12500, deliveryDate: '2026-10-15', status: 'Confirmed' },
    { companyId: 'C-001', companyCode: '1000', id: 'SO-26-2003', customer: 'National Distributors', date: '2026-10-01', total: 85000, deliveryDate: '2026-11-01', status: 'Draft' },
    { companyId: 'C-001', companyCode: '2000', id: 'SO-26-2004', customer: 'EuroTech Machinery', date: '2026-10-02', total: 32000, deliveryDate: '2026-10-25', status: 'Pending Approval' },
    { companyId: 'C-001', companyCode: '1000', id: 'SO-26-2005', customer: 'Local Retailers', date: '2026-10-02', total: 5400, deliveryDate: '2026-10-10', status: 'Confirmed' }
  ],
  addSalesOrder: (item) => get().genericAdd('salesOrders', item),
  updateSalesOrder: (id, item) => get().genericUpdate('salesOrders', id, item),
  deleteSalesOrder: (id) => get().genericDelete('salesOrders', id),

  dispatches: [
    { companyId: 'C-001', id: 'DSP-26-001', soId: 'SO-26-2002', warehouse: 'WH-MAIN', date: '2026-10-14', status: 'Scheduled' },
    { companyId: 'C-001', id: 'DSP-26-002', soId: 'SO-26-2005', warehouse: 'WH-MAIN', date: '2026-10-09', status: 'Picking' }
  ],
  addDispatch: (item) => get().genericAdd('dispatches', item),
  updateDispatch: (id, item) => get().genericUpdate('dispatches', id, item),
  deleteDispatch: (id) => get().genericDelete('dispatches', id),

  returns: [
    { companyId: 'C-001', id: 'RET-26-001', soId: 'SO-26-1950', customer: 'Alpha Corp', reason: 'Defective Product', status: 'Received', amount: 1500 }
  ],
  addReturn: (item) => get().genericAdd('returns', item),
  updateReturn: (id, item) => get().genericUpdate('returns', id, item),
  deleteReturn: (id) => get().genericDelete('returns', id),

  // --- HR ---
  policies: [
    { companyId: 'C-001', id: 'POL-001', name: 'Code of Conduct v2', category: 'Compliance', version: '2.0', status: 'Published' },
    { companyId: 'C-001', id: 'POL-002', name: 'Leave Policy 2026', category: 'HR', version: '1.1', status: 'Published' },
    { companyId: 'C-001', id: 'POL-003', name: 'Safety Standards Manual', category: 'Health & Safety', version: '3.0', status: 'Under Review' },
    { companyId: 'C-001', id: 'POL-004', name: 'Remote Work Guidelines', category: 'HR', version: '1.0', status: 'Published' }
  ],
  addPolicy: (item) => get().genericAdd('policies', item),
  updatePolicy: (id, item) => get().genericUpdate('policies', id, item),
  deletePolicy: (id) => get().genericDelete('policies', id),

  payrolls: [
    { companyId: 'C-001', id: 'PAY-26-09', period: 'Sep 2026', gross: 255000, net: 202000, status: 'Processed' },
    { companyId: 'C-001', id: 'PAY-26-10', period: 'Oct 2026', gross: 260000, net: 205000, status: 'Draft' }
  ],
  addPayroll: (item) => get().genericAdd('payrolls', item),
  updatePayroll: (id, item) => get().genericUpdate('payrolls', id, item),
  deletePayroll: (id) => get().genericDelete('payrolls', id),


  manufacturingItems: [
    { id: 'MFG-001', code: 'MFG-001', name: 'Heavy Duty Pump Component', type: 'Finished Good', uom: 'pcs', routing: 'RT-100', status: 'Active' },
    { id: 'MFG-002', code: 'MFG-002', name: 'Electronic Control Unit', type: 'Finished Good', uom: 'pcs', routing: 'RT-101', status: 'Active' },
    { id: 'MFG-003', code: 'MFG-003', name: 'Plastic Gear Assembly', type: 'Sub-Assembly', uom: 'pcs', routing: 'RT-102', status: 'Active' }
  ],
  addMfgItem: (item) => get().genericAdd('manufacturingItems', item),
  updateMfgItem: (id, item) => get().genericUpdate('manufacturingItems', id, item),
  deleteMfgItem: (id) => get().genericDelete('manufacturingItems', id),

  taxes: [
    { id: 'TAX-001', code: 'TAX-001', name: 'GST 18%', rate: 18, type: 'Percentage', status: 'Active' },
    { id: 'TAX-002', code: 'TAX-002', name: 'VAT 5%', rate: 5, type: 'Percentage', status: 'Active' }
  ],
  addTax: (item) => get().genericAdd('taxes', item),
  updateTax: (id, item) => get().genericUpdate('taxes', id, item),
  deleteTax: (id) => get().genericDelete('taxes', id),

  addCustomer: (item) => get().genericAdd('customers', item),
  updateCustomer: (id, item) => get().genericUpdate('customers', id, item),
  deleteCustomer: (id) => get().genericDelete('customers', id),

  addVendor: (item) => get().genericAdd('vendors', item),
  updateVendor: (id, item) => get().genericUpdate('vendors', id, item),
  deleteVendor: (id) => get().genericDelete('vendors', id),

  addRawMaterial: (item) => get().genericAdd('rawMaterials', item),
  updateRawMaterial: (id, item) => get().genericUpdate('rawMaterials', id, item),
  deleteRawMaterial: (id) => get().genericDelete('rawMaterials', id),

  addCompany: (item) => get().genericAdd('companies', item),

  // --- MASTER DATA: COMPANY CODES ---
  companyCodes: getStorage('companyCodes', [
    { id: 'CC-1000', code: '1000', name: 'Flex Manufacturing Corp', currency: 'USD', country: 'United States', city: 'New York', taxId: 'US-987654321', chartOfAccounts: 'COA-GLOBAL', status: 'Active' },
    { id: 'CC-2000', code: '2000', name: 'Flex Industries Europe Ltd', currency: 'EUR', country: 'Germany', city: 'Frankfurt', taxId: 'DE-123456789', chartOfAccounts: 'COA-GLOBAL', status: 'Active' },
    { id: 'CC-3000', code: '3000', name: 'Flex Tech India Solutions', currency: 'INR', country: 'India', city: 'Mumbai', taxId: 'IN-27AABCF1234F1Z5', chartOfAccounts: 'COA-GLOBAL', status: 'Active' }
  ]),
  addCompanyCode: async (item) => {
    const existing = (get().companyCodes || []).find(c => 
      String(c.code).toLowerCase() === String(item.code).toLowerCase()
    );
    if (existing) {
      useToastStore.getState().addToast(`Validation Error: Company Code ${item.code} already exists! Uniqueness required.`, 'error');
      return null;
    }
    return await get().genericAdd('companyCodes', item);
  },
  updateCompanyCode: (id, item) => get().genericUpdate('companyCodes', id, item),
  deleteCompanyCode: (id) => get().genericDelete('companyCodes', id),

  // --- GENERAL LEDGER CHART OF ACCOUNTS ---
  glAccounts: [
    { code: '1010', name: 'Cash & Bank Operations', type: 'Asset', normalBalance: 'Debit', balance: 152000 },
    { code: '1020', name: 'Accounts Receivable (Customers)', type: 'Asset', normalBalance: 'Debit', balance: 67850 },
    { code: '1030', name: 'Raw Material Inventory & Stock', type: 'Asset', normalBalance: 'Debit', balance: 48500 },
    { code: '1040', name: 'Property, Plant & Equipment', type: 'Asset', normalBalance: 'Debit', balance: 220000 },
    { code: '2010', name: 'Accounts Payable (Vendors)', type: 'Liability', normalBalance: 'Credit', balance: 18450 },
    { code: '2020', name: 'Sales Tax & VAT Payable', type: 'Liability', normalBalance: 'Credit', balance: 10350 },
    { code: '3010', name: 'Shareholder Capital', type: 'Equity', normalBalance: 'Credit', balance: 350000 },
    { code: '3020', name: 'Retained Earnings', type: 'Equity', normalBalance: 'Credit', balance: 80000 },
    { code: '4010', name: 'Finished Goods Sales Revenue', type: 'Revenue', normalBalance: 'Credit', balance: 97500 },
    { code: '4020', name: 'Service & Maintenance Revenue', type: 'Revenue', normalBalance: 'Credit', balance: 15000 },
    { code: '5010', name: 'Raw Material Purchases & COGS', type: 'Expense', normalBalance: 'Debit', balance: 29500 },
    { code: '5020', name: 'Factory Power & Utilities Expense', type: 'Expense', normalBalance: 'Debit', balance: 6200 },
    { code: '5030', name: 'Salaries & Staff Compensation', type: 'Expense', normalBalance: 'Debit', balance: 42000 },
    { code: '5040', name: 'Logistics, Freight & Shipping', type: 'Expense', normalBalance: 'Debit', balance: 5250 }
  ],

  // --- PROCUREMENT INVOICES ---
  procurementInvoices: getStorage('procurementInvoices', [
    { 
      id: 'INV-PR-1001', 
      invoiceNumber: 'INV-PR-1001', 
      poNumber: 'PO-26-1001', 
      vendorId: 'V-001', 
      vendorName: 'Apex Steel Traders', 
      from: 'Apex Steel Traders (Main Mills, NY)', 
      companyCode: '1000', 
      date: '2026-09-26', 
      dueDate: '2026-10-26', 
      amount: 2400, 
      tax: 0, 
      total: 2400, 
      glAccount: '5010', 
      status: 'Paid',
      notes: 'Initial steel plates shipment invoice'
    },
    { 
      id: 'INV-PR-1002', 
      invoiceNumber: 'INV-PR-1002', 
      poNumber: 'PO-26-1002', 
      vendorId: 'V-002', 
      vendorName: 'Polymer Synthetics', 
      from: 'Polymer Synthetics (East Terminal, NJ)', 
      companyCode: '1000', 
      date: '2026-09-29', 
      dueDate: '2026-10-29', 
      amount: 4000, 
      tax: 0, 
      total: 4000, 
      glAccount: '5010', 
      status: 'Posted',
      notes: 'HDPE Granules bulk delivery'
    },
    { 
      id: 'INV-PR-1003', 
      invoiceNumber: 'INV-PR-1003', 
      poNumber: 'PO-26-1004', 
      vendorId: 'V-004', 
      vendorName: 'ElectroComponents Inc', 
      from: 'ElectroComponents (Frankfurt Depot)', 
      companyCode: '2000', 
      date: '2026-10-02', 
      dueDate: '2026-11-02', 
      amount: 6250, 
      tax: 0, 
      total: 6250, 
      glAccount: '5010', 
      status: 'Posted',
      notes: 'PCB units delivery'
    }
  ]),
  addProcurementInvoice: async (invoice) => {
    const invNumber = invoice.invoiceNumber || invoice.id || `INV-PR-${Date.now().toString().slice(-4)}`;
    
    // 1. Prevent duplicate invoice
    const existing = (get().procurementInvoices || []).find(inv => 
      String(inv.invoiceNumber || inv.id).toLowerCase() === String(invNumber).toLowerCase()
    );
    if (existing) {
      useToastStore.getState().addToast(`Validation Error: Invoice ${invNumber} already exists! Duplicate prevented.`, 'error');
      return null;
    }

    const poRef = invoice.poNumber || 'N/A';
    const vendorName = invoice.vendorName || invoice.from || 'Supplier';
    const companyCode = invoice.companyCode || '1000';
    const totalAmount = parseFloat(invoice.amount || invoice.total || 0);
    const invoiceStatus = invoice.status || 'Posted';

    const newInvoice = {
      ...invoice,
      id: invNumber,
      invoiceNumber: invNumber,
      companyCode,
      vendorName,
      amount: totalAmount,
      total: totalAmount,
      type: 'Procurement',
      status: invoiceStatus,
      createdAt: new Date().toISOString()
    };

    await get().genericAdd('procurementInvoices', newInvoice);

    // 2. AUTOMATIC GENERAL LEDGER JOURNAL ENTRY FLOW
    // Only post to GL if status is 'Posted' or 'Paid' (Draft or Cancelled are NOT posted to GL)
    if (invoiceStatus === 'Posted' || invoiceStatus === 'Paid') {
      const existingJE = (get().journalEntries || []).find(je => 
        je.reference && je.reference.includes(invNumber)
      );

      if (!existingJE) {
        const jeId = `JE-${Date.now().toString().slice(-6)}`;
        const autoJE = {
          id: jeId,
          entryNumber: jeId,
          date: invoice.date || new Date().toISOString().slice(0, 10),
          companyCode,
          sourceModule: 'Procurement',
          reference: `${invNumber} (PO: ${poRef})`,
          description: `Vendor Invoice from ${vendorName} for PO ${poRef}`,
          status: 'Posted',
          totalAmount,
          lines: [
            {
              accountCode: invoice.glAccount || '5010',
              accountName: 'Raw Material Purchases & COGS',
              debit: totalAmount,
              credit: 0
            },
            {
              accountCode: '2010',
              accountName: 'Accounts Payable (Vendors)',
              debit: 0,
              credit: totalAmount
            }
          ]
        };

        await get().genericAdd('journalEntries', autoJE);
        useToastStore.getState().addToast(`Vendor invoice ${invNumber} posted and flowed into Finance GL!`, 'success');
      }
    } else {
      useToastStore.getState().addToast(`Vendor invoice ${invNumber} saved as ${invoiceStatus} (Unposted to GL).`, 'info');
    }
    return newInvoice;
  },
  updateProcurementInvoice: async (id, item) => {
    await get().genericUpdate('procurementInvoices', id, item);
    const updatedInv = (get().procurementInvoices || []).find(i => String(i.id) === String(id) || String(i.invoiceNumber) === String(id));
    if (updatedInv) {
      const existingJE = (get().journalEntries || []).find(je => je.reference && je.reference.includes(updatedInv.invoiceNumber));
      if ((updatedInv.status === 'Posted' || updatedInv.status === 'Paid') && !existingJE) {
        const jeId = `JE-${Date.now().toString().slice(-6)}`;
        const autoJE = {
          id: jeId,
          entryNumber: jeId,
          date: updatedInv.date || new Date().toISOString().slice(0, 10),
          companyCode: updatedInv.companyCode || '1000',
          sourceModule: 'Procurement',
          reference: `${updatedInv.invoiceNumber} (PO: ${updatedInv.poNumber || 'N/A'})`,
          description: `Vendor Invoice from ${updatedInv.vendorName || 'Supplier'}`,
          status: 'Posted',
          totalAmount: updatedInv.total || updatedInv.amount,
          lines: [
            {
              accountCode: updatedInv.glAccount || '5010',
              accountName: 'Raw Material Purchases & COGS',
              debit: updatedInv.total || updatedInv.amount,
              credit: 0
            },
            {
              accountCode: '2010',
              accountName: 'Accounts Payable (Vendors)',
              debit: 0,
              credit: updatedInv.total || updatedInv.amount
            }
          ]
        };
        await get().genericAdd('journalEntries', autoJE);
      } else if (updatedInv.status === 'Cancelled' && existingJE) {
        await get().genericUpdate('journalEntries', existingJE.id, { ...existingJE, status: 'Cancelled' });
      }
    }
  },
  deleteProcurementInvoice: (id) => get().genericDelete('procurementInvoices', id),

  // --- SALES INVOICES (BILLING) ---
  salesInvoices: getStorage('salesInvoices', [
    { 
      id: 'INV-SL-2001', 
      invoiceNumber: 'INV-SL-2001', 
      soId: 'SO-26-2001', 
      customer: 'Global AutoCorp', 
      companyCode: '1000', 
      date: '2026-09-26', 
      dueDate: '2026-10-26', 
      amount: 45000, 
      tax: 8100, 
      total: 53100, 
      glAccount: '4010', 
      status: 'Paid',
      notes: 'Auto components production billing'
    },
    { 
      id: 'INV-SL-2002', 
      invoiceNumber: 'INV-SL-2002', 
      soId: 'SO-26-2002', 
      customer: 'Tech Systems Integrators', 
      companyCode: '1000', 
      date: '2026-09-29', 
      dueDate: '2026-10-29', 
      amount: 12500, 
      tax: 2250, 
      total: 14750, 
      glAccount: '4010', 
      status: 'Pending',
      notes: 'Electronic control units contract'
    },
    { 
      id: 'INV-SL-2003', 
      invoiceNumber: 'INV-SL-2003', 
      soId: 'SO-26-2004', 
      customer: 'EuroTech Machinery', 
      companyCode: '2000', 
      date: '2026-10-03', 
      dueDate: '2026-11-03', 
      amount: 32000, 
      tax: 5760, 
      total: 37760, 
      glAccount: '4010', 
      status: 'Pending',
      notes: 'Heavy machinery parts shipment'
    }
  ]),
  addSalesInvoice: async (invoice) => {
    const invNumber = invoice.invoiceNumber || invoice.id || `INV-SL-${Date.now().toString().slice(-4)}`;

    // 1. Prevent duplicate invoice
    const existing = (get().salesInvoices || []).find(inv => 
      String(inv.invoiceNumber || inv.id).toLowerCase() === String(invNumber).toLowerCase()
    );
    if (existing) {
      useToastStore.getState().addToast(`Validation Error: Sales Invoice ${invNumber} already exists! Duplicate prevented.`, 'error');
      return null;
    }

    const soRef = invoice.soId || invoice.soNumber || 'N/A';
    const customerName = invoice.customer || 'Customer';
    const companyCode = invoice.companyCode || '1000';
    const subtotal = parseFloat(invoice.amount || invoice.subtotal || 0);
    const tax = parseFloat(invoice.tax || 0);
    const totalAmount = subtotal + tax;
    const invoiceStatus = invoice.status || 'Pending';

    const newInvoice = {
      ...invoice,
      id: invNumber,
      invoiceNumber: invNumber,
      companyCode,
      customer: customerName,
      amount: subtotal,
      tax,
      total: totalAmount,
      type: 'Sales',
      status: invoiceStatus,
      createdAt: new Date().toISOString()
    };

    await get().genericAdd('salesInvoices', newInvoice);

    // 2. AUTOMATIC GENERAL LEDGER JOURNAL ENTRY FLOW
    // Only post to GL if status is NOT 'Draft' or 'Cancelled'
    if (invoiceStatus === 'Posted' || invoiceStatus === 'Paid' || invoiceStatus === 'Confirmed' || invoiceStatus === 'Pending') {
      const existingJE = (get().journalEntries || []).find(je => 
        je.reference && je.reference.includes(invNumber)
      );

      if (!existingJE) {
        const jeId = `JE-${Date.now().toString().slice(-6)}`;
        const lines = [
          {
            accountCode: '1020',
            accountName: 'Accounts Receivable (Customers)',
            debit: totalAmount,
            credit: 0
          },
          {
            accountCode: invoice.glAccount || '4010',
            accountName: 'Finished Goods Sales Revenue',
            debit: 0,
            credit: subtotal
          }
        ];

        if (tax > 0) {
          lines.push({
            accountCode: '2020',
            accountName: 'Sales Tax & VAT Payable',
            debit: 0,
            credit: tax
          });
        }

        const autoJE = {
          id: jeId,
          entryNumber: jeId,
          date: invoice.date || new Date().toISOString().slice(0, 10),
          companyCode,
          sourceModule: 'Sales',
          reference: `${invNumber} (SO: ${soRef})`,
          description: `Customer Billing to ${customerName} for Order ${soRef}`,
          status: 'Posted',
          totalAmount,
          lines
        };

        await get().genericAdd('journalEntries', autoJE);
        useToastStore.getState().addToast(`Sales Bill ${invNumber} generated and flowed into Finance GL!`, 'success');
      }
    } else {
      useToastStore.getState().addToast(`Sales bill ${invNumber} saved as ${invoiceStatus} (Unposted to GL).`, 'info');
    }
    return newInvoice;
  },
  updateSalesInvoice: async (id, item) => {
    await get().genericUpdate('salesInvoices', id, item);
    const updatedInv = (get().salesInvoices || []).find(i => String(i.id) === String(id) || String(i.invoiceNumber) === String(id));
    if (updatedInv) {
      const existingJE = (get().journalEntries || []).find(je => je.reference && je.reference.includes(updatedInv.invoiceNumber));
      if ((updatedInv.status === 'Posted' || updatedInv.status === 'Paid') && !existingJE) {
        const jeId = `JE-${Date.now().toString().slice(-6)}`;
        const subtotal = parseFloat(updatedInv.amount || 0);
        const tax = parseFloat(updatedInv.tax || 0);
        const totalAmount = subtotal + tax;
        const lines = [
          { accountCode: '1020', accountName: 'Accounts Receivable (Customers)', debit: totalAmount, credit: 0 },
          { accountCode: updatedInv.glAccount || '4010', accountName: 'Finished Goods Sales Revenue', debit: 0, credit: subtotal }
        ];
        if (tax > 0) {
          lines.push({ accountCode: '2020', accountName: 'Sales Tax & VAT Payable', debit: 0, credit: tax });
        }
        const autoJE = {
          id: jeId,
          entryNumber: jeId,
          date: updatedInv.date || new Date().toISOString().slice(0, 10),
          companyCode: updatedInv.companyCode || '1000',
          sourceModule: 'Sales',
          reference: `${updatedInv.invoiceNumber} (SO: ${updatedInv.soId || 'N/A'})`,
          description: `Customer Billing to ${updatedInv.customer || 'Customer'}`,
          status: 'Posted',
          totalAmount,
          lines
        };
        await get().genericAdd('journalEntries', autoJE);
      } else if (updatedInv.status === 'Cancelled' && existingJE) {
        await get().genericUpdate('journalEntries', existingJE.id, { ...existingJE, status: 'Cancelled' });
      }
    }
  },
  deleteSalesInvoice: (id) => get().genericDelete('salesInvoices', id),

  // --- JOURNAL ENTRIES (GENERAL LEDGER) ---
  journalEntries: getStorage('journalEntries', [
    {
      id: 'JE-26-0001',
      entryNumber: 'JE-26-0001',
      date: '2026-09-26',
      companyCode: '1000',
      sourceModule: 'Procurement',
      reference: 'INV-PR-1001 (PO: PO-26-1001)',
      description: 'Vendor Invoice from Apex Steel Traders',
      status: 'Posted',
      totalAmount: 2400,
      lines: [
        { accountCode: '5010', accountName: 'Raw Material Purchases & COGS', debit: 2400, credit: 0 },
        { accountCode: '2010', accountName: 'Accounts Payable (Vendors)', debit: 0, credit: 2400 }
      ]
    },
    {
      id: 'JE-26-0002',
      entryNumber: 'JE-26-0002',
      date: '2026-09-26',
      companyCode: '1000',
      sourceModule: 'Sales',
      reference: 'INV-SL-2001 (SO: SO-26-2001)',
      description: 'Customer Billing to Global AutoCorp',
      status: 'Posted',
      totalAmount: 53100,
      lines: [
        { accountCode: '1020', accountName: 'Accounts Receivable (Customers)', debit: 53100, credit: 0 },
        { accountCode: '4010', accountName: 'Finished Goods Sales Revenue', debit: 0, credit: 45000 },
        { accountCode: '2020', accountName: 'Sales Tax & VAT Payable', debit: 0, credit: 8100 }
      ]
    },
    {
      id: 'JE-26-0003',
      entryNumber: 'JE-26-0003',
      date: '2026-09-29',
      companyCode: '1000',
      sourceModule: 'Procurement',
      reference: 'INV-PR-1002 (PO: PO-26-1002)',
      description: 'Vendor Invoice from Polymer Synthetics',
      status: 'Posted',
      totalAmount: 4000,
      lines: [
        { accountCode: '5010', accountName: 'Raw Material Purchases & COGS', debit: 4000, credit: 0 },
        { accountCode: '2010', accountName: 'Accounts Payable (Vendors)', debit: 0, credit: 4000 }
      ]
    },
    {
      id: 'JE-26-0004',
      entryNumber: 'JE-26-0004',
      date: '2026-09-29',
      companyCode: '1000',
      sourceModule: 'Sales',
      reference: 'INV-SL-2002 (SO: SO-26-2002)',
      description: 'Customer Billing to Tech Systems Integrators',
      status: 'Posted',
      totalAmount: 14750,
      lines: [
        { accountCode: '1020', accountName: 'Accounts Receivable (Customers)', debit: 14750, credit: 0 },
        { accountCode: '4010', accountName: 'Finished Goods Sales Revenue', debit: 0, credit: 12500 },
        { accountCode: '2020', accountName: 'Sales Tax & VAT Payable', debit: 0, credit: 2250 }
      ]
    },
    {
      id: 'JE-26-0005',
      entryNumber: 'JE-26-0005',
      date: '2026-10-02',
      companyCode: '2000',
      sourceModule: 'Procurement',
      reference: 'INV-PR-1003 (PO: PO-26-1004)',
      description: 'Vendor Invoice from ElectroComponents Inc',
      status: 'Posted',
      totalAmount: 6250,
      lines: [
        { accountCode: '5010', accountName: 'Raw Material Purchases & COGS', debit: 6250, credit: 0 },
        { accountCode: '2010', accountName: 'Accounts Payable (Vendors)', debit: 0, credit: 6250 }
      ]
    },
    {
      id: 'JE-26-0006',
      entryNumber: 'JE-26-0006',
      date: '2026-10-03',
      companyCode: '2000',
      sourceModule: 'Sales',
      reference: 'INV-SL-2003 (SO: SO-26-2004)',
      description: 'Customer Billing to EuroTech Machinery',
      status: 'Posted',
      totalAmount: 37760,
      lines: [
        { accountCode: '1020', accountName: 'Accounts Receivable (Customers)', debit: 37760, credit: 0 },
        { accountCode: '4010', accountName: 'Finished Goods Sales Revenue', debit: 0, credit: 32000 },
        { accountCode: '2020', accountName: 'Sales Tax & VAT Payable', debit: 0, credit: 5760 }
      ]
    }
  ]),
  addJournalEntry: async (entry) => {
    const jeId = entry.entryNumber || entry.id || `JE-${Date.now().toString().slice(-6)}`;
    
    // Check duplicate JE
    const existing = (get().journalEntries || []).find(j => 
      String(j.entryNumber || j.id).toLowerCase() === String(jeId).toLowerCase()
    );
    if (existing) {
      useToastStore.getState().addToast(`Validation Error: Journal Entry ${jeId} already exists! Duplicate prevented.`, 'error');
      return null;
    }

    const sumDebits = entry.lines ? entry.lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0) : 0;
    const sumCredits = entry.lines ? entry.lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0) : 0;
    
    if (entry.lines && entry.lines.length > 0 && Math.abs(sumDebits - sumCredits) > 0.01) {
      useToastStore.getState().addToast(`Unbalanced Entry: Debits ($${sumDebits}) must equal Credits ($${sumCredits})!`, 'error');
      return null;
    }

    const totalAmount = sumDebits > 0 ? sumDebits : (entry.totalAmount || 0);
    const newJE = {
      ...entry,
      id: jeId,
      entryNumber: jeId,
      companyCode: entry.companyCode || '1000',
      sourceModule: entry.sourceModule || 'Finance / Manual',
      status: entry.status || 'Posted',
      totalAmount,
      date: entry.date || new Date().toISOString().slice(0, 10)
    };
    await get().genericAdd('journalEntries', newJE);
    useToastStore.getState().addToast(`Journal Entry ${jeId} posted to General Ledger!`, 'success');
    return newJE;
  },
  updateJournalEntry: (id, item) => get().genericUpdate('journalEntries', id, item),
  deleteJournalEntry: (id) => get().genericDelete('journalEntries', id),

  systemAdmins: [
    { id: 'SYS-001', name: 'Super Admin', email: 'super@erp.com', status: 'Active' }
  ],
}));


