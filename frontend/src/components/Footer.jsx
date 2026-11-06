import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Heart, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--primary)',
        color: '#f8fafc',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
      className="no-print"
    >
      <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1e3a8a, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Briefcase size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Career<span style={{ color: '#38bdf8' }}>Bridge</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Connecting Students to Their Future. Your one-stop campus career portal for job opportunities, paid internships, skill development courses, and placement preparation.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'var(--transition)',
                }}
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'var(--transition)',
                }}
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'var(--transition)',
                }}
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Opportunities */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.2rem' }}>
              Opportunities
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/jobs" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Explore Full-Time Jobs
                </Link>
              </li>
              <li>
                <Link to="/internships" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Explore Internships
                </Link>
              </li>
              <li>
                <Link to="/companies" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Top Hiring Companies
                </Link>
              </li>
              <li>
                <Link to="/resume-builder" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Interactive Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/applications" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Preparation & Learning */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.2rem' }}>
              Placement & Learning
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/placement-prep/aptitude" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Aptitude Practice
                </Link>
              </li>
              <li>
                <Link to="/placement-prep/technical" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Technical Interview Q&A
                </Link>
              </li>
              <li>
                <Link to="/placement-prep/hr" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  HR Interview Prep & Tips
                </Link>
              </li>
              <li>
                <Link to="/placement-prep/mock-tests" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Diagnostic Mock Tests
                </Link>
              </li>
              <li>
                <Link to="/skills" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Skill Development Tracks
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.2rem' }}>
              Campus Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                <Mail size={16} color="#38bdf8" />
                <span>support@careerbridge.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                <Phone size={16} color="#38bdf8" />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                <MapPin size={18} color="#38bdf8" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>Career Development Center, Knowledge Park, Bengaluru, 560100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            color: '#64748b',
            fontSize: '0.825rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} CareerBridge – Student Career Portal. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built with</span>
            <Heart size={14} color="#f43f5e" fill="#f43f5e" />
            <span>for graduating students and future engineers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
