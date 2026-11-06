import React, { useState, useEffect } from 'react';
import {
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Video,
  User,
  ExternalLink,
  Edit2,
  AlertCircle,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';

const statuses = [
  'All',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Selected',
  'Rejected',
];

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Status Change Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Applied');
  const [statusNotes, setStatusNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLink, setInterviewLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (typeFilter !== 'All') params.append('type', typeFilter);

      const res = await API.get(`/applications?${params.toString()}`);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, typeFilter]);

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusNotes('');
    setInterviewDate(app.interviewDate ? new Date(app.interviewDate).toISOString().slice(0, 16) : '');
    setInterviewLink(app.interviewLink || '');
    setSuccessMsg('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSaving(true);
    try {
      const res = await API.put(`/applications/${selectedApp._id}/status`, {
        status: newStatus,
        notes: statusNotes,
        interviewDate: newStatus === 'Interview Scheduled' && interviewDate ? new Date(interviewDate).toISOString() : null,
        interviewLink: newStatus === 'Interview Scheduled' ? interviewLink : '',
      });

      if (res.data.success) {
        setSuccessMsg(`Status updated to ${newStatus} and notification sent to student!`);
        setApplications((prev) =>
          prev.map((a) => (a._id === selectedApp._id ? res.data.application : a))
        );
        setTimeout(() => {
          setSelectedApp(null);
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
          Recruitment Pipeline
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
          Review Student Applications
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Review student submissions, shortlist profiles, schedule video interviews, and update candidate stages.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-secondary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}
            >
              {st}
            </button>
          ))}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="form-control form-select"
          style={{ width: 'auto', fontSize: '0.825rem', marginLeft: 'auto' }}
        >
          <option value="All">All Types</option>
          <option value="job">Jobs Only</option>
          <option value="internship">Internships Only</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Applicant Name & Contact</th>
                <th style={{ padding: '1rem' }}>Applied Position</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Applied On</th>
                <th style={{ padding: '1rem' }}>Current Status</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Manage Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading applicant records...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No applications found matching these filters.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const opp = app.job || app.internship || {};
                  const isJob = app.opportunityType === 'job';

                  return (
                    <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {app.student?.name || 'Student Candidate'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {app.student?.email} • {app.student?.phone || 'No phone'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{opp.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opp.companyName}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${isJob ? 'badge-blue' : 'badge-purple'}`}>
                          {isJob ? 'Job' : 'Internship'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className="badge badge-blue">{app.status}</span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenStatusModal(app)}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Edit2 size={13} /> Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Change Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Update Candidate Stage & Notification"
      >
        {selectedApp && (
          <form onSubmit={handleUpdateStatus}>
            {successMsg && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{successMsg}</span>
              </div>
            )}

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedApp.student?.name}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Applied for: <strong>{selectedApp.job?.title || selectedApp.internship?.title}</strong> at{' '}
                {selectedApp.job?.companyName || selectedApp.internship?.companyName}
              </div>
              {selectedApp.coverLetter && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.825rem', color: '#475569', fontStyle: 'italic' }}>
                  "{selectedApp.coverLetter}"
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Select New Candidate Status *</label>
              <select
                className="form-control form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
              >
                <option value="Applied">Applied (Initial Registration)</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted for Rounds</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Selected">Selected / Offered PPO</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {newStatus === 'Interview Scheduled' && (
              <div style={{ padding: '1rem', backgroundColor: 'var(--highlight-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--highlight-border)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Video size={16} /> Interview Scheduling Details
                </div>
                <div className="form-group">
                  <label className="form-label">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required={newStatus === 'Interview Scheduled'}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Google Meet / Zoom Video Link</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={interviewLink}
                    onChange={(e) => setInterviewLink(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Feedback / Notes for Candidate</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="Notes visible to student regarding rounds, preparation tips, or instructions..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setSelectedApp(null)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Updating...' : 'Save & Notify Student'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
