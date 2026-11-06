import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Briefcase, GraduationCap, ArrowRight, Trash2 } from 'lucide-react';
import API from '../services/api';
import JobCard from '../components/JobCard';
import InternshipCard from '../components/InternshipCard';

export default function SavedOpportunities() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await API.get('/student/saved');
      if (res.data.success) {
        setSavedItems(res.data.saved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      await API.post(`/jobs/${jobId}/save`);
      setSavedItems((prev) => prev.filter((s) => s.job?._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSavedInternship = async (internId) => {
    try {
      await API.post(`/internships/${internId}/save`);
      setSavedItems((prev) => prev.filter((s) => s.internship?._id !== internId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.05em' }}>
          Saved Bookmarks
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
          Saved Jobs & Internships
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Keep track of opportunities you're interested in and apply before deadlines expire.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading bookmarked opportunities...</p>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Bookmark size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No saved opportunities</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Click the bookmark icon on any job or internship card to save it here for later.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <Link to="/jobs" className="btn btn-primary">
              Explore Jobs
            </Link>
            <Link to="/internships" className="btn btn-secondary">
              Explore Internships
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid-cols-auto">
          {savedItems.map((item) => {
            if (item.opportunityType === 'job' && item.job) {
              const jobWithSaved = { ...item.job, isSaved: true };
              return (
                <JobCard
                  key={item._id}
                  job={jobWithSaved}
                  onBookmark={handleRemoveSavedJob}
                />
              );
            } else if (item.opportunityType === 'internship' && item.internship) {
              const internWithSaved = { ...item.internship, isSaved: true };
              return (
                <InternshipCard
                  key={item._id}
                  internship={internWithSaved}
                  onBookmark={handleRemoveSavedInternship}
                />
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}
