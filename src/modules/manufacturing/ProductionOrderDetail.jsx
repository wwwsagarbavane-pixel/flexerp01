import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Printer, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useStore } from '../../data/mockStore';

export default function ProductionOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  
  // Mock data for the detailed view based on WF-MFG-04
  const order = {
    id: id || 'MO-000184',
    item: 'FG-INS-100 | Insulation Board',
    orderQty: '2,500 EA',
    completedQty: '0 / 0 EA',
    bomRouting: 'Rev C / Rev B',
    plannedStart: '09/21/2026 06:00',
    plannedEnd: '09/21/2026 18:00',
    priority: '3 - High',
    warehouse: 'FG-TOL',
    demandSource: 'SO-003841 / Line 10',
    planner: 'A. Planner',
    status: 'RELEASED'
  };

  const tabs = ['Summary', 'Components', 'Operations', 'Material Transactions', 'Quality', 'Costs', 'Related', 'Audit'];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
          <ChevronLeft size={20} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Production Order: {order.id}</h1>
            <span style={{ padding: '4px 8px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>{order.status}</span>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manufacturing &gt; Production Orders &gt; {order.id}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ background: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: '500' }}>
            <Printer size={16} /> Print Traveler
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
            <Play size={16} /> Start Production
          </button>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="card-glass" style={{ padding: '24px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Item</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.item}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Order Quantity</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.orderQty}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Completed / Scrap</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.completedQty}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>BOM / Routing</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.bomRouting}</p>
        </div>
        
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Planned Start</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.plannedStart}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Planned End</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.plannedEnd}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Priority</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.priority}</p>
        </div>
        <div>
          <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Warehouse</p>
          <p style={{ fontWeight: '600', fontSize: '14px' }}>{order.warehouse}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '32px' }}>
        {tabs.map(tab => (
          <div 
            key={tab} 
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{ 
              paddingBottom: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === tab.toLowerCase() ? '#3b82f6' : '#64748b'
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          <div className="card-glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Release Readiness</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '8px' }}>Check</th>
                  <th style={{ paddingBottom: '8px' }}>Status</th>
                  <th style={{ paddingBottom: '8px' }}>Detail</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '14px' }}>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0' }}>BOM and routing</td>
                  <td><span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14}/> Pass</span></td>
                  <td style={{ color: '#64748b' }}>Approved and effective</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0' }}>Material availability</td>
                  <td><span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14}/> Warning</span></td>
                  <td style={{ color: '#64748b' }}>PKG-FILM-02 shortage: 350 EA</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0' }}>Work-center capacity</td>
                  <td><span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14}/> Pass</span></td>
                  <td style={{ color: '#64748b' }}>LINE-01 reserved</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card-glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Progress Summary</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '8px' }}>Operation</th>
                  <th style={{ paddingBottom: '8px' }}>Work Center</th>
                  <th style={{ paddingBottom: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '14px' }}>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0' }}>10 Mix and form</td>
                  <td>MIX-01</td>
                  <td><span style={{ padding: '2px 8px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>Ready</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0' }}>20 Cure</td>
                  <td>OVEN-01</td>
                  <td><span style={{ padding: '2px 8px', background: '#f1f5f9', color: '#64748b', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>Pending</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 0' }}>30 Cut and pack</td>
                  <td>LINE-01</td>
                  <td><span style={{ padding: '2px 8px', background: '#f1f5f9', color: '#64748b', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeTab !== 'summary' && (
        <div className="card-glass" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          This tab content is populated dynamically during runtime from the module store.
        </div>
      )}

    </div>
  );
}
