import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getItem, updateItem, deleteItem } from '../services/tasks.js';
import TaskForm from '../components/TaskForm.jsx';
import StatusMessage from '../components/StatusMessage.jsx';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState(location.state?.notice || '');

  const validId = /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));

  useEffect(() => {
    let ignore = false;
    setEditing(false);
    setItem(null);
    setError('');
    setActionError('');
    setMessage('');

    if (!validId) {
      setError('Invalid task ID. Please enter a positive number.');
      setLoading(false);
      return () => { ignore = true; };
    }

    setLoading(true);
    getItem(id)
      .then((data) => {
        if (!ignore) setItem(data);
      })
      .catch((requestError) => {
        if (!ignore) setError(requestError.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    // Protect the page against stale responses when the URL changes quickly.
    return () => { ignore = true; };
  }, [id, version, validId]);

  async function handleSave(form) {
    if (!item || busy) return;
    const targetId = item.id;
    setBusy(true);
    setActionError('');
    setMessage('');

    try {
      const updated = await updateItem(targetId, {
        ...form,
        completed: form.status === 'Done',
      });
      setItem((previous) => previous?.id === targetId ? updated : previous);
      setEditing(false);
      setMessage('Task updated successfully.');
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle() {
    if (!item || busy) return;
    const targetId = item.id;
    const nextCompleted = !item.completed;
    setBusy(true);
    setActionError('');
    setMessage('');

    try {
      const updated = await updateItem(targetId, {
        completed: nextCompleted,
        status: nextCompleted ? 'Done' : 'Todo',
      });
      setItem((previous) => previous?.id === targetId ? updated : previous);
      setMessage(nextCompleted
        ? 'Task completed successfully.'
        : 'Task reopened successfully.');
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!item || busy || !window.confirm(`Delete “${item.name}”?`)) return;
    const targetId = item.id;
    setBusy(true);
    setActionError('');

    try {
      await deleteItem(targetId);
      navigate('/items', { replace: true });
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  const fields = item ? [
    ['Task ID', `#${item.id}`],
    ['Status', item.status],
    ['Priority', item.priority],
    ['Category', item.category],
    ['Assignee', item.assignee],
    ['Due date', item.dueDate || 'Not set'],
    ['Estimate', `${item.estimate} hours`],
    ['Completed', item.completed ? 'Yes' : 'No'],
  ] : [];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE / TASK DETAILS</div>
          <h1>Task overview<span className="heading-dot">.</span></h1>
          <p>Dynamic URL powered by useParams: /items/{id}</p>
        </div>
        <div className="detail-nav">
          <button className="button outline" onClick={() => navigate(-1)}>← Back</button>
          <Link className="button outline" to="/items">All tasks</Link>
        </div>
      </div>

      {message && (
        <div className="notice success" role="status">✓ {message}</div>
      )}
      {actionError && (
        <div className="notice error" role="alert">⚠ {actionError}</div>
      )}

      <section className="panel detail-single">
        <StatusMessage
          loading={loading}
          error={error}
          retry={validId ? () => setVersion((value) => value + 1) : undefined}
        >
          {item && (editing ? (
            <>
              <div className="panel-head"><h2>Edit task #{item.id}</h2></div>
              <TaskForm
                key={item.id}
                initial={item}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
                submitting={busy}
              />
            </>
          ) : (
            <>
              <div className="detail-overline">TASK #{item.id} / {item.category}</div>
              <h2 className="detail-name">{item.name}</h2>
              <p className="detail-description">{item.description}</p>
              <div className="field-grid">
                {fields.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="detail-actions">
                <button
                  className="button primary"
                  onClick={handleToggle}
                  disabled={busy}
                >
                  {busy ? 'Working…' : item.completed ? '↶ Reopen task' : '✓ Mark complete'}
                </button>
                <button
                  className="button outline"
                  onClick={() => setEditing(true)}
                  disabled={busy}
                >
                  Edit
                </button>
                <button className="button danger" onClick={handleDelete} disabled={busy}>
                  Delete
                </button>
              </div>
              <p className="hint">
                Switch rapidly between task URLs to see cleanup protect against stale requests.
              </p>
            </>
          ))}
        </StatusMessage>
      </section>
    </>
  );
}
