import { Link } from 'react-router-dom';
export default function TaskCard({task}) {
 return <Link className="task-card" to={`/items/${task.id}`}>
  <div className="task-card-top"><span className="task-card-id">TASK #{task.id}</span><span className={`status ${task.status.toLowerCase().replaceAll(' ','-')}`}>{task.status}</span></div>
  <h3>{task.name}</h3><div className="task-card-foot"><span><i className={`priority ${task.priority.toLowerCase()}`}/>{task.priority} priority</span><span>{task.category}</span><span aria-hidden="true">↗</span></div>
 </Link>;
}
