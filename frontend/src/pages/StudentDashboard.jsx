import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Bookmark,
  Award,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Bell,
  ArrowRight,
  ExternalLink,
  Sparkles,
  BookOpen,
  FileText,
  User,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import InternshipCard from '../components/InternshipCard';
import Modal from '../components/Modal';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick apply modal state
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/student/dashboard');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleToggleBookmarkJob = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/save`);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmarkInternship = async (internId) => {
    try {
      await API.post(`/internships/${internId}/save`);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyClick = (opp) => {
    setSelectedOpportunity(opp);
    setCoverLetter('');
    setApplySuccess('');
  };

  const handleConfirmApply = async () => {
    if (!selectedOpportunity) return;
    setApplyLoading(true);
    setApplySuccess('');

    try {
      const isJob = !!selectedOpportunity.salaryPackage;
      const url = isJob
        ? `/applications/job/${selectedOpportunity._id}`
        : `/applications/internship/${selectedOpportunity._id}`;

      const res = await API.post(url, { coverLetter });
      if (res.data.success) {
        setApplySuccess('Application submitted successfully!');
        setTimeout(() => {
          setSelectedOpportunity(null);
          fetchDashboard();
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--highlight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your personalized dashboard...</p>
      </div>
    );
  }

  const {
    counts = {},
    profile = {},
    recommendedJobs = [],
    recommendedInternships = [],
    upcomingEvents = [],
    recentNotifications = [],
    skillProgress = {},
  } = dashboardData || {};

  return (
    <div>
      {/* Welcome Hero Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '2rem 2.25rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-blue">
                <Sparkles size={12} /> Student Career Hub
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Batch of {profile.graduationYear || 2026}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.925rem', maxWidth: '600px', lineHeight: 1.5 }}>
              {profile.collegeName ? `${profile.collegeName} • ${profile.degree} ${profile.branch}` : 'Complete your student profile to unlock tailored recommendations!'}
            </p>
          </div>

          {/* Profile Completion Meter */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              minWidth: '240px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#e2e8f0' }}>Profile Completion</span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                {profile.completion || 20}%
              </span>
            </div>
            <div className="progress-container" style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <div
                className="progress-bar"
                style={{ width: `${profile.completion || 20}%` }}
              />
            </div>
            <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
              <Link to="/profile" style={{ fontSize: '0.775rem', color: '#38bdf8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                Complete Profile <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--highlight-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={22} color="var(--highlight)" />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
              {counts.appliedJobs || 0}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Applied Jobs
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} color="var(--secondary)" />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
              {counts.appliedInternships || 0}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Applied Internships
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bookmark size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
              {counts.totalSaved || 0}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Saved Bookmarks
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
              {skillProgress.overallPercentage || 0}%
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Skill Learning Progress
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Jobs & Side Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Left Column: Recommended Jobs */}
        <div>
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Recommended Jobs For You
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Matched based on your skills:{' '}
                {Array.isArray(profile?.skills) && profile.skills.length > 0
                  ? profile.skills.slice(0, 3).join(', ')
                  : typeof profile?.skills === 'string' && profile.skills.trim()
                  ? profile.skills
                  : 'General CS'}
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recommendedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onBookmark={handleToggleBookmarkJob}
                onApply={handleApplyClick}
              />
            ))}
          </div>

          {/* Recommended Internships Section */}
          <div className="flex-between" style={{ marginTop: '2.5rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Recommended Internships
              </h2>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Gain real-world industry experience
              </p>
            </div>
            <Link to="/internships" className="btn btn-outline btn-sm">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recommendedInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                onBookmark={handleToggleBookmarkInternship}
                onApply={handleApplyClick}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Events, Skill Progress, Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Access Actions */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/resume-builder" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
                <FileText size={18} color="var(--highlight)" />
                <span>Build / Edit Resume</span>
              </Link>
              <Link to="/placement-prep/mock-tests" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
                <Award size={18} color="var(--secondary)" />
                <span>Take Mock Placement Test</span>
              </Link>
              <Link to="/skills" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
                <BookOpen size={18} color="#10b981" />
                <span>Continue Skill Course</span>
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Upcoming Events & Drives
              </h3>
              <Calendar size={18} color="var(--highlight)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    padding: '0.85rem',
                    backgroundColor: 'var(--bg-alt)',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--highlight)',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {evt.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{evt.type}</span>
                    <span>{new Date(evt.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Course Learning Track
              </h3>
              <Link to="/skills" style={{ fontSize: '0.8rem', color: 'var(--highlight)', fontWeight: 600 }}>
                View All
              </Link>
            </div>

            {skillProgress.courses && skillProgress.courses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {skillProgress.courses.map((prog) => (
                  <div key={prog._id} style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {prog.course?.title}
                      </span>
                      <span style={{ color: 'var(--secondary)' }}>{prog.progressPercent}%</span>
                    </div>
                    <div className="progress-container" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ width: `${prog.progressPercent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '0.825rem', marginBottom: '0.75rem' }}>
                  You haven't enrolled in any skill development tracks yet.
                </p>
                <Link to="/skills" className="btn btn-outline btn-sm">
                  Enroll in a Course
                </Link>
              </div>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Recent Notifications
              </h3>
              <Bell size={18} color="var(--secondary)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentNotifications.slice(0, 3).map((notif) => (
                <div key={notif._id} style={{ padding: '0.65rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {notif.title}
                  </div>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Apply Modal */}
      <Modal
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        title={`Apply for ${selectedOpportunity?.title}`}
      >
        {selectedOpportunity && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <img
                src={
                  selectedOpportunity.companyLogo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedOpportunity.companyName)}`
                }
                alt={selectedOpportunity.companyName}
                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedOpportunity.companyName}</h4>
                <span className="badge badge-blue">
                  {selectedOpportunity.salaryPackage || selectedOpportunity.stipend}
                </span>
              </div>
            </div>

            {applySuccess ? (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{applySuccess}</span>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Attached Resume</label>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                      <FileText size={16} color="var(--highlight)" />
                      <span>{profile.resumeFileName || 'CareerBridge Interactive Resume'}</span>
                    </div>
                    <Link to="/resume-builder" target="_blank" style={{ fontSize: '0.775rem', color: 'var(--highlight)', fontWeight: 600 }}>
                      Review / Edit
                    </Link>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Note / Introduction (Optional)</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Briefly state why you're a strong fit for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button onClick={() => setSelectedOpportunity(null)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmApply}
                    disabled={applyLoading}
                    className="btn btn-primary"
                  >
                    {applyLoading ? 'Submitting Application...' : 'Confirm & Apply'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Responsive layout styles */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
