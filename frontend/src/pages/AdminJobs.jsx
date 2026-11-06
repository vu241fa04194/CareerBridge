import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  MapPin,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    companyLogo: '',
    location: '',
    locationType: 'Hybrid',
    jobType: 'Full-time',
    salaryPackage: '',
    requiredSkills: '',
    eligibilityCriteria: '',
    description: '',
    responsibilities: '',
    applicationDeadline: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/jobs');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenAddModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      companyName: '',
      companyLogo: '',
      location: 'Bengaluru, Karnataka',
      locationType: 'Hybrid',
      jobType: 'Full-time',
      salaryPackage: '₹12 - ₹18 LPA',
      requiredSkills: 'React.js, Node.js, Python, SQL',
      eligibilityCriteria: 'B.Tech / MCA with minimum 7.0 CGPA',
      description: 'Design and develop scalable microservices and user interfaces...',
      responsibilities: 'Write clean code\nConduct peer reviews\nOptimize low-latency APIs',
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo || '',
      location: job.location,
      locationType: job.locationType,
      jobType: job.jobType,
      salaryPackage: job.salaryPackage,
      requiredSkills: job.requiredSkills?.join(', ') || '',
      eligibilityCriteria: job.eligibilityCriteria,
      description: job.description,
      responsibilities: job.responsibilities?.join('\n') || '',
      applicationDeadline: job.applicationDeadline
        ? new Date(job.applicationDeadline).toISOString().split('T')[0]
        : '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingJob) {
        const res = await API.put(`/jobs/${editingJob._id}`, formData);
        if (res.data.success) {
          setJobs((prev) => prev.map((j) => (j._id === editingJob._id ? res.data.job : j)));
        }
      } else {
        const res = await API.post('/jobs', formData);
        if (res.data.success) {
          setJobs((prev) => [res.data.job, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save job posting.');
    } finally {
      setSaving(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
            Job Management
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Manage Full-Time Jobs
          </h1>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} /> Add New Job
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Filter jobs by title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Job Title & Company</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Salary Package</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Deadline</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading jobs...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No jobs found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{job.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.companyName}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {job.location} ({job.locationType})
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--highlight)' }}>
                      {job.salaryPackage}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-purple">{job.jobType}</span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEditModal(job)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          title="Edit Job"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          title="Delete Job"
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

      {/* Add / Edit Job Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Associate Software Engineer (SDE-1)"
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
                placeholder="e.g. Google / Microsoft"
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
                placeholder="Bengaluru, Karnataka"
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
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="form-control form-select"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Salary Package (LPA / Annual) *</label>
              <input
                type="text"
                className="form-control"
                placeholder="₹14 - ₹20 LPA"
                value={formData.salaryPackage}
                onChange={(e) => setFormData({ ...formData, salaryPackage: e.target.value })}
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
              placeholder="React.js, Node.js, Python, SQL, Data Structures"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Eligibility Criteria *</label>
            <input
              type="text"
              className="form-control"
              placeholder="B.Tech in CS/IT or MCA with 7.0+ CGPA. Batch of 2025/2026."
              value={formData.eligibilityCriteria}
              onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Describe the role, tech stack, and company mission..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Responsibilities (One per line)</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Write scalable backend services&#10;Collaborate with cross-functional product teams&#10;Conduct automated code testing"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
