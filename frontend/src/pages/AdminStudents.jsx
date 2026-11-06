import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  Award,
} from 'lucide-react';
import API from '../services/api';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await API.get(`/admin/students?${params.toString()}`);
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this registered student and all their applications?')) {
      return;
    }
    try {
      await API.delete(`/admin/students/${studentId}`);
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
          Student Registry
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
          Manage Registered Students
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          View registered college candidates, academic profiles, skills, and application counts.
        </p>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </form>
      </div>

      {/* Students Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Student Name & Avatar</th>
                <th style={{ padding: '1rem' }}>College & Degree</th>
                <th style={{ padding: '1rem' }}>Key Skills</th>
                <th style={{ padding: '1rem' }}>Profile Meter</th>
                <th style={{ padding: '1rem' }}>Applications</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No students registered matching your search query.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const prof = st.profile || {};

                  return (
                    <tr key={st._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={st.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.name)}`}
                            alt={st.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{st.name}</div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{st.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                          {prof.collegeName || 'College not provided'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {prof.degree || 'B.Tech'} {prof.branch ? `• ${prof.branch}` : ''}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '240px' }}>
                          {prof.skills?.slice(0, 3).map((sk, i) => (
                            <span key={i} style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem', backgroundColor: 'var(--bg-alt)', borderRadius: '4px' }}>
                              {sk}
                            </span>
                          ))}
                          {(prof.skills?.length || 0) > 3 && (
                            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              +{prof.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--highlight)' }}>
                            {prof.profileCompletion || 20}%
                          </span>
                          <div className="progress-container" style={{ width: '60px', height: '6px' }}>
                            <div className="progress-bar" style={{ width: `${prof.profileCompletion || 20}%` }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {st.applicationsCount || 0}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteStudent(st._id)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          title="Delete Student Account"
                        >
                          <Trash2 size={14} />
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
    </div>
  );
}
