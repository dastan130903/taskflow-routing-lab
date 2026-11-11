import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="content-page">
      <div className="eyebrow">ABOUT THE PROJECT</div>
      <h1>
        One workspace.<br />
        <span className="accent">Better focus.</span>
      </h1>
      <p className="lead">
        Taskflow is a React + Vite task management application. It started as
        an Effects Lab, was extended with React Router, and now includes
        Firebase Authentication and a time-based API cache.
      </p>
      <div className="about-cards">
        <article>
          <span>01</span>
          <h2>Manage tasks</h2>
          <p>
            Create, edit, delete, complete and reopen tasks. Search,
            filter, sort and paginate with URL parameters.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Cached data</h2>
          <p>
            A Promise-based Fake API simulates delays and errors. The service
            layer caches data for 30 seconds and invalidates it after mutations.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Authentication</h2>
          <p>
            Firebase supports email/password accounts, Google sign-in,
            persisted sessions and a protected profile route.
          </p>
        </article>
      </div>
      <Link className="button primary" to="/items">Explore tasks →</Link>
    </section>
  );
}
