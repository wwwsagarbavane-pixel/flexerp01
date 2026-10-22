import React from 'react';
import { Link } from 'react-router-dom';

import { 
  MoreHorizontal, Calendar, Plus, ArrowUpRight, ChevronRight, AlertCircle, 
  Clock, Database, Box, Truck, Users, Activity, Settings, User
} from 'lucide-react';

// Reusable SVG Wave component
const WaveLine = ({ color, startY, endY }) => (
  <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 100 40" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.6 }}>
    <defs>
      <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} stopOpacity="0.1" />
        <stop offset="50%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <path 
      d={`M0,${startY} C30,${startY} 50,${endY} 100,${startY} L100,40 L0,40 Z`} 
      fill={`url(#grad-${color})`} 
    />
    <path 
      d={`M0,${startY} C30,${startY} 50,${endY} 100,${startY}`} 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </svg>
);

export default function Dashboard() {
  const kpis = [{"label":"Total Masters","value":"10","trend":"+2","comparison":"this week"},{"label":"Raw Materials","value":"3","trend":"+1","comparison":"this week"},{"label":"Vendors","value":"2","trend":"+0","comparison":"this week"},{"label":"Customers","value":"1","trend":"+0","comparison":"this week"}];
  const ordersData = [{"id":"RM-001","name":"Copper Sheet","category":"Metal","catBg":"#eff6ff","catColor":"#3b82f6","uom":"KG","wh":"WH-01","avail":"4,820","status":"Active"},{"id":"RM-002","name":"Packaging Film","category":"Packaging","catBg":"#f3e8ff","catColor":"#8b5cf6","uom":"M","wh":"WH-02","avail":"2,210","status":"Low Stock"},{"id":"RM-003","name":"Resin Compound","category":"Chemical","catBg":"#fee2e2","catColor":"#ef4444","uom":"KG","wh":"WH-01","avail":"8,420","status":"Active"},{"id":"RM-004","name":"Aluminium Extrusion","category":"Metal","catBg":"#eff6ff","catColor":"#3b82f6","uom":"KG","wh":"WH-03","avail":"1,500","status":"Active"}];
  const alerts = [{"bg":"#fef2f2","border":"#fecaca","iconBg":"#fee2e2","titleColor":"#b91c1c","descColor":"#ef4444","title":"Data Incomplete","desc":"5 Raw Materials missing UOM definitions"},{"bg":"#fffbeb","border":"#fde68a","iconBg":"#fef3c7","titleColor":"#b45309","descColor":"#f59e0b","title":"Vendor Approvals","desc":"3 new vendors require onboarding approval"}];
  const activities = [{"title":"Raw Material Updated","desc":"RM-001 • Stock quantity updated","time":"2m ago"},{"title":"New Vendor Added","desc":"AgroTech Suppliers","time":"12m ago"},{"title":"UOM Configuration","desc":"KG added to Metal category","time":"1h ago"},{"title":"Customer Created","desc":"Kisan Agro Pvt. Ltd.","time":"2h ago"}];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 8px 32px 8px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1f36', marginBottom: '4px', letterSpacing: '-0.5px' }}>Manufacturing Dashboard</h1>
          <p style={{ color: '#8792a2', fontSize: '15px' }}>Manage manufacturing entities and track progress</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f566b', fontSize: '14px', background: 'rgba(255,255,255,0.7)', padding: '10px 16px', borderRadius: '12px', fontWeight: '500', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <Calendar size={16} /> 21 Sep 2026
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1a1f36', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26, 31, 54, 0.2)' }}>
            <Plus size={16} /> Quick Action
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {kpis.map((kpi, i) => {
          const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];
          const color = colors[i % colors.length];
          const bgColors = ['#eff6ff', '#f3e8ff', '#fef3c7', '#d1fae5'];
          const iconBg = bgColors[i % bgColors.length];
          const IconObj = [Database, Box, Truck, Users][i % 4];
          
          return (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: iconBg, padding: '10px', borderRadius: '10px', color: color }}>
                    <IconObj size={20} />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1f36' }}>{kpi.label}</span>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#8792a2', cursor: 'pointer' }}><MoreHorizontal size={20} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#1a1f36', lineHeight: 1 }}>{kpi.value}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', zIndex: 2 }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: '700' }}>
                    <ArrowUpRight size={14} style={{marginRight: '2px'}}/> {kpi.trend}
                  </span>
                  <span style={{ color: '#8792a2', fontWeight: '500' }}>{kpi.comparison}</span>
                </div>
              </div>
              
              <WaveLine color={color} startY={i % 2 === 0 ? 30 : 10} endY={i % 2 === 0 ? 10 : 30} />
            </div>
          );
        })}
      </div>

      {/* MIDDLE SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Weekly Overview */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f36' }}>Weekly Overview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#4f566b', cursor: 'pointer' }}>
              <Calendar size={14} /> This Week <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }}/>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '32px', height: '220px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', position: 'relative' }}>
              {/* Grid lines */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '24px', display: 'flex', flexDirection: 'column', justifyContext: 'space-between' }}>
                {[200, 150, 100, 50, 0].map((val, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, borderTop: val !== 200 ? '1px dashed #e2e8f0' : 'none' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', width: '20px', transform: 'translateY(-50%)' }}>{val}</span>
                  </div>
                ))}
              </div>
              
              {/* Bars */}
              {[40, 65, 45, 70, 50, 85, 60].map((h, j) => (
                <div key={j} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '32px', height: `${h}%`, background: j === 5 ? '#3b82f6' : '#dbeafe', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                    {j === 5 && (
                      <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                        175
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: j === 5 ? '700' : '500' }}>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][j]}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Right Stats */}
            <div style={{ width: '160px', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '8px', borderRadius: '8px' }}><Activity size={18}/></div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1f36', lineHeight: 1.2 }}>175</h4>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Highest records</p>
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#d1fae5', color: '#10b981', padding: '8px', borderRadius: '8px' }}><ArrowUpRight size={18}/></div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1f36', lineHeight: 1.2 }}>+12%</h4>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>vs last week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} color="#ef4444" />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f36' }}>Action Items</h3>
              <span style={{ background: '#94a3b8', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>2</span>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {alerts.map((al, i) => (
              <div key={i} style={{ padding: '16px', background: al.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${al.border}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: al.iconBg, color: al.titleColor, padding: '10px', borderRadius: '50%' }}>
                    {i === 0 ? <AlertCircle size={20}/> : <Clock size={20}/>}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '14px', color: al.titleColor, marginBottom: '4px' }}>{al.title}</p>
                    <p style={{ fontSize: '13px', color: al.descColor, fontWeight: '500' }}>{al.desc}</p>
                  </div>
                </div>
                <div style={{ width: '28px', height: '28px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: al.titleColor, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Recent Records */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f36' }}>Recent Records</h3>
            <button style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}><div style={{ width: '16px', height: '16px', border: '2px solid #cbd5e1', borderRadius: '4px' }}></div></th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}>ID</th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}>NAME</th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}>CATEGORY</th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}>UOM</th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}>WAREHOUSE</th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}>AVAILABLE</th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}>STATUS</th>
                <th style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '11px', fontWeight: '700' }}></th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '16px 12px' }}><div style={{ width: '16px', height: '16px', border: '2px solid #cbd5e1', borderRadius: '4px' }}></div></td>
                  <td style={{ padding: '16px 12px', fontSize: '13px', color: '#64748b' }}>{row.id}</td>
                  <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Box size={16} color="#64748b" />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1f36' }}>{row.name}</span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ background: row.catBg || '#eff6ff', color: row.catColor || '#3b82f6', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>{row.category}</span>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '13px', color: '#64748b' }}>{row.uom}</td>
                  <td style={{ padding: '16px 12px', fontSize: '13px', color: '#64748b' }}>{row.wh}</td>
                  <td style={{ padding: '16px 12px', fontSize: '13px', color: '#64748b' }}>{row.avail}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: row.status === 'Active' ? '#10b981' : '#f59e0b' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.status === 'Active' ? '#10b981' : '#f59e0b' }}></div>
                      {row.status}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', color: '#cbd5e1' }}><MoreHorizontal size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f36' }}>Recent Activity</h3>
            <button style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', padding: '10px', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {i === 0 ? <Box size={18}/> : i === 1 ? <User size={18}/> : i === 2 ? <Settings size={18}/> : <User size={18}/>}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1f36', marginBottom: '4px' }}>{act.title}</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{act.desc}</p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
