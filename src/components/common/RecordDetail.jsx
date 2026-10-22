import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../data/mockStore';
import { ArrowLeft, Clock, FileText, Download, Edit2, CheckCircle, Activity, Printer, Info, Check, X, Box, User, Hash, Tag, Calendar, Layout } from 'lucide-react';

export default function RecordDetail() {
  const { module, entity, id } = useParams();
  const navigate = useNavigate();
  const store = useStore();

  const [activeTab, setActiveTab] = useState('overview');

  // Mapping from url entity to store array name
  const entityMap = {
    'raw-materials': 'rawMaterials',
    'vendors': 'vendors',
    'customers': 'customers',
    'employees': 'employees',
    'warehouses': 'warehouses',
    'financial-years': 'financialYears',
    'manufacturing-master': 'manufacturingItems',
    'finance': 'taxes',
    
    'purchase-orders': 'purchaseOrders',
    'g-r-n': 'grns',
    'grn': 'grns',
    'quality': 'procQuality',
    
    'b-o-ms': 'boms',
    'boms': 'boms',
    'routings': 'routings',
    'production-orders': 'productionOrders',
    'material-transactions': 'materialTransactions',
    'operations': 'operations',
    'receipts': 'receipts',
    'shortages': 'shortages',
    'schedule': 'productionOrders',
    
    'inspections': 'inspections',
    'nonconformance': 'ncrs',
    
    'work-orders': 'workOrders',
    
    'sales-orders': 'salesOrders',
    'orders': 'salesOrders',
    'dispatch': 'dispatches',
    'returns': 'returns',
    
    'pn-l': 'financialYears',
    'pnl': 'financialYears',
    'balance-sheet': 'financialYears',
    
    'policy': 'policies',
    'payroll': 'payrolls'
  };

  const storeKey = entityMap[entity];
  const listData = store[storeKey] || [];
  const record = listData.find(item => String(item.id || item.name || item.code) === String(id));

  if (!record) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>Record Not Found</h2>
        <p style={{ color: 'var(--color-text-gray)', marginBottom: '24px' }}>
          We couldn't find the record for Module: <strong>{module}</strong>, Entity: <strong>{entity}</strong>, ID: <strong>{id}</strong>.<br/>
          (Store Key: <strong>{storeKey || 'undefined'}</strong>, Available Records: <strong>{listData.length}</strong>)
        </p>
        <button className="btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Generate generic tabs based on record
  const recordKeys = Object.keys(record).filter(k => k !== 'id' && k !== 'status' && k !== 'name');

  const getIconForField = (key) => {
    const k = key.toLowerCase();
    if (k.includes('date')) return <Calendar size={16} />;
    if (k.includes('user') || k.includes('employee') || k.includes('contact')) return <User size={16} />;
    if (k.includes('code') || k.includes('id')) return <Hash size={16} />;
    if (k.includes('type') || k.includes('category')) return <Tag size={16} />;
    if (k.includes('qty') || k.includes('amount') || k.includes('total') || k.includes('stock')) return <Layout size={16} />;
    return <Box size={16} />;
  };
  
  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* PREMIUM HEADER */}
      <div style={{ 
        padding: '32px 40px', 
        background: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.4)', 
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        display: 'flex', flexDirection: 'column', gap: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background blob */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--color-primary)', opacity: '0.05', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '10%', width: '150px', height: '150px', background: '#10b981', opacity: '0.05', borderRadius: '50%', filter: 'blur(30px)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-gray)', fontSize: '13px', zIndex: 1 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ margin: '0 4px', color: '#cbd5e1' }}>/</span>
          <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{module.replace('-', ' ')}</span>
          <span style={{ margin: '0 4px', color: '#cbd5e1' }}>/</span>
          <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{entity.replace('-', ' ')}</span>
          <span style={{ margin: '0 4px', color: '#cbd5e1' }}>/</span>
          <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{id}</span>
        </div>
        
        <div className="flex-between" style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--color-primary) 0%, #818cf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)' }}>
              <FileText size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: '#0f172a', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '16px' }}>
                {record.name || record.code || record.id}
                {record.status && (
                  <span style={{ 
                    fontSize: '13px', padding: '6px 14px', borderRadius: '20px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase',
                    background: record.status === 'Active' || record.status === 'Released' || record.status === 'Approved' ? '#dcfce7' : '#e0e7ff',
                    color: record.status === 'Active' || record.status === 'Released' || record.status === 'Approved' ? '#16a34a' : '#4f46e5',
                    border: `1px solid ${record.status === 'Active' || record.status === 'Released' || record.status === 'Approved' ? '#bbf7d0' : '#c7d2fe'}`
                  }}>
                    {record.status}
                  </span>
                )}
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14}/> Last updated on {record.lastUpdated || '21 Sep 2026'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" onClick={() => window.print()} style={{ background: 'white', padding: '12px 20px', borderRadius: '12px' }}>
              <Printer size={16} style={{marginRight: '8px'}}/> Print
            </button>
            <button className="btn-outline" style={{ background: 'white', padding: '12px 20px', borderRadius: '12px' }}>
              <Download size={16} style={{marginRight: '8px'}}/> Export
            </button>
            <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', background: '#0f172a', color: 'white' }}>
              <Edit2 size={16} style={{marginRight: '8px'}}/> Edit Record
            </button>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '32px', marginTop: '16px', borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
          {['overview', 'details', 'audit log'].map(tab => (
            <div 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '12px 0', 
                fontSize: '15px', 
                fontWeight: activeTab === tab ? '700' : '500', 
                color: activeTab === tab ? 'var(--color-primary)' : '#64748b',
                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: '-2px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: '32px 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', flex: 1, overflowY: 'auto' }}>
        
        {/* Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {activeTab === 'overview' && (
            <>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', 
                borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a' }}>
                  <div style={{ width: '8px', height: '24px', background: 'var(--color-primary)', borderRadius: '4px' }}></div>
                  General Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  {recordKeys.map(key => {
                    const val = record[key];
                    const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                    
                    return (
                      <div key={key} style={{ 
                        padding: '20px', background: 'white', borderRadius: '16px', 
                        border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                        transition: 'transform 0.2s', cursor: 'default'
                      }} onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform='none'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <div style={{ color: '#94a3b8' }}>
                            {getIconForField(key)}
                          </div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', wordBreak: 'break-word', marginTop: '4px' }}>
                          {displayVal || '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', 
                borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a' }}>
                  <div style={{ width: '8px', height: '24px', background: '#10b981', borderRadius: '4px' }}></div>
                  Linked Documents
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '20px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => {e.currentTarget.style.borderColor='#cbd5e1'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.03)'}} onMouseOut={e => {e.currentTarget.style.borderColor='#f1f5f9'; e.currentTarget.style.boxShadow='none'}}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <FileText size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>System Generated Report.pdf</h4>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>1.2 MB • Attached automatically on creation</p>
                    </div>
                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '10px', background: 'transparent' }}>View</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'details' && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', 
              borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a' }}>
                <div style={{ width: '8px', height: '24px', background: '#3b82f6', borderRadius: '4px' }}></div>
                Technical & System Details
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px' }}>Field Key</th>
                    <th style={{ padding: '12px 16px' }}>Type</th>
                    <th style={{ padding: '12px 16px' }}>Raw Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(record).map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '600', fontFamily: 'monospace', color: '#2563eb' }}>{k}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{typeof v}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#0f172a' }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit log' && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', 
              borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#0f172a' }}>
                <div style={{ width: '8px', height: '24px', background: '#8b5cf6', borderRadius: '4px' }}></div>
                Audit Trail & History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'Record Status Verified', actor: 'System Process', time: 'Today at 09:15 AM', status: 'Success' },
                  { title: 'Updated Information Synced', actor: 'Admin User (U-001)', time: 'Yesterday at 04:30 PM', status: 'Success' },
                  { title: 'Initial Creation and Auto-Posting', actor: 'Admin User (U-001)', time: record.date || '2026-09-21', status: 'Success' }
                ].map((log, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#ffffff', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{log.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>By {log.actor} • {log.time}</div>
                      </div>
                    </div>
                    <span className="status-badge badge-success">{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ 
            background: 'white', borderRadius: '24px', padding: '24px', 
            boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(255, 255, 255, 0.4)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
            backdropFilter: 'blur(20px)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{ width: '100%', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0f172a', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='#f8fafc'}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle size={16} color="#10b981"/> Approve Record</span>
              </button>
              <button style={{ width: '100%', padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0f172a', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.background='#f8fafc'}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><X size={16} color="#ef4444"/> Reject / Void</span>
              </button>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', 
            borderRadius: '24px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>Activity Log</h3>
            
            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '4px solid #10b981' }}></div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Status Updated</p>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Changed from Draft to Active</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Just now • System Admin</p>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-27px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '4px solid var(--color-primary)' }}></div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>Record Created</p>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Initial data entry completed</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>21 Sep 2026 • Totok Michael</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
