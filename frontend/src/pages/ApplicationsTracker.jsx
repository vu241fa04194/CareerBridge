import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Video,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  Applied: 'badge-blue',
  'Under Review': 'badge-purple',
  Shortlisted: 'badge-blue',
  'Interview Scheduled': 'badge-amber',
  Selected: 'badge-green',
  Rejected: 'badge-rose',
};

const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

export default function ApplicationsTracker() {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [expandedTimeline, setExpandedTimeline] = useState({});

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/applications/my');
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
  }, []);

  const toggleTimeline = (id) => {
    setExpandedTimeline((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (typeFilter !== 'All' && app.opportunityType !== typeFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
          Application Tracking System (ATS)
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
          My Applications Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Real-time updates on your job and internship applications submitted through CareerBridge.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
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

      {/* Applications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--highlight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading your application history...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No applications found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            You haven't submitted any applications matching this status filter.
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Explore Open Jobs & Internships
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredApplications.map((app) => {
            const opp = app.job || app.internship || {};
            const isJob = app.opportunityType === 'job';
            const isExpanded = !!expandedTimeline[app._id];

            return (
              <div key={app._id} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={
                        opp.companyLogo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(opp.companyName || 'Company')}`
                      }
                      alt={opp.companyName}
                      style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'contain', border: '1px solid var(--border-color)', padding: '3px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span className={`badge ${isJob ? 'badge-blue' : 'badge-purple'}`}>
                          {isJob ? 'Full-Time Job' : 'Internship'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {opp.title || 'Opportunity Title'}
                      </h3>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {opp.companyName}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${statusColors[app.status] || 'badge-gray'}`} style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
                      {app.status}
                    </span>
                    <div style={{ marginTop: '0.5rem' }}>
                      <Link
                        to={isJob ? `/jobs/${opp._id}` : `/internships/${opp._id}`}
                        style={{ fontSize: '0.8rem', color: 'var(--highlight)', fontWeight: 600 }}
                      >
                        View Opportunity Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Interview Scheduled Alert if active */}
                {app.status === 'Interview Scheduled' && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--accent-amber-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid #fde68a', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#b45309', marginBottom: '0.25rem' }}>
                      <Video size={16} /> Interview Round Scheduled!
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                      {app.interviewDate ? (
                        <p>Date & Time: <strong>{new Date(app.interviewDate).toLocaleString()}</strong></p>
                      ) : (
                        <p>Your interview has been scheduled. Check your email for joining instructions.</p>
                      )}
                      {app.interviewLink && (
                        <a
                          href={app.interviewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Video size={14} /> Join Video Interview
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Status Stepper Progression */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '1rem 0' }}>
                  {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'].map((step, idx) => {
                    const stepOrder = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];
                    const currentIdx = stepOrder.indexOf(app.status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = app.status === step;

                    return (
                      <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, position: 'relative' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: isCurrent ? 'var(--highlight)' : isPassed ? '#10b981' : '#e2e8f0',
                            color: isPassed || isCurrent ? '#ffffff' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            marginBottom: '0.35rem',
                          }}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span style={{ fontSize: '0.725rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Audit History Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => toggleTimeline(app._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isExpanded ? 'Hide Status History' : 'View Status History & Notes'}
                  </button>

                  {app.coverLetter && (
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      Cover Letter Attached
                    </span>
                  )}
                </div>

                {/* Expanded Timeline Content */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      Status History Timeline
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {app.statusHistory?.map((hist, hIdx) => (
                        <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.825rem' }}>
                          <span style={{ color: 'var(--text-muted)', minWidth: '130px' }}>
                            {new Date(hist.changedAt).toLocaleString()}
                          </span>
                          <div>
                            <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                              {hist.status}
                            </span>
                            <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
                              {hist.notes}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
