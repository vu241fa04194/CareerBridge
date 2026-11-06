import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, GraduationCap, Building2, Calendar, Award, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    collegeName: '',
    degree: 'B.Tech',
    branch: '',
    graduationYear: 2026,
    skills: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const extractErrorMessage = (err) => {
    console.error('Registration request error details:', err);

    // 1. Firebase Auth specific error codes
    if (err.code === 'auth/email-already-in-use') {
      return 'An account with this email address already exists. Please sign in or use another email.';
    }
    if (err.code === 'auth/invalid-email') {
      return 'Please provide a valid email address.';
    }
    if (err.code === 'auth/weak-password') {
      return 'Password is too weak. Firebase requires at least 6 characters.';
    }
    if (err.code === 'auth/network-request-failed') {
      return 'Network error connecting to Firebase. Please check your internet connection.';
    }
    if (err.code === 'auth/configuration-not-found') {
      return 'Firebase Authentication is not activated yet in your Firebase project. Please open Firebase Console -> Build -> Authentication, click "Get started", and enable "Email/Password".';
    }
    if (err.code === 'auth/operation-not-allowed') {
      return 'Email/Password sign-in is not enabled in Firebase Authentication console. Please enable it under Auth -> Sign-in method.';
    }

    if (err.code === 'permission-denied' || (err.message && err.message.includes('insufficient permissions'))) {
      return 'Firestore permission error: Please open Firebase Console -> Firestore Database -> Rules, set "allow read, write: if true;" (or publish firestore.rules), and click Publish.';
    }

    // 2. Direct message
    if (err.message) {
      return err.message;
    }

    // 3. Backend error response with message field
    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    return 'Registration failed. Please check your details and try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // 1. Name validation
    const cleanName = formData.name.trim();
    if (!cleanName || cleanName.length < 2) {
      setError('Please provide your full name (minimum 2 characters).');
      return;
    }

    // 2. Email validation
    const cleanEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please provide a valid email address (e.g. name@college.edu).');
      return;
    }

    // 3. Password validation
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // 4. Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    // 5. Academic validation
    if (!formData.collegeName.trim()) {
      setError('Please provide your college or institute name.');
      return;
    }

    if (!formData.branch.trim()) {
      setError('Please provide your branch or specialization.');
      return;
    }

    try {
      setLoading(true);
      await register({
        ...formData,
        name: cleanName,
        email: cleanEmail,
        collegeName: formData.collegeName.trim(),
        branch: formData.branch.trim(),
        phone: formData.phone.trim(),
      });
      setSuccessMsg('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '680px',
          boxShadow: 'var(--shadow-xl)',
          padding: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-blue), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <GraduationCap size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Join thousands of college students discovering placements & internships
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{error}</div>
              {(error.toLowerCase().includes('already exists') || error.toLowerCase().includes('email')) && (
                <div style={{ marginTop: '0.45rem', fontSize: '0.825rem' }}>
                  Already registered with this email?{' '}
                  <Link to="/login" style={{ color: 'inherit', fontWeight: 800, textDecoration: 'underline' }}>
                    Click here to Sign In &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <CheckCircle size={20} />
            <span style={{ fontWeight: 600 }}>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Account Information */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-blue)', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
            1. Personal Credentials
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Alex Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="alex.sharma@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Section 2: College & Academic Background */}
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-blue)', letterSpacing: '0.05em', margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
            2. College & Academic Information
          </div>

          <div className="form-group">
            <label className="form-label">College / Institute Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="collegeName"
                className="form-control"
                placeholder="e.g. National Institute of Technology (NIT)"
                value={formData.collegeName}
                onChange={handleChange}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
              <Building2 size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Degree *</label>
              <select name="degree" className="form-control form-select" value={formData.degree} onChange={handleChange}>
                <option value="B.Tech">B.Tech / B.E.</option>
                <option value="M.Tech">M.Tech / M.E.</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Sc">B.Sc Computer Science</option>
                <option value="M.Sc">M.Sc</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Branch / Specialization *</label>
              <input
                type="text"
                name="branch"
                className="form-control"
                placeholder="e.g. Computer Science"
                value={formData.branch}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Year *</label>
              <select name="graduationYear" className="form-control form-select" value={formData.graduationYear} onChange={handleChange}>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Technical & Core Skills (Comma-separated)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="skills"
                className="form-control"
                placeholder="e.g. React.js, Python, Node.js, SQL, Java, Data Structures"
                value={formData.skills}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Award size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              We use these skills to automatically recommend matching jobs and internships on your dashboard!
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1.25rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--highlight)', fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
