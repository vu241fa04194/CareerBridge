import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Briefcase, MapPin, DollarSign, X, CheckCircle2, FileText } from 'lucide-react';
import API from '../services/api';
import JobCard from '../components/JobCard';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [jobType, setJobType] = useState('All');
  const [locationType, setLocationType] = useState('All');
  const [sort, setSort] = useState('newest');

  // Apply modal
  const { isAuthenticated, profile } = useAuth();
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location !== 'All') params.append('location', location);
      if (jobType !== 'All') params.append('jobType', jobType);
      if (locationType !== 'All') params.append('locationType', locationType);
      if (sort) params.append('sort', sort);

      const res = await API.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [location, jobType, locationType, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleBookmark = async (jobId) => {
    if (!isAuthenticated) {
      alert('Please log in as a student to bookmark opportunities.');
      return;
    }
    try {
      const res = await API.post(`/jobs/${jobId}/save`);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, isSaved: res.data.isSaved } : j))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      alert('Please log in as a student to apply for jobs.');
      return;
    }
    setSelectedJob(job);
    setCoverLetter('');
    setApplySuccess('');
  };

  const handleConfirmApply = async () => {
    if (!selectedJob) return;
    setApplyLoading(true);
    try {
      const res = await API.post(`/applications/job/${selectedJob._id}`, { coverLetter });
      if (res.data.success) {
        setApplySuccess('Application submitted successfully!');
        setJobs((prev) =>
          prev.map((j) => (j._id === selectedJob._id ? { ...j, isApplied: true } : j))
        );
        setTimeout(() => setSelectedJob(null), 1500);
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
    setJobType('All');
    setLocationType('All');
    setSort('newest');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
            Career Opportunities
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Explore Verified Full-Time Jobs
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Apply directly with your CareerBridge profile and live ATS resume.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            padding: '1.25rem 1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search jobs by title, company, or skills (e.g. React, SDE, Cloud)..."
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
            <button type="submit" className="btn btn-primary">
              <Search size={16} /> Search Jobs
            </button>
            {(search || location !== 'All' || jobType !== 'All' || locationType !== 'All') && (
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
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="form-control form-select"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
            >
              <option value="All">All Workplace Types</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="form-control form-select"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
            >
              <option value="All">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-control form-select"
              style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 2rem 0.4rem 0.75rem', marginLeft: 'auto' }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="salary-high">Sort: Highest Package</option>
              <option value="deadline">Sort: Application Deadline</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Showing {jobs.length} Available {jobs.length === 1 ? 'Job' : 'Jobs'}
          </span>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--highlight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading job opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No matching jobs found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Try adjusting your search criteria or clearing filters to see all available opportunities.
            </p>
            <button onClick={clearFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid-cols-auto">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onBookmark={handleBookmark}
                onApply={handleApplyClick}
              />
            ))}
          </div>
        )}

        {/* Apply Modal */}
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={`Apply for ${selectedJob?.title}`}
        >
          {selectedJob && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <img
                  src={
                    selectedJob.companyLogo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedJob.companyName)}`
                  }
                  alt={selectedJob.companyName}
                  style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'contain' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedJob.companyName}</h4>
                  <span className="badge badge-blue">{selectedJob.salaryPackage}</span>
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
                    <label className="form-label">Resume from CareerBridge Profile</label>
                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        <FileText size={16} color="var(--highlight)" />
                        <span>{profile?.resumeFileName || 'Default CareerBridge ATS Resume'}</span>
                      </div>
                      <span className="badge badge-green">Attached</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cover Letter / Note for Hiring Manager</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      placeholder="Highlight relevant projects, GPA, and why you are excited for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button onClick={() => setSelectedJob(null)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmApply}
                      disabled={applyLoading}
                      className="btn btn-primary"
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
