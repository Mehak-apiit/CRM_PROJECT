import { useState, useEffect } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, UserPlus } from 'lucide-react';

const emptyLead = { clientName: '', email: '', phone: '', source: '', status: 'New', assignedTo: '', notes: '', score: 0, priority: 'low' };
const statuses = ['New', 'In-Progress', 'Converted', 'Rejected'];
const priorities = ['low', 'medium', 'high'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyLead);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLeads = async () => {
    try {
      const { data } = await api.get('/leads');
      setLeads(data);
    } catch (err) { toast.error('Failed to fetch leads'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/employees');
      setUsers(data.map(e => ({ _id: e._id, name: e.name })));
    } catch {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch { setUsers([]); }
    }
  };

  useEffect(() => { fetchLeads(); fetchUsers(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyLead); setModalOpen(true); };
  const openEdit = (lead) => { setEditing(lead); setForm({ ...emptyLead, ...lead }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/leads/${editing._id}`, form);
        toast.success('Lead updated');
      } else {
        await api.post('/leads', form);
        toast.success('Lead created');
      }
      setModalOpen(false);
      fetchLeads();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try { await api.delete(`/leads/${id}`); toast.success('Lead deleted'); fetchLeads(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const handleAssign = async (id) => {
    const name = prompt('Enter name to assign:');
    if (!name) return;
    try { await api.put(`/leads/${id}/assign`, { assignedTo: name }); toast.success('Lead assigned'); fetchLeads(); }
    catch (err) { toast.error('Failed to assign'); }
  };

  const filtered = leads.filter(l => {
    const matchSearch = l.clientName.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Lead Management</h2><p className="page-subtitle">Track and manage your sales leads</p></div>
        <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add Lead</button>
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Client</th><th>Contact</th><th>Source</th><th>Status</th><th>Priority</th><th>Assigned</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="7" className="loading">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan="7" className="empty">No leads found</td></tr> :
                  filtered.map(lead => (
                    <tr key={lead._id}>
                      <td className="font-semibold">{lead.clientName}</td>
                      <td>{lead.email}<br /><small>{lead.phone}</small></td>
                      <td>{lead.source || '-'}</td>
                      <td><span className={`badge badge-${lead.status.toLowerCase().replace('-', '')}`}>{lead.status}</span></td>
                      <td><span className={`priority-badge ${lead.priority}`}>{lead.priority}</span></td>
                      <td>{lead.assignedTo || <span style={{color:'#94a3b8'}}>-</span>}</td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => openEdit(lead)} title="Edit"><Pencil size={16} /></button>
                        <button className="icon-btn danger" onClick={() => handleDelete(lead._id)} title="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Lead' : 'Create Lead'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Client Name <input required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} /></label>
            <label>Email <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
            <label>Phone <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Source <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="e.g. Website, Referral" /></label>
            <label>Status <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
            <label>Priority <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>{priorities.map(p => <option key={p} value={p}>{p}</option>)}</select></label>
            <label>Assigned To <input value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} placeholder="e.g. Rahul" /></label>
            <label>Score <input type="number" value={form.score} onChange={e => setForm({ ...form, score: Number(e.target.value) })} /></label>
            <label>Notes <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></label>
            <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">{editing ? 'Update' : 'Create'}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
