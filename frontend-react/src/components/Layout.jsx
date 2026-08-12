import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, ListTodo, FileText, UserCheck, GraduationCap, FolderOpen, Shield, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['superAdmin', 'admin', 'employee', 'intern'] },
  { to: '/leads', icon: Users, label: 'Leads', roles: ['superAdmin', 'admin', 'employee', 'intern'] },
  { to: '/projects', icon: Briefcase, label: 'Projects', roles: ['superAdmin', 'admin'] },
  { to: '/tasks', icon: ListTodo, label: 'Tasks', roles: ['superAdmin', 'admin', 'employee', 'intern'] },
  { to: '/invoices', icon: FileText, label: 'Invoices', roles: ['superAdmin', 'admin'] },
  { to: '/employees', icon: UserCheck, label: 'Employees', roles: ['superAdmin', 'admin'] },
  { to: '/interns', icon: GraduationCap, label: 'Interns', roles: ['superAdmin', 'admin', 'employee', 'intern'] },
  { to: '/documents', icon: FolderOpen, label: 'Documents', roles: ['superAdmin', 'admin', 'employee', 'intern'] },
  { to: '/users', icon: Shield, label: 'Users', roles: ['superAdmin'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const filteredNav = navItems.filter(i => i.roles.includes(user?.role));

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">CRM</div>
          <div>
            <h1>CRM System</h1>
            <p>SunInnovation</p>
          </div>
        </div>
        <nav className="nav-links">
          {filteredNav.map(item => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0)}</div>
            <div>
              <small className="user-name">{user?.name}</small>
              <small className="user-role">{user?.role}</small>
            </div>
          </div>
          <button onClick={handleLogout} className="ghost-btn"><LogOut size={18} /></button>
        </div>
      </aside>
      <main className="main-panel">
        <header className="top-bar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="top-bar-right">
            <span className="role-badge">{user?.role}</span>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
