import { useState, useEffect } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Search } from 'lucide-react';

const emptyEmployee = { name: '', email: '', phone: '', department: '', designation: '', joiningDate: '' };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEmployee);
  const [search, setSearch] = useState('');
  const [credentials, setCredentials] = useState(null);

  const fetchData = async () => {
    try {
      const empRes = await api.get('/employees');
      setEmployees(Array.isArray(empRes.data.employees) ? empRes.data.employees : []);
    } catch (err) { toast.error('Failed to fetch employees'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyEmployee }); setCredentials(null); setModalOpen(true); };
  const openEdit = (emp) => { setEditing(emp); setForm({ name: emp.name || '', email: emp.email || '', phone: emp.phone || '', department: emp.department || '', designation: emp.designation || '', joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '' }); setCredentials(null); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/employees/${editing._id}`, form);
        toast.success('Employee updated');
        setModalOpen(false);
      } else {
        const { data } = await api.post('/employees', form);
        toast.success('Employee created');
        if (data.loginCredentials) {
          setCredentials(data.loginCredentials);
        } else {
          setModalOpen(false);
        }
        fetchData();
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Employee Directory</h2><p className="page-subtitle">Manage your team members</p></div>
        <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add Employee</button>
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Employee</th><th>Contact</th><th>Department</th><th>Designation</th><th>Joining Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="loading">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan="6" className="empty">No employees found</td></tr> :
                  filtered.map(emp => (
                    <tr key={emp._id}>
                      <td><div className="user-cell"><span className="avatar-sm">{emp.name?.charAt(0)}</span><div><span className="font-semibold">{emp.name}</span><br /><small>{emp.email}</small></div></div></td>
                      <td>{emp.phone || '-'}</td>
                      <td>{emp.department || '-'}</td>
                      <td>{emp.designation || '-'}</td>
                      <td>{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '-'}</td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => openEdit(emp)}><Pencil size={16} /></button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Employee' : 'Add Employee'} onClose={() => setModalOpen(false)}>
          {credentials ? (
            <div className="modal-form">
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ color: '#16a34a', marginBottom: '12px' }}>Employee Created Successfully!</h4>
                <p style={{ marginBottom: '8px' }}>Login credentials for <strong>{form.name}</strong>:</p>
                <p><strong>Email:</strong> {credentials.email}</p>
                <p><strong>Password:</strong> {credentials.password}</p>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>Share these credentials with the employee to login.</p>
              </div>
              <div className="form-actions"><button type="button" className="primary-btn" onClick={() => setModalOpen(false)}>Done</button></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="modal-form">
              <label>Name <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
              <label>Email <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
              <label>Phone <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
              <label>Department <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="e.g. Engineering" /></label>
              <label>Designation <input value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Senior Developer" /></label>
              <label>Joining Date <input type="date" value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} /></label>
              <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">{editing ? 'Update' : 'Create'}</button></div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
