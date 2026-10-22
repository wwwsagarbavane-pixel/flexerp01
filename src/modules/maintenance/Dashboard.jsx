import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MoreHorizontal, Calendar, Plus, ArrowUpRight, ChevronRight, AlertCircle, 
  Clock, Database, Box, Truck, Users, Activity, Settings, User
} from 'lucide-react';
import { useStore } from '../../data/mockStore';

// Reusable SVG Wave component
const WaveLine = ({ color, startY, endY }) => (
  <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 100 40" style={{ position: 'absolute', bottom: 0, left: 0, opacity: 0.6 }}>
    <defs>
      <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} stopOpacity="0.1" />
        <stop offset="50%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <path 
      d={`M0,${startY} C30,${startY} 50,${endY} 100,${startY} L100,40 L0,40 Z`} 
      fill={`url(#grad-${color.replace('#', '')})`} 
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
  const store = useStore();
  
  // Dynamic KPIs calculated from store
  const kpis = [
    {
      label: 'Open Work Orders',
      value: store.workOrders.filter(w=>w.status!=="Closed").length,
      trend: '5%',
      comparison: 'vs last month',
      path: '/app/quality-maintenance/work-orders'
    },
    {
      label: 'Assets Down',
      value: 0,
      trend: '0%',
      comparison: 'vs last month',
      path: '/app/quality-maintenance/work-orders'
    },
    {
      label: 'Overdue PM',
      value: 0,
      trend: '100%',
      comparison: 'vs last month',
      path: '/app/quality-maintenance/work-orders'
    },
    {
      label: 'Uptime',
      value: "99.9%",
      trend: '0.1%',
      comparison: 'vs last month',
      path: '/app/quality-maintenance/work-orders'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 8px 32px 8px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1f36', marginBottom: '8px', letterSpacing: '-0.5px' }}>Maintenance Dashboard</h1>
          <p style={{ color: '#8792a2', fontSize: '15px' }}>Asset health, work orders, and scheduled downtime</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f566b', fontSize: '14px', background: 'rgba(255,255,255,0.7)', padding: '10px 16px', borderRadius: '12px', fontWeight: '500', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <Calendar size={16} /> 30 Sep 2026
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
            <Link to={kpi.path || '/app/quality-maintenance/dashboard'} key={i} style={{ textDecoration: 'none', background: 'white', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'block', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
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
            </Link>
          );
        })}
      </div>

      {/* MIDDLE SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Chart / Weekly Overview */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f36' }}>Activity Overview</h3>
            <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#4f566b', outline: 'none' }}>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 24px 16px', borderBottom: '1px dashed #e2e8f0', position: 'relative' }}>
            {/* Y-axis labels */}
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#a0aec0', fontSize: '12px' }}>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            
            {/* Bars */}
            {[45, 80, 35, 95, 60, 20, 15].map((val, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '32px' }}>
                <div style={{ 
                  height: `${val}%`, 
                  width: '100%', 
                  background: i === 3 ? '#10b981' : 'var(--color-primary-light)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.3s ease'
                }} />
                <span style={{ color: '#4f566b', fontSize: '13px', fontWeight: i === 3 ? '700' : '500' }}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f36' }}>Requires Attention</h3>
            <span style={{ background: '#fee2e2', color: '#ef4444', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>3 Alerts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7' }}>
              <div style={{ color: '#d97706', marginTop: '2px' }}><AlertCircle size={20} /></div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>Pending Approval</h4>
                <p style={{ fontSize: '13px', color: '#b45309', lineHeight: 1.4 }}>Action required on draft records.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
              <div style={{ color: '#ef4444', marginTop: '2px' }}><AlertCircle size={20} /></div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#b91c1c', marginBottom: '4px' }}>Critical Alert</h4>
                <p style={{ fontSize: '13px', color: '#dc2626', lineHeight: 1.4 }}>Immediate action required in this module.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
