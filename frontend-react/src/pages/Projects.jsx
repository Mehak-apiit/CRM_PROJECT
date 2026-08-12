import { useState, useEffect } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const emptyProject = { name: '', clientName: '', team: '', status: 'active', deadline: '' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const projRes = await api.get('/projects');
      setProjects(Array.isArray(projRes.data) ? projRes.data : []);
    } catch (err) {
      toast.error('Failed to fetch projects');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyProject }); setModalOpen(true); };
  const openEdit = (proj) => {
    setEditing(proj);
    setForm({
      name: proj.name || '',
      clientName: proj.clientName || '',
      team: proj.team || '',
      status: proj.status || 'active',
      deadline: proj.deadline ? proj.deadline.split('T')[0] : ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/projects/${editing._id}`, form);
        toast.success('Project updated');
      } else {
        await api.post('/projects', form);
        toast.success('Project created');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); toast.success('Project deleted'); fetchData(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const filtered = projects.filter(p =>
    (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
    (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Project Management</h2><p className="page-subtitle">Manage your projects and teams</p></div>
        <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add Project</button>
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Project</th><th>Client</th><th>Team Member</th><th>Status</th><th>Deadline</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="empty">No projects found</td></tr>
              ) : (
                filtered.map(proj => (
                  <tr key={proj._id}>
                    <td className="font-semibold">{proj.name}</td>
                    <td>{proj.clientName}</td>
                    <td>{proj.team || '-'}</td>
                    <td><span className={`badge badge-${proj.status}`}>{proj.status}</span></td>
                    <td>{proj.deadline ? new Date(proj.deadline).toLocaleDateString() : '-'}</td>
                    <td className="actions">
                      <button className="icon-btn" onClick={() => openEdit(proj)}><Pencil size={16} /></button>
                      <button className="icon-btn danger" onClick={() => handleDelete(proj._id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Project' : 'Create Project'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Project Name <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label>Client Name <input required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} /></label>
            <label>Team Member <input value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} placeholder="e.g. Rahul" /></label>
            <label>Deadline <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></label>
            <label>Status <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="completed">Completed</option></select></label>
            <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">{editing ? 'Update' : 'Create'}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
