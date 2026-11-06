import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Briefcase,
  GraduationCap,
  FileText,
  Building2,
  TrendingUp,
  Plus,
  Send,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Broadcast Notification modal
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifData, setNotifData] = useState({
    title: '',
    message: '',
    targetRole: 'all',
    type: 'announcement',
    link: '',
  });
  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentApplications(res.data.recentApplications);
        setRecentStudents(res.data.recentStudents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSendingNotif(true);
    try {
      const res = await API.post('/notifications', notifData);
      if (res.data.success) {
        setNotifSuccess('Notification broadcasted to students successfully!');
        setNotifData({ title: '', message: '', targetRole: 'all', type: 'announcement', link: '' });
        setTimeout(() => {
          setNotifSuccess('');
          setIsNotifModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send notification.');
    } finally {
      setSendingNotif(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading admin statistics...</p>
      </div>
    );
  }

  const {
    totalStudents = 0,
    totalJobs = 0,
    totalInternships = 0,
    totalApplications = 0,
    totalCompanies = 0,
    statusCounts = {},
  } = stats || {};

  return (
    <div>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-purple">
              <ShieldCheck size={14} /> CareerBridge Administration
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Placement Officer & Admin Hub
          </h1>
          <p style={{ color: '#c7d2fe', fontSize: '0.925rem' }}>
            Monitor campus recruiting drives, application pipelines, student registrations, and employer listings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setIsNotifModalOpen(true)} className="btn btn-secondary">
            <Send size={16} /> Broadcast Notification
          </button>
          <Link to="/admin/jobs" className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: '#1e1b4b' }}>
            <Plus size={16} /> Add New Job
          </Link>
        </div>
      </div>

      {/* 5 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--highlight-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="var(--highlight)" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Students</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalStudents}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} color="var(--secondary)" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Jobs</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalJobs}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="#f59e0b" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Internships</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalInternships}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#10b981" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Applications</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalApplications}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} color="var(--primary)" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Companies</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalCompanies}</div>
        </div>
      </div>

      {/* Application Status Distribution Pipeline */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
          Candidate Application Pipeline
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} style={{ padding: '1rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{count}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Recent Applications & Recent Students */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="admin-grid">
        {/* Recent Applications Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Applications
            </h3>
            <Link to="/admin/applications" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--secondary)' }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentApplications.map((app) => (
              <div
                key={app._id}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-alt)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {app.student?.name || 'Student Candidate'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {app.job?.title || app.internship?.title} • {app.job?.companyName || app.internship?.companyName}
                  </div>
                </div>
                <span className="badge badge-blue">{app.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Registered Students */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Recently Joined Students
            </h3>
            <Link to="/admin/students" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--secondary)' }}>
              Manage &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentStudents.map((st) => (
              <div
                key={st._id}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-alt)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <img
                  src={st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}`}
                  alt={st.name}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{st.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{st.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Notification Modal */}
      <Modal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        title="Broadcast Announcement to Students"
      >
        <form onSubmit={handleSendNotification}>
          {notifSuccess && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{notifSuccess}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Google Placement Drive Registrations Open"
              value={notifData.title}
              onChange={(e) => setNotifData({ ...notifData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message Details *</label>
            <textarea
              rows={4}
              className="form-control"
              placeholder="Full announcement content for students..."
              value={notifData.message}
              onChange={(e) => setNotifData({ ...notifData, message: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control form-select"
                value={notifData.type}
                onChange={(e) => setNotifData({ ...notifData, type: e.target.value })}
              >
                <option value="announcement">General Announcement</option>
                <option value="job">New Job Alert</option>
                <option value="internship">Internship Alert</option>
                <option value="event">Campus Event / Webinar</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-control form-select"
                value={notifData.targetRole}
                onChange={(e) => setNotifData({ ...notifData, targetRole: e.target.value })}
              >
                <option value="student">All Students</option>
                <option value="all">Everyone</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Action Link (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="/jobs or /placement-prep/mock-tests"
              value={notifData.link}
              onChange={(e) => setNotifData({ ...notifData, link: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsNotifModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={sendingNotif} className="btn btn-secondary">
              {sendingNotif ? 'Sending Broadcast...' : 'Broadcast to Students'}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
