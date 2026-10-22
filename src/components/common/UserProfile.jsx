import React, { useState } from 'react';
import { Camera, Save, User, Shield, Briefcase, MapPin, Mail, Phone } from 'lucide-react';
import { useToastStore } from '../../data/toastStore';

export default function UserProfile() {
  const addToast = useToastStore(state => state.addToast);
  
  const [profile, setProfile] = useState({
    name: 'Totok Michael',
    email: 'tmichael20@mail.com',
    phone: '+1 234 567 8900',
    department: 'Management',
    role: 'System Admin',
    location: 'New York, USA',
    theme: 'Light',
    language: 'English'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}>My Profile</h1>
        <p style={{ color: 'var(--color-text-gray)' }}>Manage your personal information and preferences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Sidebar */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)' }}>
              <Camera size={16} />
            </button>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{profile.name}</h2>
          <p style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '14px', marginBottom: '16px' }}>{profile.role}</p>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-gray)', fontSize: '14px' }}>
              <Briefcase size={16} /> <span>{profile.department}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-gray)', fontSize: '14px' }}>
              <MapPin size={16} /> <span>{profile.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-gray)', fontSize: '14px' }}>
              <Mail size={16} /> <span>{profile.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-gray)', fontSize: '14px' }}>
              <Phone size={16} /> <span>{profile.phone}</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="card" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--color-text-main)' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" className="form-input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" className="form-input" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--color-text-main)' }}>Preferences</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Theme</label>
                  <select className="form-input" value={profile.theme} onChange={e => setProfile({...profile, theme: e.target.value})}>
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                    <option value="System">System Default</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select className="form-input" value={profile.language} onChange={e => setProfile({...profile, language: e.target.value})}>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }}>
                <Save size={18} style={{ marginRight: '8px' }} /> Save Changes
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
