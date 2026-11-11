import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, logout, error } = useAuth();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    if (busy) return;
    setBusy(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      // Displayed from AuthContext below.
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-wrap">
      <div className="auth-box profile-box">
        <div className="eyebrow">PROTECTED ROUTE / FIREBASE USER</div>
        <h1>Your profile<span className="heading-dot">.</span></h1>
        <p>This page is accessible only to authenticated users.</p>

        {error && <div className="notice error" role="alert">{error}</div>}

        <dl className="profile-fields">
          <div>
            <dt>Email</dt>
            <dd>{user?.email || 'Not available'}</dd>
          </div>
          <div>
            <dt>Firebase UID</dt>
            <dd className="uid">{user?.uid || 'Not available'}</dd>
          </div>
          <div>
            <dt>Provider</dt>
            <dd>
              {user?.providerData?.map((provider) => provider.providerId).join(', ') ||
                'Unknown'}
            </dd>
          </div>
        </dl>

        <button
          className="button primary auth-submit"
          type="button"
          onClick={handleLogout}
          disabled={busy}
        >
          {busy ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    </section>
  );
}
