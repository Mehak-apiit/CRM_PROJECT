import { useState, useEffect } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

const emptyInvoice = { invoiceNumber: '', clientName: '', amount: '', dueDate: '', paymentStatus: 'pending' };
const paymentStatuses = ['paid', 'pending', 'overdue'];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyInvoice);
  const [search, setSearch] = useState('');

  const fetchInvoices = async () => {
    try { const { data } = await api.get('/invoices'); setInvoices(data); }
    catch (err) { toast.error('Failed to fetch invoices'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyInvoice); setModalOpen(true); };
  const openEdit = (inv) => { setEditing(inv); setForm({ ...emptyInvoice, ...inv, amount: inv.amount, dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/invoices/${editing._id}`, { ...form, amount: Number(form.amount) });
        toast.success('Invoice updated');
      } else {
        await api.post('/invoices', { ...form, amount: Number(form.amount) });
        toast.success('Invoice created');
      }
      setModalOpen(false);
      fetchInvoices();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    try { await api.delete(`/invoices/${id}`); toast.success('Invoice deleted'); fetchInvoices(); }
    catch (err) { toast.error('Failed to delete'); }
  };

  const filtered = invoices.filter(i => i.clientName.toLowerCase().includes(search.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(search.toLowerCase()));

  const totalAmount = filtered.reduce((sum, i) => sum + i.amount, 0);
  const paidAmount = filtered.filter(i => i.paymentStatus === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div><h2>Invoice Management</h2><p className="page-subtitle">Manage your invoices and payments</p></div>
        <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add Invoice</button>
      </div>

      <div className="stats-grid mini">
        <div className="stat-card"><div className="stat-info"><h3>{filtered.length}</h3><p>Total Invoices</p></div></div>
        <div className="stat-card"><div className="stat-info"><h3>${totalAmount.toLocaleString()}</h3><p>Total Amount</p></div></div>
        <div className="stat-card"><div className="stat-info"><h3>${paidAmount.toLocaleString()}</h3><p>Paid</p></div></div>
        <div className="stat-card"><div className="stat-info"><h3>${(totalAmount - paidAmount).toLocaleString()}</h3><p>Outstanding</p></div></div>
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box"><Search size={18} /><input type="search" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="loading">Loading...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan="6" className="empty">No invoices found</td></tr> :
                  filtered.map(inv => (
                    <tr key={inv._id}>
                      <td className="font-semibold">{inv.invoiceNumber}</td>
                      <td>{inv.clientName}</td>
                      <td className="font-semibold">${inv.amount.toLocaleString()}</td>
                      <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td><span className={`badge badge-${inv.paymentStatus}`}>{inv.paymentStatus}</span></td>
                      <td className="actions">
                        <button className="icon-btn" onClick={() => openEdit(inv)}><Pencil size={16} /></button>
                        <button className="icon-btn danger" onClick={() => handleDelete(inv._id)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Invoice' : 'Create Invoice'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Invoice Number <input required value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} placeholder="INV-001" /></label>
            <label>Client Name <input required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} /></label>
            <label>Amount ($) <input type="number" required min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></label>
            <label>Due Date <input type="date" required value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></label>
            <label>Payment Status <select value={form.paymentStatus} onChange={e => setForm({ ...form, paymentStatus: e.target.value })}>{paymentStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></label>
            <div className="form-actions"><button type="button" className="ghost-btn" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="primary-btn">{editing ? 'Update' : 'Create'}</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
