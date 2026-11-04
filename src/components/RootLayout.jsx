import { Link, NavLink, Outlet } from 'react-router-dom';
const links = [['/', 'Home'], ['/items', 'Tasks'], ['/dashboard', 'Dashboard'], ['/about', 'About'], ['/login', 'Login']];
export default function RootLayout() {
 return <div className="app-shell">
  <header className="topbar"><Link className="brand" to="/"><span className="brand-icon">◈</span><span>taskflow<span className="brand-dot">.</span></span></Link>
   <nav className="nav-links" aria-label="Primary navigation">{links.map(([to,label])=><NavLink key={to} end={to==='/' } to={to} className={({isActive})=>`nav-link ${isActive?'is-active':''}`}>{label}</NavLink>)}</nav>
   <div className="header-right"><span className="header-caption">ROUTING LAB / WEEK 05</span><span className="avatar">D</span></div></header>
  <main className="page"><Outlet/><footer>Taskflow · React Router · Async Fake API · localStorage</footer></main>
 </div>;
}
