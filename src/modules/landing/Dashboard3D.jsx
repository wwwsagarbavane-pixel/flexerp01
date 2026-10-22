import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Box, Truck, Users, Database, Activity, 
  BarChart2, Clock, Calendar, Plus, ArrowUpRight, ArrowDownRight,
  AlertCircle, Shield, CheckCircle
} from 'lucide-react';
import './Dashboard3D.css';

export default function Dashboard3D() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) {
         setMousePos({ x: 0, y: 0 });
         return;
      }
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const tabs = ['overview', 'production', 'inventory', 'sales'];
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const nextIndex = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const getKPIs = () => {
    switch(activeTab) {
      case 'production':
        return [
          { label: "Output", value: "12,450", trend: "+5.2%", color: "#3b82f6" },
          { label: "Orders", value: "84", trend: "+12", color: "#8b5cf6" },
          { label: "OEE", value: "92%", trend: "+1%", color: "#10b981" },
          { label: "Defects", value: "1.2%", trend: "-0.5%", color: "#ef4444" }
        ];
      case 'inventory':
        return [
          { label: "Stock Value", value: "$4.2M", trend: "+2.1%", color: "#3b82f6" },
          { label: "Low Stock", value: "12", trend: "-3", color: "#f59e0b" },
          { label: "Warehouses", value: "4", trend: "+0", color: "#10b981" },
          { label: "Turnover", value: "8.5x", trend: "+0.2x", color: "#8b5cf6" }
        ];
      case 'sales':
        return [
          { label: "Revenue", value: "$1.8M", trend: "+15%", color: "#10b981" },
          { label: "Orders", value: "342", trend: "+24", color: "#3b82f6" },
          { label: "Customers", value: "1,204", trend: "+12", color: "#8b5cf6" },
          { label: "Conversion", value: "4.8%", trend: "+0.5%", color: "#f59e0b" }
        ];
      default: // overview
        return [
          { label: "Total Masters", value: "42", trend: "+2", color: "#3b82f6" },
          { label: "Raw Materials", value: "24", trend: "+1", color: "#6366f1" },
          { label: "Vendors", value: "8", trend: "+0", color: "#f59e0b" },
          { label: "Customers", value: "10", trend: "+0", color: "#10b981" }
        ];
    }
  };

  const getChartData = () => {
    switch(activeTab) {
      case 'production': return [30, 45, 60, 50, 75, 80, 85];
      case 'inventory': return [80, 70, 75, 65, 60, 50, 45];
      case 'sales': return [20, 30, 40, 60, 80, 95, 110];
      default: return [40, 65, 45, 80, 55, 90, 70];
    }
  };

  const getActivities = () => {
    switch(activeTab) {
      case 'production': return [{title: 'Machine 3 Error', type: 'error'}, {title: 'Order completed', type: 'success'}];
      case 'inventory': return [{title: 'Stock low (Resin)', type: 'warning'}, {title: 'Restock arrived', type: 'success'}];
      case 'sales': return [{title: 'New big contract', type: 'success'}, {title: 'Target reached', type: 'success'}];
      default: return [{title: 'Data Incomplete', type: 'error'}, {title: 'Vendor Approvals', type: 'warning'}];
    }
  };

  const kpis = getKPIs();
  const chartData = getChartData();
  const activities = getActivities();

  // Parallax calculations
  const bgTranslate = `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`;
  const dashTranslate = `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) rotateY(${mousePos.x * -2}deg) rotateX(${mousePos.y * 2}deg)`;
  const floatCardsTranslate = `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`;
  const foregroundTranslate = `translate(${mousePos.x * -60}px, ${mousePos.y * -60}px)`; // Faster parallax for foreground
  const personTranslate = `translate(0px, 0px)`; // Fixed person (no parallax)

  return (
    <div className="d3d-container">
      
      {/* AMBIENT 3D GLOW ORBS */}
      <div className="d3d-ambient-orbs">
        <div className="d3d-orb d3d-orb-1"></div>
        <div className="d3d-orb d3d-orb-2"></div>
      </div>

      {/* BACKGROUND DEPTH LAYER */}
      <div className="d3d-layer d3d-back-layer" style={{ transform: bgTranslate }}>
        <div className="d3d-glass-panel"></div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="d3d-layer d3d-main-layer" style={{ transform: dashTranslate }}>
        <div className="d3d-dashboard-ui">
          {/* Sidebar */}
          <div className="d3d-sidebar">
            <div className="d3d-logo">
              <div className="d3d-logo-icon"></div>
              <span>ERP</span>
            </div>
            <div className="d3d-nav">
              {['Dashboard', 'Raw Material', 'Vendor', 'Manufacturing', 'Customer'].map((t, i) => (
                <div key={t} className={`d3d-nav-item ${i === 0 ? 'active' : ''}`}>
                  <div className="d3d-nav-icon"></div>
                  <div className="d3d-nav-text"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="d3d-content">
            
            {/* Topbar */}
            <div className="d3d-topbar">
              <div className="d3d-search"></div>
              <div className="d3d-profile"></div>
            </div>

            {/* Dashboard Header & Tabs */}
            <div className="d3d-header">
              <h2>Master Data Control Center</h2>
              <div className="d3d-tabs">
                <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                <button className={activeTab === 'production' ? 'active' : ''} onClick={() => setActiveTab('production')}>Production</button>
                <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Inventory</button>
                <button className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>Sales</button>
              </div>
            </div>

            {/* KPIs */}
            <div className="d3d-kpis">
              {kpis.map((kpi, i) => (
                <div key={`${activeTab}-${i}`} className="d3d-kpi-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="d3d-kpi-header">
                    <span style={{ color: kpi.color }} className="d3d-kpi-icon-ph"></span>
                    <span className="d3d-kpi-label">{kpi.label}</span>
                  </div>
                  <div className="d3d-kpi-value">{kpi.value}</div>
                  <div className="d3d-kpi-trend" style={{ color: kpi.trend.startsWith('-') ? '#ef4444' : '#10b981' }}>{kpi.trend} this week</div>
                  
                  {/* Subtle decorative wave */}
                  <div className="d3d-kpi-wave" style={{ background: kpi.color, opacity: 0.1 }}></div>
                </div>
              ))}
            </div>

            {/* Middle Section: Chart & Alerts */}
            <div className="d3d-middle">
              <div className="d3d-chart-card">
                <h3>Weekly Trend</h3>
                <div className="d3d-chart-bars">
                  {chartData.map((h, j) => (
                    <div key={j} className="d3d-bar-wrapper">
                      <div className="d3d-bar" style={{ height: `${(h/110)*100}%`, background: j === chartData.length - 1 ? '#3b82f6' : '#bfdbfe' }}></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="d3d-alerts-card">
                <h3><AlertCircle size={16} color="#ef4444"/> Status Items</h3>
                {activities.map((act, i) => (
                   <div key={i} className={`d3d-alert-item ${act.type}`}>{act.title}</div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FLOATING ELEMENTS */}
      <div className="d3d-layer d3d-float-layer" style={{ transform: floatCardsTranslate }}>
        <div className="d3d-float-card revenue-float">
          <div className="icon bg-green"><Activity size={16}/></div>
          <div>
            <h4>System Health</h4>
            <p>99.9% Uptime</p>
          </div>
        </div>
        <div className="d3d-float-card alert-float">
           <div className="icon bg-orange"><Clock size={16}/></div>
           <div>
             <h4>New Update</h4>
             <p>Just synced.</p>
           </div>
        </div>
      </div>

      {/* PERSON FOREGROUND */}
      <div className="d3d-layer d3d-person-layer" style={{ transform: personTranslate }}>
        <img src="/person-cutout.png" alt="Professional using ERP" className="person-image" />
      </div>

      {/* FOREGROUND 3D ELEMENTS (Extreme parallax) */}
      <div className="d3d-layer d3d-extreme-foreground" style={{ transform: foregroundTranslate }}>
        <div className="d3d-floating-badge top-left">
          <div className="badge-dot pulse"></div>
          AI Optimization Active
        </div>
        <div className="d3d-floating-badge bottom-right">
          <CheckCircle size={14} color="#10b981" />
          Zero Latency
        </div>
      </div>

    </div>
  );
}
