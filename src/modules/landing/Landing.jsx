import React, { useEffect, useState } from 'react';
import Dashboard3D from './Dashboard3D';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Check, Search, Menu, X, Play, Activity,
  Database, ShoppingCart, Factory, BarChart2, Shield, Users,
  Settings, Cloud, BarChart, FileText, Globe, Box, Target
} from 'lucide-react';
import './Landing.css';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      
      {/* NAVBAR */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="Flex ERP" style={{ height: '38px', objectFit: 'contain' }} />
            </Link>
          </div>
          
          <div className="nav-links desktop-only">
            <a href="#solutions">Solutions</a>
            <a href="#industries">Industries</a>
            <a href="#work">Our Work</a>
            <a href="#pricing">Pricing</a>
            <a href="#resources">Resources</a>
          </div>

          <div className="nav-actions desktop-only">
            <button className="icon-btn"><Search size={18} /></button>
            <a href="#contact" className="btn-text">Contact Sales</a>
            <Link to="/company-select" className="btn-primary-glass">Get Started <ArrowRight size={16}/></Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {mobileMenu && (
          <div className="mobile-nav">
            <a href="#solutions" onClick={() => setMobileMenu(false)}>Solutions</a>
            <a href="#industries" onClick={() => setMobileMenu(false)}>Industries</a>
            <a href="#work" onClick={() => setMobileMenu(false)}>Our Work</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)}>Pricing</a>
            <a href="#resources" onClick={() => setMobileMenu(false)}>Resources</a>
            <Link to="/company-select" onClick={() => setMobileMenu(false)} className="btn-primary-glass" style={{justifyContent: 'center', marginTop: '16px'}}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: "url('/hero-bg.png')" }}></div>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-logo-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(12px)', padding: '8px 20px 8px 12px', borderRadius: '40px', boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)', border: '1px solid rgba(255, 255, 255, 1)' }}>
              <img src="/logo.png" alt="Flex ERP" style={{ height: '26px', objectFit: 'contain' }} />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.2px' }}>Next-Gen Enterprise Platform</span>
            </div>
            <div className="eyebrow">
              <span className="dot"></span> CUSTOM ERP SOLUTIONS
            </div>
            <h1 className="hero-title">ERP Built Around<br/>Your Business.</h1>
            <p className="hero-subtitle">
              We design and build modern ERP platforms tailored to your workflows, operations, teams, and business requirements.
            </p>
            <div className="hero-actions">
              <Link to="/company-select" className="btn-primary-solid">Build Your ERP <ArrowRight size={16}/></Link>
              <a href="#solutions" className="btn-outline-glass">Explore Solutions</a>
            </div>
            <div className="hero-checks">
              <span><Check size={16} /> Designed</span>
              <span><Check size={16} /> Developed</span>
              <span><Check size={16} /> Integrated</span>
              <span><Check size={16} /> Scaled</span>
            </div>

            {/* MOBILE HERO VISUAL SHOWCASE - The Main Subject of Flex ERP */}
            <div className="mobile-hero-showcase">
              <div className="m-hero-card">
                {/* Header */}
                <div className="m-hero-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/logo.png" alt="Flex ERP" style={{ height: '22px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Live System Control</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#059669', background: 'rgba(16,185,129,0.1)', padding: '3px 10px', borderRadius: '12px' }}>
                    <span className="live-pulse-dot"></span> Online
                  </div>
                </div>

                {/* Metric Chips */}
                <div className="m-hero-metrics">
                  <div className="m-metric-chip">
                    <span className="m-metric-label">Sales Revenue</span>
                    <span className="m-metric-val">$1.8M</span>
                    <span className="m-metric-trend" style={{ color: '#10b981' }}>+15.2% ↑</span>
                  </div>
                  <div className="m-metric-chip">
                    <span className="m-metric-label">Output (OEE)</span>
                    <span className="m-metric-val">12,450 pcs</span>
                    <span className="m-metric-trend" style={{ color: '#3b82f6' }}>92% Speed</span>
                  </div>
                  <div className="m-metric-chip">
                    <span className="m-metric-label">System Health</span>
                    <span className="m-metric-val">99.9%</span>
                    <span className="m-metric-trend" style={{ color: '#7c3aed' }}>Zero Lag</span>
                  </div>
                </div>

                {/* Mini Chart Visualization */}
                <div className="m-hero-chart">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Weekly Performance Index</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb' }}>Real-Time GL Sync</span>
                  </div>
                  <div className="m-chart-bars">
                    {[45, 60, 50, 75, 65, 90, 80, 100].map((h, i) => (
                      <div key={i} className="m-bar-col">
                        <div className="m-bar" style={{ height: `${h}%`, background: i === 7 ? 'linear-gradient(180deg, #2563eb, #3b82f6)' : '#cbd5e1' }}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Floating Badge */}
                <div className="m-hero-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></div>
                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>Procurement • Sales • Finance • Reports Synced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 5 }}>
           <Dashboard3D />
        </div>
      </section>

      {/* WHAT WE BUILD SECTION */}
      <section className="what-we-build" id="solutions">
        <div className="container wwb-grid">
          
          <div className="wwb-left">
            <div className="eyebrow wwb-eyebrow">
              <span className="dot"></span> WHAT WE BUILD
            </div>
            <h2 className="section-title">Everything Your<br/>Business Needs.<br/><span className="text-gradient">One Custom ERP.</span></h2>
            <p className="section-subtitle">
              We design and develop custom ERP platforms that connect your teams, workflows, operations, and data in one powerful system.
            </p>
            <div className="wwb-actions">
              <Link to="/company-select" className="btn-primary-dark">Build Your ERP <ArrowRight size={16}/></Link>
              <a href="#features" className="btn-outline-dark">Explore Solutions</a>
            </div>
            <div className="wwb-features">
              <div className="wwb-feature"><Settings size={20}/> <span>Tailored<br/>Solutions</span></div>
              <div className="wwb-feature"><Shield size={20}/> <span>Secure &<br/>Scalable</span></div>
              <div className="wwb-feature"><Activity size={20}/> <span>Faster<br/>Operations</span></div>
              <div className="wwb-feature"><Users size={20}/> <span>Dedicated<br/>Support</span></div>
            </div>
          </div>

          <div className="wwb-right">
            <div className="feature-cards-grid">
              
              <div className="feature-card glass-card">
                <div className="fc-icon-wrapper"><Box size={24} color="#0052ff"/></div>
                <h3>Custom ERP Development</h3>
                <p>ERP designed around your exact business workflows, processes, and goals.</p>
                <a href="#" className="fc-link">Learn More <ArrowRight size={16}/></a>
              </div>

              <div className="feature-card glass-card">
                <div className="fc-icon-wrapper"><Settings size={24} color="#0052ff"/></div>
                <h3>Business Automation</h3>
                <p>Automate repetitive processes, approvals, and daily operations.</p>
                <a href="#" className="fc-link">Learn More <ArrowRight size={16}/></a>
              </div>

              <div className="feature-card glass-card">
                <div className="fc-icon-wrapper"><Cloud size={24} color="#0052ff"/></div>
                <h3>System Integration</h3>
                <p>Connect accounting, CRM, inventory, communication tools and more.</p>
                <a href="#" className="fc-link">Learn More <ArrowRight size={16}/></a>
              </div>

              <div className="feature-card glass-card">
                <div className="fc-icon-wrapper"><BarChart2 size={24} color="#0052ff"/></div>
                <h3>Data & Analytics</h3>
                <p>Real-time dashboards, reports and actionable business insights.</p>
                <a href="#" className="fc-link">Learn More <ArrowRight size={16}/></a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="modules-section" id="solutions">
        <div className="mod-bg-blobs">
          <div className="mod-blob-1"></div>
          <div className="mod-blob-2"></div>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="text-center section-header mod-header">
            <div className="eyebrow"><span className="dot"></span> ERP MODULES</div>
            <h2>One ERP. <span className="text-gradient">Everything Connected.</span></h2>
            <p>
              Comprehensive modules tailored for your operations. Manage your entire business<br/>from a single, integrated platform.
            </p>
          </div>
          
          <div className="modules-grid-new">
            {/* Card 1 */}
            <div className="mod-card">
              <div className="mod-card-top">
                <div className="mod-icon-wrapper theme-blue">
                  <Database size={24} />
                </div>
                <div className="mod-number">01</div>
              </div>
              <h3>Master Data</h3>
              <p className="mod-desc">Manage raw materials, vendors, customers, and core entities.</p>
              <ul className="mod-features">
                <li><div className="check-circle theme-blue-bg"><Check size={12} strokeWidth={3}/></div> Centralized master records</li>
                <li><div className="check-circle theme-blue-bg"><Check size={12} strokeWidth={3}/></div> Supplier & customer data</li>
                <li><div className="check-circle theme-blue-bg"><Check size={12} strokeWidth={3}/></div> Easy data management</li>
              </ul>
              <button className="mod-arrow-btn"><ArrowRight size={18} /></button>
            </div>

            {/* Card 2 */}
            <div className="mod-card">
              <div className="mod-card-top">
                <div className="mod-icon-wrapper theme-green">
                  <ShoppingCart size={24} />
                </div>
                <div className="mod-number">02</div>
              </div>
              <h3>Procurement</h3>
              <p className="mod-desc">Automate purchase orders, GRN, and incoming quality.</p>
              <ul className="mod-features">
                <li><div className="check-circle theme-green-bg"><Check size={12} strokeWidth={3}/></div> Vendor management</li>
                <li><div className="check-circle theme-green-bg"><Check size={12} strokeWidth={3}/></div> Purchase order automation</li>
                <li><div className="check-circle theme-green-bg"><Check size={12} strokeWidth={3}/></div> Incoming quality control</li>
              </ul>
              <button className="mod-arrow-btn"><ArrowRight size={18} /></button>
            </div>

            {/* Card 3 */}
            <div className="mod-card">
              <div className="mod-card-top">
                <div className="mod-icon-wrapper theme-purple">
                  <Factory size={24} />
                </div>
                <div className="mod-number">03</div>
              </div>
              <h3>Manufacturing</h3>
              <p className="mod-desc">Plan production, track work centers, and manage shortages.</p>
              <ul className="mod-features">
                <li><div className="check-circle theme-purple-bg"><Check size={12} strokeWidth={3}/></div> Production planning</li>
                <li><div className="check-circle theme-purple-bg"><Check size={12} strokeWidth={3}/></div> Work center management</li>
                <li><div className="check-circle theme-purple-bg"><Check size={12} strokeWidth={3}/></div> Material requirement tracking</li>
              </ul>
              <button className="mod-arrow-btn"><ArrowRight size={18} /></button>
            </div>

            {/* Card 4 */}
            <div className="mod-card">
              <div className="mod-card-top">
                <div className="mod-icon-wrapper theme-orange">
                  <BarChart2 size={24} />
                </div>
                <div className="mod-number">04</div>
              </div>
              <h3>Sales & Distribution</h3>
              <p className="mod-desc">Streamline orders, fulfillment, dispatch, and returns.</p>
              <ul className="mod-features">
                <li><div className="check-circle theme-orange-bg"><Check size={12} strokeWidth={3}/></div> Sales order management</li>
                <li><div className="check-circle theme-orange-bg"><Check size={12} strokeWidth={3}/></div> Dispatch & delivery tracking</li>
                <li><div className="check-circle theme-orange-bg"><Check size={12} strokeWidth={3}/></div> Returns and replacements</li>
              </ul>
              <button className="mod-arrow-btn"><ArrowRight size={18} /></button>
            </div>

            {/* Card 5 */}
            <div className="mod-card">
              <div className="mod-card-top">
                <div className="mod-icon-wrapper theme-blue-alt">
                  <FileText size={24} />
                </div>
                <div className="mod-number">05</div>
              </div>
              <h3>Reports & Analytics</h3>
              <p className="mod-desc">Generate P&L, balance sheets, and real-time business insights.</p>
              <ul className="mod-features">
                <li><div className="check-circle theme-blue-alt-bg"><Check size={12} strokeWidth={3}/></div> Financial & operational reports</li>
                <li><div className="check-circle theme-blue-alt-bg"><Check size={12} strokeWidth={3}/></div> Real-time dashboards</li>
                <li><div className="check-circle theme-blue-alt-bg"><Check size={12} strokeWidth={3}/></div> Custom reports and analytics</li>
              </ul>
              <button className="mod-arrow-btn"><ArrowRight size={18} /></button>
            </div>

            {/* Card 6 */}
            <div className="mod-card">
              <div className="mod-card-top">
                <div className="mod-icon-wrapper theme-pink">
                  <Users size={24} />
                </div>
                <div className="mod-number">06</div>
              </div>
              <h3>HR & Workforce</h3>
              <p className="mod-desc">Manage employee policies, attendance, and payroll runs.</p>
              <ul className="mod-features">
                <li><div className="check-circle theme-pink-bg"><Check size={12} strokeWidth={3}/></div> Employee management</li>
                <li><div className="check-circle theme-pink-bg"><Check size={12} strokeWidth={3}/></div> Attendance & leave tracking</li>
                <li><div className="check-circle theme-pink-bg"><Check size={12} strokeWidth={3}/></div> Payroll processing</li>
              </ul>
              <button className="mod-arrow-btn"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="showcase-section">
        <div className="container">
          <div className="text-center section-header">
            <h2>Your Business.<br/>One Connected ERP.</h2>
            <p>A unified dashboard that gives you complete control over your enterprise.</p>
          </div>
          
          <div className="dashboard-mockup">
            {/* Pseudo Dashboard UI built with CSS to look realistic */}
            <div className="dash-header">
              <div className="dash-logo"></div>
              <div className="dash-search"></div>
              <div className="dash-profile"></div>
            </div>
            <div className="dash-body">
              <div className="dash-sidebar">
                {[1,2,3,4,5,6].map(i => <div key={i} className="dash-nav-item"></div>)}
              </div>
              <div className="dash-content">
                <div className="dash-kpis">
                  {[1,2,3,4].map(i => <div key={i} className="dash-kpi-card"></div>)}
                </div>
                <div className="dash-grid-2">
                  <div className="dash-chart-card"></div>
                  <div className="dash-list-card"></div>
                </div>
                <div className="dash-table-card"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="workflow-section">
        <div className="container">
          <div className="text-center section-header">
            <h2>Built Around Your Business.<br/>Not the Other Way Around.</h2>
            <p>Every business is unique. Your ERP should adapt to your workflows.</p>
          </div>
          
          <div className="workflow-diagram">
            <div className="flow-step">YOUR<br/>BUSINESS</div>
            <ArrowRight className="flow-arrow" size={32}/>
            <div className="flow-step">YOUR<br/>WORKFLOWS</div>
            <ArrowRight className="flow-arrow" size={32}/>
            <div className="flow-step">YOUR<br/>PROCESSES</div>
            <ArrowRight className="flow-arrow" size={32}/>
            <div className="flow-step highlight">CUSTOM<br/>ERP</div>
          </div>
        </div>
      </section>

      {/* AUTOMATION SECTION */}
      <section className="automation-section">
        <div className="container">
          <div className="text-center section-header">
            <h2>Automate the Work.<br/>Focus on the Business.</h2>
          </div>
          
          <div className="automation-grid">
            <div className="auto-card">
              <h4>Purchase Approval</h4>
              <div className="auto-flow"><ArrowRight size={16}/> ERP Workflow <ArrowRight size={16}/></div>
              <span className="auto-status success">Approved</span>
            </div>
            <div className="auto-card">
              <h4>Production Planning</h4>
              <div className="auto-flow"><ArrowRight size={16}/> ERP Workflow <ArrowRight size={16}/></div>
              <span className="auto-status primary">Scheduled</span>
            </div>
            <div className="auto-card">
              <h4>Sales Order</h4>
              <div className="auto-flow"><ArrowRight size={16}/> ERP Workflow <ArrowRight size={16}/></div>
              <span className="auto-status warning">Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="comparison-section">
        <div className="container">
          <div className="comparison-grid">
            <div className="comp-card traditional">
              <h3>Traditional ERP</h3>
              <ul>
                <li><X size={18} color="var(--color-error)"/> Generic workflows</li>
                <li><X size={18} color="var(--color-error)"/> Rigid processes</li>
                <li><X size={18} color="var(--color-error)"/> Unused features</li>
                <li><X size={18} color="var(--color-error)"/> Disconnected systems</li>
              </ul>
            </div>
            <div className="comp-card custom">
              <h3>Custom ERP</h3>
              <ul>
                <li><Check size={18} color="var(--color-success)"/> Your workflows</li>
                <li><Check size={18} color="var(--color-success)"/> Your processes</li>
                <li><Check size={18} color="var(--color-success)"/> Connected data</li>
                <li><Check size={18} color="var(--color-success)"/> Scalable architecture</li>
                <li><Check size={18} color="var(--color-success)"/> Designed around your business</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to Build Your ERP?</h2>
          <p>Let's build an ERP around the way your business actually works.</p>
          <div className="cta-actions">
            <Link to="/company-select" className="btn-primary-solid">Build Your ERP <ArrowRight size={16}/></Link>
            <a href="#contact" className="btn-outline-glass">Talk to Our Team <ArrowRight size={16}/></a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '12px' }}>
              <img src="/logo.png" alt="Flex ERP" style={{ height: '36px', objectFit: 'contain' }} />
            </Link>
            <p>Building the future of business operations with intelligent ERP systems.</p>
          </div>
          <div className="footer-links">
            <h4>Solutions</h4>
            <a href="#">Manufacturing</a>
            <a href="#">Procurement</a>
            <a href="#">HR & Payroll</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-links">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 Flex ERP. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
