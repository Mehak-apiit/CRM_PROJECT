import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Users, Briefcase, FileText, CheckCircle, Clock, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const requests = [api.get('/leads'), api.get('/tasks')];
        if (['superAdmin', 'admin'].includes(user.role)) {
          requests.push(api.get('/admin/dashboard'));
        }
        const responses = await Promise.all(requests);
        setLeads(Array.isArray(responses[0].data) ? responses[0].data : []);
        const allTasks = Array.isArray(responses[1].data) ? responses[1].data : [];
        setTasks(allTasks);
        if (responses[2]) setStats(responses[2].data);

        if (user.role === 'employee' || user.role === 'intern') {
          setMyTasks(allTasks.filter(t => t.assignedTo === user.name));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user.role, user.name]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const leadStats = { New: 0, 'In-Progress': 0, Converted: 0, Rejected: 0 };
  leads.forEach(l => { leadStats[l.status] = (leadStats[l.status] || 0) + 1; });

  const taskStats = { pending: 0, 'in-progress': 0, completed: 0 };
  tasks.forEach(t => { taskStats[t.status] = (taskStats[t.status] || 0) + 1; });

  const isAdmin = ['superAdmin', 'admin'].includes(user.role);
  const isEmployee = user.role === 'employee';
  const isIntern = user.role === 'intern';

  return (
    <div className="dashboard">
      <h2>Welcome back, {user.name}!</h2>
      <p className="page-subtitle">
        {isAdmin && 'Here\'s what\'s happening in your CRM'}
        {isEmployee && 'Here\'s your work overview'}
        {isIntern && 'Here\'s your intern dashboard'}
      </p>

      <div className="stats-grid">
        {isAdmin && stats && (
          <>
            <div className="stat-card"><div className="stat-icon blue"><Users size={24} /></div><div className="stat-info"><h3>{stats.totalInterns || 0}</h3><p>Interns</p></div></div>
            <div className="stat-card"><div className="stat-icon green"><Briefcase size={24} /></div><div className="stat-info"><h3>{stats.totalEmployees || 0}</h3><p>Employees</p></div></div>
            <div className="stat-card"><div className="stat-icon purple"><FileText size={24} /></div><div className="stat-info"><h3>{stats.totalDocuments || 0}</h3><p>Documents</p></div></div>
            <div className="stat-card"><div className="stat-icon orange"><CheckCircle size={24} /></div><div className="stat-info"><h3>{stats.totalCertificates || 0}</h3><p>Certificates</p></div></div>
          </>
        )}
        <div className="stat-card"><div className="stat-icon blue"><Users size={24} /></div><div className="stat-info"><h3>{leads.length}</h3><p>Total Leads</p></div></div>
        {(isAdmin || isEmployee || isIntern) && (
          <div className="stat-card"><div className="stat-icon orange"><Clock size={24} /></div><div className="stat-info"><h3>{tasks.length}</h3><p>Total Tasks</p></div></div>
        )}
        {(isEmployee || isIntern) && (
          <div className="stat-card"><div className="stat-icon green"><ListTodo size={24} /></div><div className="stat-info"><h3>{myTasks.length}</h3><p>My Tasks</p></div></div>
        )}
      </div>

      <div className="panel-grid">
        <div className="card">
          <div className="card-head"><h3>Lead Funnel</h3></div>
          <div className="funnel-list">
            {Object.entries(leadStats).map(([status, count]) => (
              <div key={status} className="funnel-item">
                <span className="funnel-label">{status}</span>
                <div className="funnel-bar-wrap"><div className="funnel-bar" style={{ width: leads.length ? `${(count / leads.length) * 100}%` : '0%' }} /></div>
                <span className="funnel-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>{(isEmployee || isIntern) ? 'My Tasks' : 'Task Overview'}</h3></div>
          <div className="funnel-list">
            {((isEmployee || isIntern) ? Object.entries(
              myTasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, { pending: 0, 'in-progress': 0, completed: 0 })
            ) : Object.entries(taskStats)).map(([status, count]) => {
              const total = (isEmployee || isIntern) ? myTasks.length : tasks.length;
              return (
                <div key={status} className="funnel-item">
                  <span className="funnel-label">{status.replace('-', ' ')}</span>
                  <div className="funnel-bar-wrap"><div className={`funnel-bar ${status}`} style={{ width: total ? `${(count / total) * 100}%` : '0%' }} /></div>
                  <span className="funnel-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {(isEmployee || isIntern) && myTasks.length > 0 && (
        <div className="card">
          <div className="card-head"><h3>My Assigned Tasks</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Task</th><th>Project</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>
                {myTasks.map(task => (
                  <tr key={task._id}>
                    <td className="font-semibold">{task.title}</td>
                    <td>{task.project || '-'}</td>
                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    <td><span className={`badge badge-${task.status === 'completed' ? 'completed' : task.status === 'in-progress' ? 'inprogress' : 'pending'}`}>{task.status.replace('-', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
