import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useItems from '../hooks/useItems.js';
import { createItem } from '../services/tasks.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import StatusMessage from '../components/StatusMessage.jsx';

const PAGE_SIZE = 6;
const statusOptions = ['All', 'Todo', 'In progress', 'Done'];
const priorityOptions = ['All', 'Low', 'Medium', 'High'];
const categoryOptions = ['All', 'Development', 'Design', 'Testing', 'Content', 'Other'];
const sortOptions = ['newest', 'oldest', 'name', 'priority'];
const priorityWeight = { High: 3, Medium: 2, Low: 1 };

export default function Items() {
  const { items, loading, error, reload } = useItems();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  // These values come from the URL, so Back / Forward and shared links work.
  const search = params.get('q') || '';
  const status = statusOptions.includes(params.get('status'))
    ? params.get('status')
    : 'All';
  const priority = priorityOptions.includes(params.get('priority'))
    ? params.get('priority')
    : 'All';
  const category = categoryOptions.includes(params.get('category'))
    ? params.get('category')
    : 'All';
  const sort = sortOptions.includes(params.get('sort'))
    ? params.get('sort')
    : 'newest';

  const requestedPage = Number(params.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;

  function change(key, value) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);

      if (!value || value === 'All' || (key === 'sort' && value === 'newest')) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }

      // A new filter should start again at page 1.
      if (key !== 'page') {
        next.delete('page');
      }
      return next;
    });
  }

  const filteredItems = items.filter((task) => (
    (status === 'All' || task.status === status) &&
    (priority === 'All' || task.priority === priority) &&
    (category === 'All' || task.category === category) &&
    task.name.toLowerCase().includes(search.toLowerCase())
  ));

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'oldest') return a.id - b.id;
    if (sort === 'priority') {
      return priorityWeight[b.priority] - priorityWeight[a.priority] || b.id - a.id;
    }
    return b.id - a.id;
  });

  const pageCount = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleItems = sortedItems.slice(start, start + PAGE_SIZE);

  async function handleCreate(form) {
    if (busy) return;
    setBusy(true);
    setActionError('');

    try {
      const task = await createItem(form);
      setCreating(false);
      navigate(`/items/${task.id}`, {
        state: { notice: 'Task created successfully.' },
      });
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE / ALL TASKS</div>
          <h1>Task library<span className="heading-dot">.</span></h1>
          <p>Search, sort and manage your projects.</p>
        </div>
        <button
          className="button primary"
          onClick={() => {
            setCreating(true);
            setActionError('');
          }}
        >
          ＋ New task
        </button>
      </div>

      {creating && (
        <section className="panel form-panel">
          <div className="panel-head"><h2>Create a task</h2></div>
          {actionError && <div className="notice error" role="alert">{actionError}</div>}
          <TaskForm
            onSave={handleCreate}
            onCancel={() => setCreating(false)}
            submitting={busy}
          />
        </section>
      )}

      <section className="panel task-list-panel">
        <div className="panel-head">
          <div>
            <h2>Explore tasks</h2>
            <span>Filters stay in the URL so Back, Forward and sharing links work.</span>
          </div>
          <button className="button outline" onClick={reload} disabled={loading}>
            ↻ {loading ? 'Loading…' : 'Reload'}
          </button>
        </div>

        <div className="filters-grid">
          <label>
            Search
            <input
              aria-label="Search tasks"
              placeholder="Search task names…"
              value={search}
              onChange={(event) => change('q', event.target.value)}
            />
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => change('status', event.target.value)}>
              {statusOptions.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Priority
            <select value={priority} onChange={(event) => change('priority', event.target.value)}>
              {priorityOptions.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Category
            <select value={category} onChange={(event) => change('category', event.target.value)}>
              {categoryOptions.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>
            Sort
            <select value={sort} onChange={(event) => change('sort', event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
              <option value="priority">Highest priority</option>
            </select>
          </label>
        </div>

        <StatusMessage
          loading={loading}
          error={error}
          retry={reload}
          empty={!sortedItems.length}
        >
          <div className="card-grid">
            {visibleItems.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
          <div className="pagination">
            <span>
              Showing {sortedItems.length ? start + 1 : 0}–
              {Math.min(start + PAGE_SIZE, sortedItems.length)} of {sortedItems.length} tasks
            </span>
            <div>
              <button
                className="button outline"
                disabled={currentPage <= 1}
                onClick={() => change('page', currentPage - 1)}
              >
                ← Previous
              </button>
              <span className="page-count">Page {currentPage} / {pageCount}</span>
              <button
                className="button outline"
                disabled={currentPage >= pageCount}
                onClick={() => change('page', currentPage + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </StatusMessage>
      </section>
    </>
  );
}
