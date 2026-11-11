import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const {
    user,
    loading,
    error,
    clearError,
    firebaseConfigured,
    signup,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
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

  async function handleSignup(event) {
    event.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }
    if (busy) return;

    setBusy(true);
    try {
      await signup(email.trim(), password);
      navigate(destination, { replace: true });
    } catch {
      // Firebase errors are displayed from AuthContext.
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-wrap">
      <div className="auth-box">
        <div className="eyebrow">CREATE ACCOUNT</div>
        <h1>Join Taskflow<span className="heading-dot">.</span></h1>
        <p>Create an account using Firebase Email/Password authentication.</p>

        {!firebaseConfigured && (
          <div className="notice error" role="alert">
            Configure Firebase in .env.local to enable signup.
          </div>
        )}
        {(validationError || error) && (
          <div className="notice error" role="alert">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError();
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
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength="6"
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
            />
          </label>
          <button
            className="button primary auth-submit"
            type="submit"
            disabled={!firebaseConfigured || busy}
          >
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footnote">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <Link to="/">← Return home</Link>
      </div>
    </section>
  );
}
