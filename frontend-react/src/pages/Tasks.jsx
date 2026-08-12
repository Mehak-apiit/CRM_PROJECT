import { useState, useEffect } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const emptyTask = { title: '', assignedTo: '', project: '', status: 'pending', dueDate: '' };
const statuses = ['pending', 'in-progress', 'completed'];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTask);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) { toast.error('Failed to fetch tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyTask }); setModalOpen(true); };
  const openEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title || '',
      assignedTo: task.assignedTo || '',
      project: task.project || '',
      status: task.status || 'pending',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/tasks/${editing._id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', form);
        toast.success('Task created');
      }
      setModalOpen(false);
      fetchTasks();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); toast.success('Task deleted'); fetchTasks(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/tasks/${id}`, { status }); toast.success('Status updated'); fetchTasks(); }
    catch (err) { toast.error('Failed to update status'); }
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Task Management</h2><p className="page-subtitle">Track and manage tasks across projects</p></div>
        <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add Task</button>
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Task</th><th>Project</th><th>Assigned To</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="loading">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan="6" className="empty">No tasks found</td></tr> :
                  filtered.map(task => (
                    <tr key={task._id}>
                      <td className="font-semibold">{task.title}</td>
                      <td>{task.project || '-'}</td>
                      <td>{task.assignedTo || '-'}</td>
                      <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                      <td>
                        <select className={`status-select ${task.status}`} value={task.status} onChange={e => updateStatus(task._id, e.target.value)}>
                          {statuses.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => openEdit(task)}><Pencil size={16} /></button>
                        <button className="icon-btn danger" onClick={() => handleDelete(task._id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Task' : 'Create Task'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Title <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
            <label>Assigned To <input value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="e.g. Rahul" /></label>
            <label>Project <input value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} placeholder="e.g. CRM" /></label>
            <label>Due Date <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></label>
            <label>Status <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{statuses.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}</select></label>
            <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">{editing ? 'Update' : 'Create'}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
