import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const {
    user,
    loading,
    error,
    clearError,
    firebaseConfigured,
    login,
    loginWithGoogle,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/profile';

  if (loading) {
    return <div className="route-loader" role="status">Checking your session…</div>;
  }

  if (user) {
    return <Navigate to={destination} replace />;
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(destination, { replace: true });
    } catch {
      // AuthContext exposes the Firebase error to the user.
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    if (busy) return;
    setBusy(true);
    try {
      await loginWithGoogle();
      navigate(destination, { replace: true });
    } catch {
      // AuthContext exposes the Firebase error to the user.
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-wrap">
      <div className="auth-box">
        <div className="eyebrow">FIREBASE AUTHENTICATION</div>
        <h1>Welcome back<span className="heading-dot">.</span></h1>
        <p>Sign in with your email and password or your Google account.</p>

        {!firebaseConfigured && (
          <div className="notice error" role="alert">
            Firebase setup is required. Copy .env.example to .env.local,
            enter your Firebase Web App values, and restart Vite.
          </div>
        )}
        {error && <div className="notice error" role="alert">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) clearError();
              }}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            className="button primary auth-submit"
            type="submit"
            disabled={!firebaseConfigured || busy}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider">or</div>
        <button
          className="button outline auth-submit"
          type="button"
          onClick={handleGoogleLogin}
          disabled={!firebaseConfigured || busy}
        >
          Continue with Google
        </button>

        <p className="auth-footnote">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
        <Link to="/">← Return home</Link>
      </div>
    </section>
  );
}
