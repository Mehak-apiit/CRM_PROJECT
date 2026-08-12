import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Trash2, Search, FileText, Eye } from 'lucide-react';

const documentTypes = ['Email', 'pan', 'qualification']; 

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [interns, setInterns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ owner: '', ownerModel: 'Intern', documentType: 'Email' });
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const canManage = ['superAdmin', 'admin'].includes(user.role);

  const fetchData = async () => {
    try {
      const url = canManage ? '/documents' : '/documents/my';
      const requests = [api.get(url)];
      if (canManage) { requests.push(api.get('/interns'), api.get('/employees')); }
      const responses = await Promise.all(requests);
      setDocuments(responses[0].data.documents || []);
      if (responses[1]) setInterns(responses[1].data);
      if (responses[2]) setEmployees(responses[2].data);
    } catch (err) { toast.error('Failed to fetch documents'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [canManage]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('owner', uploadForm.owner);
    formData.append('ownerModel', uploadForm.ownerModel);
    formData.append('documentType', uploadForm.documentType);
    try {
      await api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document uploaded');
      setModalOpen(false); setFile(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document?')) return;
    try { await api.delete(`/documents/${id}`); toast.success('Document deleted'); fetchData(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const filtered = documents.filter(d => {
    const ownerName = d.owner?.name || '';
    const matchSearch = ownerName.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || d.documentType === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Document Vault</h2><p className="page-subtitle">Manage all your business documents</p></div>
        {canManage && <button className="primary-btn" onClick={() => { setModalOpen(true); setFile(null); setUploadForm({ owner: '', ownerModel: 'Intern', documentType: 'aadhaar' }); }}><Plus size={18} /> Upload Document</button>}
      </div>

      <div className="stats-grid mini">
        <div className="stat-card"><div className="stat-info"><h3>{documents.length}</h3><p>Total Documents</p></div></div>
        <div className="stat-card"><div className="stat-info"><h3>{documents.filter(d => d.documentType === 'aadhaar').length}</h3><p>Aadhaar Cards</p></div></div>
        <div className="stat-card"><div className="stat-info"><h3>{documents.filter(d => d.documentType === 'pan').length}</h3><p>PAN Cards</p></div></div>
        <div className="stat-card"><div className="stat-info"><h3>{documents.filter(d => d.documentType === 'qualification').length}</h3><p>Qualifications</p></div></div>
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search by owner name..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {documentTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>

        <div className="document-grid">
          {loading ? <p className="loading">Loading...</p> :
            filtered.length === 0 ? <p className="empty">No documents found</p> :
              filtered.map(doc => (
                <div key={doc._id} className="document-card">
                  <div className="doc-icon"><FileText size={32} /></div>
                  <div className="doc-info">
                    <h4>{doc.documentType?.toUpperCase()}</h4>
                    <p>{doc.owner?.name || 'Unknown'}</p>
                    <small>{doc.owner?.email || 'No email provided'}</small>
                    <small>{doc.ownerModel}</small>
                    <small>{new Date(doc.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="doc-actions">
                    <a href={doc.documentUrl || doc.fileUrl} target="_blank" rel="noopener noreferrer" className="icon-btn"><Eye size={16} /></a>
                    {canManage && <button className="icon-btn danger" onClick={() => handleDelete(doc._id)}><Trash2 size={16} /></button>}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {modalOpen && (
        <Modal title="Upload Document" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleUpload} className="modal-form">
            <label>Owner Type <select value={uploadForm.ownerModel} onChange={e => setUploadForm({ ...uploadForm, ownerModel: e.target.value, owner: '' })}><option value="Intern">Intern</option><option value="Employee">Employee</option></select></label>
            <label>Owner <select required value={uploadForm.owner} onChange={e => setUploadForm({ ...uploadForm, owner: e.target.value })}>
              <option value="">Select {uploadForm.ownerModel}</option>
              {(uploadForm.ownerModel === 'Intern' ? interns : employees).map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
            </select></label>
            <label>Email <input type="email" placeholder='Enter email address' value={uploadForm.email} onChange={e => setUploadForm({ ...uploadForm, email: e.target.value })} /></label>
            <label>File (PDF only) <input type="file" accept="application/pdf" required onChange={e => setFile(e.target.files[0])} /></label>
            <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">Upload</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
