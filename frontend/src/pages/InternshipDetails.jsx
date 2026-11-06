import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Bookmark,
  CheckCircle2,
  Building2,
  ArrowLeft,
  AlertCircle,
  FileText,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export default function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  const fetchInternship = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/internships/${id}`);
      if (res.data.success) {
        setInternship(res.data.internship);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Internship opportunity not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please log in as a student to bookmark.');
      return;
    }
    try {
      const res = await API.post(`/internships/${id}/save`);
      setInternship((prev) => ({ ...prev, isSaved: res.data.isSaved }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmApply = async () => {
    setApplyLoading(true);
    try {
      const res = await API.post(`/applications/internship/${id}`, { coverLetter });
      if (res.data.success) {
        setApplySuccess('Application submitted successfully!');
        setInternship((prev) => ({ ...prev, isApplied: true }));
        setTimeout(() => setIsApplyModalOpen(false), 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading internship details...</p>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={18} />
          <span>{error || 'Internship not found'}</span>
        </div>
        <Link to="/internships" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Internship Listings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container container-narrow">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/internships"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to All Internships
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <img
                src={
                  internship.companyLogo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(internship.companyName)}&background=1e3a8a&color=38bdf8`
                }
                alt={internship.companyName}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  objectFit: 'contain',
                  border: '1px solid var(--border-color)',
                  padding: '4px',
                  backgroundColor: '#ffffff',
                }}
              />
              <div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {internship.title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {internship.companyName}
                  </span>
                  {internship.company && (
                    <Link
                      to={`/companies/${internship.company._id}`}
                      style={{ fontSize: '0.8rem', color: 'var(--highlight)', fontWeight: 600 }}
                    >
                      View Company Profile &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Bookmark & Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <button
                onClick={handleToggleBookmark}
                className="btn btn-outline btn-icon"
                style={{
                  color: internship.isSaved ? '#f59e0b' : 'var(--text-muted)',
                  borderColor: internship.isSaved ? '#f59e0b' : 'var(--border-color)',
                }}
                title={internship.isSaved ? 'Remove Bookmark' : 'Save Internship'}
              >
                <Bookmark size={18} fill={internship.isSaved ? '#f59e0b' : 'none'} />
              </button>

              {internship.isApplied ? (
                <div className="badge badge-green" style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={16} /> Applied on CareerBridge
                </div>
              ) : (
                <button onClick={() => setIsApplyModalOpen(true)} className="btn btn-secondary btn-lg">
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick Details Chips */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-alt)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Monthly Stipend
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <DollarSign size={16} color="var(--secondary)" /> {internship.stipend}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Program Duration
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Clock size={16} color="var(--highlight)" /> {internship.duration}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Location / Mode
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <MapPin size={16} color="var(--highlight)" /> {internship.location} ({internship.locationType})
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Application Deadline
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Calendar size={16} color="#f59e0b" />
                {internship.applicationDeadline
                  ? new Date(internship.applicationDeadline).toLocaleDateString()
                  : 'Apply Soon'}
              </div>
            </div>
          </div>
        </div>

        {/* Internship Content Body */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Required Skills */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Required Technical & Core Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {internship.requiredSkills?.map((skill, index) => (
                <span key={index} className="badge badge-purple" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
              Eligibility Criteria
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.925rem' }}>
              {internship.eligibility}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
              Internship Overview
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', whiteSpace: 'pre-line' }}>
              {internship.description}
            </div>
          </div>

          {/* Responsibilities */}
          {internship.responsibilities && internship.responsibilities.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                What You Will Do During the Internship
              </h3>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                {internship.responsibilities.map((resp, i) => (
                  <li key={i} style={{ lineHeight: 1.5 }}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/internships" className="btn btn-outline">
              <ArrowLeft size={16} /> Explore Other Internships
            </Link>

            {internship.isApplied ? (
              <span className="badge badge-green" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} /> Application Under Review
              </span>
            ) : (
              <button onClick={() => setIsApplyModalOpen(true)} className="btn btn-secondary btn-lg">
                Submit Application
              </button>
            )}
          </div>
        </div>

        {/* Apply Modal */}
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Apply for ${internship.title}`}
        >
          <div>
            {applySuccess ? (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{applySuccess}</span>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Resume from CareerBridge Profile</label>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                      <FileText size={16} color="var(--secondary)" />
                      <span>{profile?.resumeFileName || 'Default CareerBridge Student Resume'}</span>
                    </div>
                    <Link to="/resume-builder" target="_blank" style={{ fontSize: '0.775rem', color: 'var(--highlight)', fontWeight: 600 }}>
                      Edit Resume
                    </Link>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Statement of Purpose / Introduction</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Briefly state your passion for this internship and how your college coursework/projects relate..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button onClick={() => setIsApplyModalOpen(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmApply}
                    disabled={applyLoading}
                    className="btn btn-secondary"
                  >
                    {applyLoading ? 'Submitting...' : 'Confirm Internship Application'}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
