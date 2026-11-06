import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  Clock,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';

export default function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    companyLogo: '',
    location: '',
    locationType: 'Remote',
    duration: '3 Months',
    stipend: '₹35,000 / month',
    requiredSkills: '',
    eligibility: '',
    description: '',
    responsibilities: '',
    applicationDeadline: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await API.get('/internships');
      if (res.data.success) {
        setInternships(res.data.internships);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleOpenAddModal = () => {
    setEditingInternship(null);
    setFormData({
      title: '',
      companyName: '',
      companyLogo: '',
      location: 'Bengaluru / Remote',
      locationType: 'Remote',
      duration: '3 Months',
      stipend: '₹40,000 / month',
      requiredSkills: 'React.js, JavaScript, Python',
      eligibility: 'Pre-final year (3rd year) students with 7.0+ CGPA',
      description: 'Join as an engineering intern working on production features...',
      responsibilities: 'Write component code\nParticipate in sprint standups\nFix bugs',
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingInternship(item);
    setFormData({
      title: item.title,
      companyName: item.companyName,
      companyLogo: item.companyLogo || '',
      location: item.location,
      locationType: item.locationType,
      duration: item.duration,
      stipend: item.stipend,
      requiredSkills: item.requiredSkills?.join(', ') || '',
      eligibility: item.eligibility,
      description: item.description,
      responsibilities: item.responsibilities?.join('\n') || '',
      applicationDeadline: item.applicationDeadline
        ? new Date(item.applicationDeadline).toISOString().split('T')[0]
        : '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteInternship = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship posting?')) return;
    try {
      await API.delete(`/internships/${id}`);
      setInternships((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete internship.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingInternship) {
        const res = await API.put(`/internships/${editingInternship._id}`, formData);
        if (res.data.success) {
          setInternships((prev) =>
            prev.map((i) => (i._id === editingInternship._id ? res.data.internship : i))
          );
        }
      } else {
        const res = await API.post('/internships', formData);
        if (res.data.success) {
          setInternships((prev) => [res.data.internship, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save internship.');
    } finally {
      setSaving(false);
    }
  };

  const filteredInternships = internships.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
            Internship Management
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Manage Internships
          </h1>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-secondary">
          <Plus size={16} /> Add New Internship
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Filter internships by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Internships Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Internship Title & Company</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Duration</th>
                <th style={{ padding: '1rem' }}>Stipend</th>
                <th style={{ padding: '1rem' }}>Deadline</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading internships...
                  </td>
                </tr>
              ) : filteredInternships.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No internships found.
                  </td>
                </tr>
              ) : (
                filteredInternships.map((intern) => (
                  <tr key={intern._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{intern.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{intern.companyName}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {intern.location} ({intern.locationType})
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-blue">{intern.duration}</span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                      {intern.stipend}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      {intern.applicationDeadline ? new Date(intern.applicationDeadline).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEditModal(intern)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          title="Edit Internship"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteInternship(intern._id)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          title="Delete Internship"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Internship Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInternship ? 'Edit Internship Posting' : 'Create New Internship'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Internship Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Software Engineering Summer Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Google / Razorpay"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Bengaluru / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Workplace Mode</label>
              <select
                className="form-control form-select"
                value={formData.locationType}
                onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration *</label>
              <input
                type="text"
                className="form-control"
                placeholder="3 Months"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Monthly Stipend *</label>
              <input
                type="text"
                className="form-control"
                placeholder="₹40,000 / month"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline *</label>
              <input
                type="date"
                className="form-control"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (Comma-separated)</label>
            <input
              type="text"
              className="form-control"
              placeholder="React.js, JavaScript, Python"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Eligibility Criteria *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enrolled in B.Tech / MCA batch of 2026/2027"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Overview of the internship project and mentorship..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-secondary">
              {saving ? 'Saving...' : editingInternship ? 'Update Internship' : 'Create Internship'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
