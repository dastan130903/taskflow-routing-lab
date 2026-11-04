import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useItems from '../hooks/useItems.js';
import { createItem } from '../services/service.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
const PAGE_SIZE=6;
const statusOpts=['All','Todo','In progress','Done'];
const priorityOpts=['All','Low','Medium','High'];
const categoryOpts=['All','Development','Design','Testing','Content','Other'];
export default function Items(){
 const {items,loading,error,reload}=useItems();
 const [params,setParams]=useSearchParams();const navigate=useNavigate();
 const [creating,setCreating]=useState(false),[busy,setBusy]=useState(false),[actionError,setActionError]=useState('');
 const search=params.get('q')||'',status=statusOpts.includes(params.get('status'))?params.get('status'):'All',priority=priorityOpts.includes(params.get('priority'))?params.get('priority'):'All',category=categoryOpts.includes(params.get('category'))?params.get('category'):'All',sort=['newest','oldest','name','priority'].includes(params.get('sort'))?params.get('sort'):'newest';
 const pageRequested=Number(params.get('page')||1),page=Number.isSafeInteger(pageRequested)&&pageRequested>0?pageRequested:1;
 function change(key,value){setParams(prev=>{const next=new URLSearchParams(prev);if(!value||value==='All'||(key==='sort'&&value==='newest'))next.delete(key);else next.set(key,String(value));if(key!=='page')next.delete('page');return next;});}
 let filtered=items.filter(x=>(status==='All'||x.status===status)&&(priority==='All'||x.priority===priority)&&(category==='All'||x.category===category)&&x.name.toLowerCase().includes(search.toLowerCase()));
 const priorityWeight={High:3,Medium:2,Low:1};
 filtered=[...filtered].sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='oldest'?a.id-b.id:sort==='priority'?priorityWeight[b.priority]-priorityWeight[a.priority]||b.id-a.id:b.id-a.id);
 const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE)),currentPage=Math.min(page,pages),visible=filtered.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);
 async function create(form){if(busy)return;setBusy(true);setActionError('');try{const item=await createItem(form);setCreating(false);navigate(`/items/${item.id}`,{state:{notice:'Task created successfully.'}});}catch(e){setActionError(e.message);}finally{setBusy(false);}}
 return <><div className="page-heading"><div><div className="eyebrow">WORKSPACE / ALL TASKS</div><h1>Task library<span className="heading-dot">.</span></h1><p>Search, sort and manage your projects.</p></div><button className="button primary" onClick={()=>{setCreating(true);setActionError('');}}>＋ New task</button></div>
 {creating&&<section className="panel form-panel"><div className="panel-head"><h2>Create a task</h2></div>{actionError&&<div className="notice error" role="alert">{actionError}</div>}<TaskForm onSave={create} onCancel={()=>setCreating(false)} submitting={busy}/></section>}
 <section className="panel task-list-panel"><div className="panel-head"><div><h2>Explore tasks</h2><span>Filters stay in the URL so Back, Forward and sharing links work.</span></div><button className="button outline" onClick={reload} disabled={loading}>↻ {loading?'Loading…':'Reload'}</button></div>
 <div className="filters-grid"><label>Search<input aria-label="Search tasks" placeholder="Search task names…" value={search} onChange={e=>change('q',e.target.value)}/></label><label>Status<select value={status} onChange={e=>change('status',e.target.value)}>{statusOpts.map(v=><option key={v}>{v}</option>)}</select></label><label>Priority<select value={priority} onChange={e=>change('priority',e.target.value)}>{priorityOpts.map(v=><option key={v}>{v}</option>)}</select></label><label>Category<select value={category} onChange={e=>change('category',e.target.value)}>{categoryOpts.map(v=><option key={v}>{v}</option>)}</select></label><label>Sort<select value={sort} onChange={e=>change('sort',e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option><option value="priority">Highest priority</option></select></label></div>
 <StatusMessage loading={loading} error={error} retry={reload} empty={!filtered.length}><div className="card-grid">{visible.map(task=><TaskCard key={task.id} task={task}/>)}</div><div className="pagination"><span>Showing {filtered.length?((currentPage-1)*PAGE_SIZE+1):0}–{Math.min(currentPage*PAGE_SIZE,filtered.length)} of {filtered.length} tasks</span><div><button className="button outline" disabled={currentPage<=1} onClick={()=>change('page',currentPage-1)}>← Previous</button><span className="page-count">Page {currentPage} / {pages}</span><button className="button outline" disabled={currentPage>=pages} onClick={()=>change('page',currentPage+1)}>Next →</button></div></div></StatusMessage>
 </section></>;
}
