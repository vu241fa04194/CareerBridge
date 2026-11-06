import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Calendar,
  Award,
  Link as LinkIcon,
  Save,
  CheckCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentProfile() {
  const { user, profile, updateProfile, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    collegeName: profile?.collegeName || '',
    degree: profile?.degree || 'B.Tech',
    branch: profile?.branch || '',
    graduationYear: profile?.graduationYear || 2026,
    cgpa: profile?.cgpa || '',
    skills: profile?.skills?.join(', ') || '',
    bio: profile?.bio || '',
    linkedIn: profile?.linkedIn || '',
    github: profile?.github || '',
    portfolio: profile?.portfolio || '',
    resumeUrl: profile?.resumeUrl || '',
    resumeFileName: profile?.resumeFileName || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && profile) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        collegeName: profile.collegeName || '',
        degree: profile.degree || 'B.Tech',
        branch: profile.branch || '',
        graduationYear: profile.graduationYear || 2026,
        cgpa: profile.cgpa || '',
        skills: profile.skills?.join(', ') || '',
        bio: profile.bio || '',
        linkedIn: profile.linkedIn || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        resumeUrl: profile.resumeUrl || '',
        resumeFileName: profile.resumeFileName || '',
      });
    }
  }, [user, profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully! Completion score recalculated.');
      await refreshUser();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
          Account Settings
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
          Student Profile & Skills
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
          Keep your academic qualifications, resume, and technical skills updated for recruiters.
        </p>
      </div>

      {/* Completion Meter Card */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          borderLeft: '4px solid var(--highlight)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--highlight)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Profile Completion Meter</span>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--highlight)' }}>
            {profile?.profileCompletion || 20}%
          </span>
        </div>
        <div className="progress-container" style={{ height: '8px', marginBottom: '0.5rem' }}>
          <div className="progress-bar" style={{ width: `${profile?.profileCompletion || 20}%` }} />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tip: Adding skills, phone number, college CGPA, and your LinkedIn link maximizes your job match visibility!
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        {/* Profile Avatar / Photo URL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src={
              formData.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0f172a&color=38bdf8`
            }
            alt={formData.name}
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--highlight)' }}
          />
          <div style={{ flex: 1 }}>
            <label className="form-label">Profile Avatar Image URL</label>
            <input
              type="url"
              name="avatar"
              className="form-control"
              placeholder="https://example.com/photo.jpg"
              value={formData.avatar}
              onChange={handleChange}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Paste an image link from Unsplash, LinkedIn, or GitHub avatar.
            </span>
          </div>
        </div>

        {/* Section 1: Basic Info */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
          Basic Personal Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Registered)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ backgroundColor: 'var(--bg-alt)', cursor: 'not-allowed' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cumulative GPA / CGPA</label>
            <input
              type="number"
              step="0.01"
              name="cgpa"
              className="form-control"
              placeholder="e.g. 8.8"
              value={formData.cgpa}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Bio / Career Pitch</label>
          <textarea
            rows={3}
            name="bio"
            className="form-control"
            placeholder="Brief statement highlighting your engineering passions and career interests..."
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        {/* Section 2: Academic Details */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem', color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          Academic Qualifications
        </h3>

        <div className="form-group">
          <label className="form-label">College / University Name</label>
          <input
            type="text"
            name="collegeName"
            className="form-control"
            value={formData.collegeName}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Degree</label>
            <input
              type="text"
              name="degree"
              className="form-control"
              value={formData.degree}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Branch</label>
            <input
              type="text"
              name="branch"
              className="form-control"
              value={formData.branch}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              className="form-control"
              value={formData.graduationYear}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 3: Skills & Links */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem', color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          Skills & Online Profiles
        </h3>

        <div className="form-group">
          <label className="form-label">Technical Skills (Comma-separated)</label>
          <input
            type="text"
            name="skills"
            className="form-control"
            placeholder="React.js, Node.js, Python, MongoDB, SQL, Data Structures"
            value={formData.skills}
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Separate each skill with a comma to generate recommendation tags.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <input
              type="url"
              name="linkedIn"
              className="form-control"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedIn}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input
              type="url"
              name="github"
              className="form-control"
              placeholder="https://github.com/..."
              value={formData.github}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Portfolio Website</label>
            <input
              type="url"
              name="portfolio"
              className="form-control"
              placeholder="https://mywebsite.dev"
              value={formData.portfolio}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 4: Resume Document Attachment */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '2rem 0 1rem', color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          Resume Document Attachment
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Resume Document Name</label>
            <input
              type="text"
              name="resumeFileName"
              className="form-control"
              placeholder="Alex_Sharma_Resume.pdf"
              value={formData.resumeFileName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Resume Download / Cloud Link</label>
            <input
              type="url"
              name="resumeUrl"
              className="form-control"
              placeholder="https://drive.google.com/file/..."
              value={formData.resumeUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
