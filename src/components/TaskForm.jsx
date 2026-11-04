import { useState } from 'react';
export const EMPTY_FORM={name:'',description:'',status:'Todo',priority:'Medium',category:'Development',assignee:'',dueDate:'',estimate:1};
export default function TaskForm({initial=EMPTY_FORM,onSave,onCancel,submitting=false}) {
 const [form,setForm]=useState({...EMPTY_FORM,...initial});
 const update=e=>setForm(p=>({...p,[e.target.name]:e.target.value}));
 const submit=e=>{e.preventDefault();if(submitting)return;onSave({...form,name:form.name.trim(),description:form.description.trim(),assignee:form.assignee.trim(),estimate:Math.max(1,Number(form.estimate))});};
 return <form className="task-form" onSubmit={submit}>
  <div className="form-grid"><label>Task name<input name="name" value={form.name} onChange={update} required maxLength="120"/></label><label>Assignee<input name="assignee" value={form.assignee} onChange={update} required/></label><label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={update} required/></label><label>Estimate (hours)<input type="number" min="1" name="estimate" value={form.estimate} onChange={update} required/></label></div>
  <div className="form-grid"><label>Status<select name="status" value={form.status} onChange={update}><option>Todo</option><option>In progress</option><option>Done</option></select></label><label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Category<select name="category" value={form.category} onChange={update}><option>Development</option><option>Design</option><option>Testing</option><option>Content</option><option>Other</option></select></label></div>
  <label>Description<textarea name="description" rows="4" value={form.description} onChange={update} required/></label>
  <div className="form-actions"><button type="button" className="button ghost" onClick={onCancel} disabled={submitting}>Cancel</button><button type="submit" className="button primary" disabled={submitting}>{submitting?'Saving…':'Save task'}</button></div>
 </form>;
}
