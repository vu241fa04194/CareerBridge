import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, GraduationCap, MapPin, DollarSign, Clock, X, CheckCircle2, FileText } from 'lucide-react';
import API from '../services/api';
import InternshipCard from '../components/InternshipCard';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export default function Internships() {
  const [searchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [duration, setDuration] = useState('All');
  const [locationType, setLocationType] = useState('All');
  const [sort, setSort] = useState('newest');

  // Apply modal
  const { isAuthenticated, profile } = useAuth();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location !== 'All') params.append('location', location);
      if (duration !== 'All') params.append('duration', duration);
      if (locationType !== 'All') params.append('locationType', locationType);
      if (sort) params.append('sort', sort);

      const res = await API.get(`/internships?${params.toString()}`);
      if (res.data.success) {
        setInternships(res.data.internships);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch internships.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [location, duration, locationType, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleBookmark = async (id) => {
    if (!isAuthenticated) {
      alert('Please log in as a student to bookmark.');
      return;
    }
    try {
      const res = await API.post(`/internships/${id}/save`);
      setInternships((prev) =>
        prev.map((i) => (i._id === id ? { ...i, isSaved: res.data.isSaved } : i))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyClick = (internship) => {
    if (!isAuthenticated) {
      alert('Please log in as a student to apply.');
      return;
    }
    setSelectedInternship(internship);
    setCoverLetter('');
    setApplySuccess('');
  };

  const handleConfirmApply = async () => {
    if (!selectedInternship) return;
    setApplyLoading(true);
    try {
      const res = await API.post(`/applications/internship/${selectedInternship._id}`, { coverLetter });
      if (res.data.success) {
        setApplySuccess('Application submitted successfully!');
        setInternships((prev) =>
          prev.map((i) => (i._id === selectedInternship._id ? { ...i, isApplied: true } : i))
        );
        setTimeout(() => setSelectedInternship(null), 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplyLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('All');
    setDuration('All');
    setLocationType('All');
    setSort('newest');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
            Internship Opportunities
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Discover Paid Summer & Winter Internships
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Work alongside experienced engineers and convert internships into pre-placement offers (PPOs).
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search internships by role, company, or skills (e.g. React, ML, Design)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              <Search size={16} /> Search Internships
            </button>
            {(search || location !== 'All' || duration !== 'All' || locationType !== 'All') && (
              <button type="button" onClick={clearFilters} className="btn btn-ghost" style={{ color: 'var(--text-muted)' }}>
                <X size={16} /> Reset
              </button>
            )}
          </form>

          {/* Secondary Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Filter size={15} /> Filters:
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control form-select"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
            >
              <option value="All">All Locations</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="form-control form-select"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
            >
              <option value="All">All Durations</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
            </select>

            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="form-control form-select"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
            >
              <option value="All">All Workplace Types</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-control form-select"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 2rem 0.4rem 0.75rem', marginLeft: 'auto' }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="stipend-high">Sort: Highest Stipend</option>
              <option value="deadline">Sort: Application Deadline</option>
            </select>
          </div>
        </div>

        {/* Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {internships.length} Available {internships.length === 1 ? 'Internship' : 'Internships'}
          </span>
        </div>

        {/* Internships Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading internship opportunities...</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <GraduationCap size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No matching internships found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Try adjusting your search criteria or resetting filters to see all available opportunities.
            </p>
            <button onClick={clearFilters} className="btn btn-secondary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid-cols-auto">
            {internships.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                onBookmark={handleBookmark}
                onApply={handleApplyClick}
              />
            ))}
          </div>
        )}

        {/* Apply Modal */}
        <Modal
          isOpen={!!selectedInternship}
          onClose={() => setSelectedInternship(null)}
          title={`Apply for ${selectedInternship?.title}`}
        >
          {selectedInternship && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <img
                  src={
                    selectedInternship.companyLogo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedInternship.companyName)}`
                  }
                  alt={selectedInternship.companyName}
                  style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'contain' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedInternship.companyName}</h4>
                  <span className="badge badge-purple">{selectedInternship.stipend}</span>
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
                    <label className="form-label">Resume from Profile</label>
                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <FileText size={16} color="var(--secondary)" />
                        <span>{profile?.resumeFileName || 'Default CareerBridge ATS Resume'}</span>
                      </div>
                      <span className="badge badge-green">Attached</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cover Letter / Note</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Explain your interest in this internship and your relevant technical coursework..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button onClick={() => setSelectedInternship(null)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmApply}
                      disabled={applyLoading}
                      className="btn btn-secondary"
                    >
                      {applyLoading ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
