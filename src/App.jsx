import React, { useState } from 'react';
import './App.css'; 
import { Layout, CheckSquare, Link as LinkIcon, Settings, LogOut, FileText } from 'lucide-react';

const API_URL = 'http://localhost:5001/api';

const api = {
  login: (email, password) => fetch(`${API_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(res => { if(!res.ok) throw new Error('Login failed'); return res.json(); }),
  register: (email, password) => fetch(`${API_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(res => { if(!res.ok) throw new Error('Failed'); return res.json(); }),
};

// --- Components ---
const TitleBar = () => (
  <div className="title-bar">
    <span className="app-title"></span>
  </div>
);

const Sidebar = ({ onLogout, user }) => {
  const menuItems = [ { id: 'board', label: 'Board', icon: Layout }, { id: 'todo', label: 'To-Do', icon: CheckSquare }, { id: 'links', label: 'Links', icon: LinkIcon } ];
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box"><FileText size={24} /></div>
        <div><h1 className="app-name">Organizer</h1><p className="user-email">{user ? user.email : 'Guest User'}</p></div>
      </div>
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <button key={item.id} disabled={true} className="nav-item">
            <item.icon size={20} /> {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button disabled={true} className="nav-item"><Settings size={20} /> Settings</button>
        {user && <button onClick={onLogout} className="nav-item logout-btn"><LogOut size={20} /> Log out</button>}
      </div>
    </div>
  );
};

const AuthScreen = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = isLoginView ? await api.login(email, password) : await api.register(email, password);
      onLogin(user);
    } catch (err) { alert("Authentication failed. Ensure server is running."); }
    setLoading(false);
  };

  return (
    <div className="content-area">
      <div className="auth-header">
        <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
        <p>{isLoginView ? 'Log in to start planning' : 'Create an account to get started'}</p>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon"><div className="logo-box"><FileText size={24} /></div></div>
          <h2 className="auth-title">{isLoginView ? 'Welcome back' : 'Create an account'}</h2>
          <p className="auth-subtitle">{isLoginView ? 'Sign in to access your personal workspace' : 'Enter your details to sign up'}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="Enter your password" required />
            </div>
            <button type="submit" disabled={loading} className="primary-btn">{loading ? 'Processing...' : (isLoginView ? 'Sign in' : 'Sign up')}</button>
          </form>
          <button onClick={() => setIsLoginView(!isLoginView)} className="toggle-btn">{isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <div className="app-container">
      <TitleBar />
      <div className="main-layout">
        <Sidebar onLogout={()=>setUser(null)} user={user} />
        <main className="content-area">
            {!user ? <AuthScreen onLogin={setUser} /> : (
                <div className="dashboard-welcome">
                    <div className="welcome-card">
                        <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '8px'}}>Welcome, {user.email}!</h2>
                        <p style={{color: '#6b7280'}}>You have successfully logged in.</p>
                    </div>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
