import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  FileText,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  ShieldCheck,
  Compass,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, isFirebaseConfigured } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {!isFirebaseConfigured && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            color: '#92400e',
            padding: '0.45rem 1rem',
            fontSize: '0.825rem',
            textAlign: 'center',
            borderBottom: '1px solid #fde68a',
            fontWeight: 500,
          }}
        >
          🔥 <strong>Firebase Configuration Required:</strong> Paste your Firebase web app keys into <code>frontend/.env</code> to activate live cloud authentication & Firestore.
        </div>
      )}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)',
            }}
          >
            <Briefcase size={22} color="#38bdf8" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.025em' }}>
              Career<span style={{ color: 'var(--secondary)' }}>Bridge</span>
            </span>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1 }}>
              Student Career Portal
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/jobs"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/jobs') ? 'var(--highlight)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <Briefcase size={16} /> Jobs
          </Link>

          <Link
            to="/internships"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/internships') ? 'var(--highlight)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <GraduationCap size={16} /> Internships
          </Link>

          <Link
            to="/courses"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname.startsWith('/courses') || location.pathname.startsWith('/skills') ? 'var(--highlight)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <BookOpen size={16} /> Learn Courses
          </Link>

          <Link
            to="/career-guidance"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname.startsWith('/career-guidance') ? 'var(--highlight)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <Compass size={16} /> Career Guidance
          </Link>

          <Link
            to="/placement-prep"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname.startsWith('/placement-prep') ? 'var(--highlight)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <Award size={16} /> Placement Prep
          </Link>

          <Link
            to="/resume-builder"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/resume-builder') ? 'var(--highlight)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <FileText size={16} /> Resume Builder
          </Link>

          <Link
            to="/companies"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/companies') ? 'var(--highlight)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)',
            }}
          >
            <Building2 size={16} /> Companies
          </Link>
        </nav>

        {/* Right Action / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <>
              <NotificationDropdown />

              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary btn-sm" style={{ display: 'none' }} id="admin-badge-btn">
                  <ShieldCheck size={14} /> Admin Hub
                </Link>
              )}

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0f172a&color=38bdf8`
                    }
                    alt={user?.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '0.5rem',
                      width: '220px',
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 0',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.email}
                      </p>
                      <span className={`badge ${isAdmin ? 'badge-purple' : 'badge-blue'}`} style={{ marginTop: '0.35rem' }}>
                        {isAdmin ? 'Administrator' : 'Student'}
                      </span>
                    </div>

                    <div style={{ padding: '0.35rem 0' }}>
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.55rem 1rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                          }}
                        >
                          <ShieldCheck size={16} color="var(--secondary)" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.55rem 1rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                          }}
                        >
                          <LayoutDashboard size={16} color="var(--highlight)" /> Student Dashboard
                        </Link>
                      )}

                      {!isAdmin && (
                        <>
                          <Link
                            to="/applications"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.55rem 1rem',
                              fontSize: '0.85rem',
                              color: 'var(--text-main)',
                            }}
                          >
                            <Briefcase size={16} color="var(--text-muted)" /> My Applications
                          </Link>

                          <Link
                            to="/saved"
                            onClick={() => setUserDropdownOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.55rem 1rem',
                              fontSize: '0.85rem',
                              color: 'var(--text-main)',
                            }}
                          >
                            <Bookmark size={16} color="var(--text-muted)" /> Saved Opportunities
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 1rem',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <User size={16} color="var(--text-muted)" /> Profile & Skills
                      </Link>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.35rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.55rem 1rem',
                          fontSize: '0.85rem',
                          color: '#ef4444',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Student
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-icon mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            backgroundColor: '#ffffff',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', fontWeight: 600 }}
          >
            <Briefcase size={18} color="var(--highlight)" /> Jobs
          </Link>
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', fontWeight: 600 }}
          >
            <GraduationCap size={18} color="var(--secondary)" /> Internships
          </Link>
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', fontWeight: 600 }}
          >
            <BookOpen size={18} color="#10b981" /> Learn Courses (W3Schools)
          </Link>
          <Link
            to="/career-guidance"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', fontWeight: 600 }}
          >
            <Compass size={18} color="var(--secondary)" /> Career Guidance
          </Link>
          <Link
            to="/placement-prep"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', fontWeight: 600 }}
          >
            <Award size={18} color="#f59e0b" /> Placement Prep
          </Link>
          <Link
            to="/resume-builder"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', fontWeight: 600 }}
          >
            <FileText size={18} color="var(--highlight)" /> Resume Builder
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0', fontWeight: 600 }}
          >
            <Building2 size={18} color="var(--text-muted)" /> Companies
          </Link>

          {isAuthenticated ? (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {isAdmin ? (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm">
                  <ShieldCheck size={16} /> Admin Dashboard
                </Link>
              ) : (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm">
                  <LayoutDashboard size={16} /> Student Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#ef4444' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive CSS for navbar */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-toggle {
            display: none !important;
          }
          #admin-badge-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
