import { useState, useEffect } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Shield } from 'lucide-react';

const emptyUser = { name: '', email: '', password: '', role: 'admin', status: 'Active' };
const roles = ['superAdmin', 'admin', 'employee', 'intern'];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyUser);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try { const { data } = await api.get('/users'); setUsers(data); }
    catch (err) { toast.error('Failed to fetch users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyUser); setModalOpen(true); };
  const openEdit = (u) => { setEditing(u); setForm({ name: u.name, email: u.email, password: '', role: u.role, status: u.status }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (editing) {
        await api.put(`/users/${editing._id}`, payload);
        toast.success('User updated');
      } else {
        await api.post('/users', payload);
        toast.success('User created');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await api.delete(`/users/${id}`); toast.success('User deleted'); fetchUsers(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const roleCounts = {};
  users.forEach(u => { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1; });

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>User Management</h2><p className="page-subtitle">Super Admin Panel - Manage system users and their access</p></div>
        <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add User</button>
      </div>

      <div className="stats-grid mini">
        <div className="stat-card"><div className="stat-icon blue"><Shield size={24} /></div><div className="stat-info"><h3>{users.length}</h3><p>Total Users</p></div></div>
        {roles.map(r => roleCounts[r] && (
          <div key={r} className="stat-card"><div className="stat-info"><h3>{roleCounts[r]}</h3><p>{r.charAt(0).toUpperCase() + r.slice(1)}</p></div></div>
        ))}
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="loading">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan="5" className="empty">No users found</td></tr> :
                  filtered.map(u => (
                    <tr key={u._id}>
                      <td><div className="user-cell"><span className="avatar-sm">{u.name?.charAt(0)}</span><div><span className="font-semibold">{u.name}</span><br /><small>{u.email}</small></div></div></td>
                      <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                      <td><span className={`badge badge-${u.status?.toLowerCase()}`}>{u.status}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => openEdit(u)}><Pencil size={16} /></button>
                        <button className="icon-btn danger" onClick={() => handleDelete(u._id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit User' : 'Create User'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Name <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
            <label>Password <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editing ? 'Leave blank to keep current' : 'Default: admin123'} /></label>
            <label>Role <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}</select></label>
            <label>Status <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
            <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">{editing ? 'Update' : 'Create'}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
