import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-code">404</span>
      <h1>Page not found<span className="heading-dot">.</span></h1>
      <p>The page you're looking for doesn't exist. Let's get you back on track.</p>
      <Link className="button primary" to="/">← Back to home</Link>
    </div>
  );
}
