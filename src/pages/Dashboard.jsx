import { useState } from 'react';
import { Link } from 'react-router-dom';
import useItems from '../hooks/useItems.js';
import StatusMessage from '../components/StatusMessage.jsx';

const statuses = ['Todo', 'In progress', 'Done'];
const priorities = ['High', 'Medium', 'Low'];

function Breakdown({ title, data, total }) {
  return (
    <article className="panel breakdown">
      <h2>{title}</h2>
      {data.map(([name, count]) => (
        <div className="bar-line" key={name}>
          <div className="bar-caption">
            <span>{name}</span>
            <strong>{count}</strong>
          </div>
          <div className="bar-track">
            <span style={{ width: `${total ? 100 * count / total : 0}%` }} />
          </div>
        </div>
      ))}
    </article>
  );
}

export default function Dashboard() {
  const { items, loading, error, reload } = useItems();
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(items.map((task) => task.category))];

  const subset = category === 'All'
    ? items
    : items.filter((task) => task.category === category);

  const count = (key, value) => subset.filter((task) => task[key] === value).length;
  const totalHours = subset.reduce((sum, task) => sum + Number(task.estimate || 0), 0);
  const completed = subset.filter((task) => task.completed).length;
  const highPriority = count('priority', 'High');

  const byStatus = statuses.map((status) => [status, count('status', status)]);
  const byPriority = priorities.map((priority) => [priority, count('priority', priority)]);
  const byCategory = [...new Set(subset.map((task) => task.category))]
    .sort()
    .map((name) => [name, count('category', name)]);

  const recentTasks = [...subset].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE / INSIGHTS</div>
          <h1>Dashboard<span className="heading-dot">.</span></h1>
          <p>Statistics calculated from the Fake API — never hardcoded.</p>
        </div>
        <button className="button outline" disabled={loading} onClick={reload}>
          ↻ Reload data
        </button>
      </div>

      <StatusMessage loading={loading} error={error} retry={reload}>
        <div className="dashboard-toolbar">
          <label>
            Filter statistics by category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <Link to="/items">View task library →</Link>
        </div>

        <section className="stats stat-grid">
          <div className="stat">
            <span>Total tasks</span>
            <strong>{subset.length}</strong>
            <small>Visible category</small>
          </div>
          <div className="stat">
            <span>Completed</span>
            <strong>{completed}</strong>
            <small>
              {subset.length ? Math.round(completed * 100 / subset.length) : 0}% completion rate
            </small>
          </div>
          <div className="stat">
            <span>High priority</span>
            <strong>{highPriority}</strong>
            <small>Need attention</small>
          </div>
          <div className="stat">
            <span>Estimated hours</span>
            <strong>{totalHours}h</strong>
            <small>Planned workload</small>
          </div>
        </section>

        <div className="breakdowns">
          <Breakdown title="By status" data={byStatus} total={subset.length} />
          <Breakdown title="By priority" data={byPriority} total={subset.length} />
          <Breakdown title="By category" data={byCategory} total={subset.length} />
        </div>

        <div className="panel recent-panel">
          <div className="panel-head">
            <h2>Recent tasks</h2>
            <Link to="/items">All tasks →</Link>
          </div>
          {recentTasks.length ? (
            <div className="recent-links">
              {recentTasks.map((task) => (
                <Link key={task.id} to={`/items/${task.id}`}>
                  <span>{task.name}</span>
                  <span>{task.status} ↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <p>No tasks in this category.</p>
          )}
        </div>
      </StatusMessage>
    </>
  );
}
