import { Link } from 'react-router-dom';

export default function TaskCard({ task }) {
  return (
    <Link className="task-card" to={`/items/${task.id}`}>
      <div className="task-card-top">
        <span className="task-card-id">TASK #{task.id}</span>
        <span className={`pill ${task.status === 'Done' ? 'done' : ''}`}>
          {task.status}
        </span>
      </div>
      <h3>{task.name}</h3>
      <div className="task-card-foot">
        <span>{task.category}</span>
        <span>{task.priority} priority</span>
      </div>
    </Link>
  );
}
