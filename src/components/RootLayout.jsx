import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  ['/', 'Home'],
  ['/items', 'Tasks'],
  ['/dashboard', 'Dashboard'],
  ['/about', 'About'],
];

export default function RootLayout() {
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      // Authentication errors remain available through AuthContext.
      console.error('Logout failed:', error);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-icon">◈</span>
          <span>taskflow<span className="brand-dot">.</span></span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              end={to === '/'}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'is-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          {!loading && (user ? (
            <>
              <NavLink to="/profile" className="nav-link">Profile</NavLink>
              <button className="nav-link nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/signup" className="nav-link">Sign up</NavLink>
            </>
          ))}
        </nav>

        <div className="header-right">
          <span className="header-caption">AUTH + CACHE / WEEK 06</span>
          <span className="avatar">{user?.email?.[0]?.toUpperCase() || 'T'}</span>
        </div>
      </header>

      <main className="page">
        <Outlet />
        <footer>Taskflow · React Router · Firebase Auth · Cached Fake API</footer>
      </main>
    </div>
  );
}
