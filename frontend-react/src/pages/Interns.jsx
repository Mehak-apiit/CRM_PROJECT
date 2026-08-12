import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, Award, Download } from 'lucide-react';

const emptyIntern = { name: '', email: '', phone: '', highestQualification: '', college: '', graduationYear: '', department: '', techStack: [], internshipStatus: 'Ongoing' };
const statuses = ['Ongoing', 'Completed', 'Dropped'];

export default function Interns() {
  const { user } = useAuth();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyIntern);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [certModal, setCertModal] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [techInput, setTechInput] = useState('');

  const fetchInterns = async () => {
    try { const { data } = await api.get('/interns'); setInterns(data); }
    catch (err) { toast.error('Failed to fetch interns'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInterns(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyIntern); setModalOpen(true); };
  const openEdit = (intern) => { setEditing(intern); setForm({ ...emptyIntern, ...intern, techStack: intern.techStack || [] }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/interns/${editing._id}`, form);
        toast.success('Intern updated');
      } else {
        await api.post('/interns', form);
        toast.success('Intern created');
      }
      setModalOpen(false);
      fetchInterns();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this intern?')) return;
    try { await api.delete(`/interns/${id}`); toast.success('Intern deleted'); fetchInterns(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const updateStatus = async (id, internshipStatus) => {
    try { await api.patch(`/interns/${id}/status`, { internshipStatus }); toast.success('Status updated'); fetchInterns(); }
    catch (err) { toast.error('Failed to update status'); }
  };

  const handleCertUpload = async () => {
    if (!certFile) return;
    const formData = new FormData();
    formData.append('certificate', certFile);
    try { await api.patch(`/interns/${certModal._id}/certificate`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Certificate uploaded'); setCertModal(null); fetchInterns(); }
    catch (err) { toast.error('Failed to upload certificate'); }
  };

  const downloadCert = async (internId) => {
    try {
      const res = await api.get(`/interns/my-certificate/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', 'certificate.pdf'); document.body.appendChild(link); link.click(); link.remove();
    } catch (err) { toast.error('Failed to download certificate'); }
  };

  const addTech = () => {
    if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
      setForm({ ...form, techStack: [...form.techStack, techInput.trim()] });
      setTechInput('');
    }
  };

  const filtered = interns.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.internshipStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Intern Management</h2><p className="page-subtitle">Track intern onboarding, progress, and status</p></div>
        {['superAdmin', 'admin'].includes(user.role) && (
          <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add Intern</button>
        )}
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search interns..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Intern</th><th>Contact</th><th>Tech Stack</th><th>College</th><th>Status</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="7" className="loading">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan="7" className="empty">No interns found</td></tr> :
                  filtered.map(intern => (
                    <tr key={intern._id}>
                      <td><div className="user-cell"><span className="avatar-sm">{intern.name?.charAt(0)}</span><div><span className="font-semibold">{intern.name}</span><br /><small>{intern.email}</small></div></div></td>
                      <td>{intern.phone || '-'}</td>
                      <td><div className="tech-stack">{intern.techStack?.map(t => <span key={t} className="tech-tag">{t}</span>)}</div></td>
                      <td><small>{intern.college || '-'}</small></td>
                      <td>
                        {['superAdmin', 'admin'].includes(user.role) ? (
                          <select className={`status-select ${intern.internshipStatus?.toLowerCase()}`} value={intern.internshipStatus} onChange={e => updateStatus(intern._id, e.target.value)}>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : <span className={`badge badge-${intern.internshipStatus?.toLowerCase()}`}>{intern.internshipStatus}</span>}
                      </td>
                      <td className="actions">
                        {['superAdmin', 'admin'].includes(user.role) && (
                          <>
                            <button className="icon-btn" onClick={() => openEdit(intern)}><Pencil size={16} /></button>
                            <button className="icon-btn danger" onClick={() => handleDelete(intern._id)}><Trash2 size={16} /></button>
                          </>
                        )}
                        {intern.certificateIssued && user.role === 'intern' && (
                          <button className="icon-btn" onClick={() => downloadCert(intern._id)}><Download size={16} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Intern' : 'Add Intern'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Name <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label>Email <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
            <label>Phone <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Highest Qualification <input value={form.highestQualification} onChange={e => setForm({ ...form, highestQualification: e.target.value })} placeholder="e.g. B.Tech" /></label>
            <label>College <input value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} /></label>
            <label>Graduation Year <input type="number" min="2000" max="2030" value={form.graduationYear} onChange={e => setForm({ ...form, graduationYear: e.target.value })} /></label>
            <label>Department <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></label>
            <label>Tech Stack <input value={form.techStack?.join(', ') || ''} onChange={e => setForm({ ...form, techStack: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} placeholder="e.g. React, Node.js, MongoDB" /></label>
            <label>Status <select value={form.internshipStatus} onChange={e => setForm({ ...form, internshipStatus: e.target.value })}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
            <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">{editing ? 'Update' : 'Create'}</button></div>
          </form>
        </Modal>
      )}

      {certModal && (
        <Modal title="Upload Certificate" onClose={() => setCertModal(null)}>
          <div className="modal-form">
            <p>Upload certificate PDF for <strong>{certModal.name}</strong></p>
            <input type="file" accept="application/pdf" onChange={e => setCertFile(e.target.files[0])} />
            <div className="form-actions">
              <button className="ghost-btn" onClick={() => setCertModal(null)}>Cancel</button>
              <button className="primary-btn" disabled={!certFile} onClick={handleCertUpload}>Upload</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
