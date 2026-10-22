import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="layout-container">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div 
        className={`sidebar-backdrop ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <div className="main-content">
        <TopBar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} isMobileMenuOpen={mobileMenuOpen} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
