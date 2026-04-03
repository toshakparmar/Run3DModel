import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Box, LogOut, User as UserIcon } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <Box size={24} color="#58a6ff" />
          <span>Run3D Model</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <UserIcon size={18} />
                <span>{user.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline" 
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.9rem' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
