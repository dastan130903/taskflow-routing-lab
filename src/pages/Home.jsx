import { Link } from 'react-router-dom';
import hero from '../assets/taskflow-hero.svg';

export default function Home() {
  return (
    <>
      <div className="eyebrow">YOUR PRODUCTIVITY WORKSPACE</div>
      <section className="hero">
        <div className="hero-copy">
          <span className="mini-label">FIREBASE AUTH / TASKFLOW 3.0</span>
          <h1>
            Plan your work.<br />
            <span>Get it done.</span>
          </h1>
          <p>
            A focused task manager with realistic asynchronous requests,
            smart filters, server-data caching and Firebase authentication.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/items">Explore tasks ↗</Link>
            <Link className="button outline" to="/dashboard">View dashboard</Link>
          </div>
          <div className="hero-points">
            <span>◉ Cached Fake API</span>
            <span>◉ Firebase Auth</span>
            <span>◉ Smart navigation</span>
          </div>
        </div>
        <img
          className="hero-image"
          src={hero}
          alt="Illustration of task cards and a productivity dashboard"
        />
      </section>

      <section className="feature-grid">
        <article className="feature-tile">
          <span>01 / ORGANIZE</span>
          <h2>Manage tasks</h2>
          <p>Create, edit, complete and remove work from one streamlined list.</p>
          <Link to="/items">Browse all tasks →</Link>
        </article>
        <article className="feature-tile">
          <span>02 / UNDERSTAND</span>
          <h2>Track progress</h2>
          <p>See status and category breakdowns calculated from your actual task data.</p>
          <Link to="/dashboard">Open dashboard →</Link>
        </article>
        <article className="feature-tile">
          <span>03 / ACCESS</span>
          <h2>Firebase sign-in</h2>
          <p>Sign up with email or Google and access your protected profile.</p>
          <Link to="/signup">Create account →</Link>
        </article>
      </section>
    </>
  );
}
