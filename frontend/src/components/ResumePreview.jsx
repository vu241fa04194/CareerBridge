import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export default function ResumePreview({ resumeData, template = 'modern' }) {
  const {
    personalInfo = {},
    careerObjective = '',
    education = [],
    technicalSkills = [],
    projects = [],
    internships = [],
    certifications = [],
    achievements = [],
  } = resumeData || {};

  // Template 1: Modern
  if (template === 'modern') {
    return (
      <div
        className="resume-paper"
        style={{
          backgroundColor: '#ffffff',
          color: '#1e293b',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-color)',
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1.5,
          minHeight: '840px',
        }}
      >
        {/* Top Header */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            {personalInfo.fullName || 'Alex Sharma'}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.5rem', fontSize: '0.825rem', color: '#475569' }}>
            {personalInfo.email && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Mail size={12} color="#0284c7" /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone size={12} color="#0284c7" /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} color="#0284c7" /> {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedIn && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Linkedin size={12} color="#0284c7" /> {personalInfo.linkedIn}
              </span>
            )}
            {personalInfo.github && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Github size={12} color="#0284c7" /> {personalInfo.github}
              </span>
            )}
          </div>
        </div>

        {/* Objective */}
        {careerObjective && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.4rem' }}>
              Career Objective
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>{careerObjective}</p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{edu.institution}</h3>
                    <p style={{ fontSize: '0.825rem', color: '#475569' }}>
                      {edu.degree} in {edu.fieldOfStudy}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      {edu.startYear} - {edu.endYear}
                    </span>
                    {edu.score && (
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>
                        {edu.score}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {technicalSkills.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Technical Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {technicalSkills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#0f172a',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Academic & Technical Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projects.map((proj, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{proj.title}</h3>
                    {proj.technologies?.length > 0 && (
                      <span style={{ fontSize: '0.775rem', color: '#7c3aed', fontWeight: 600 }}>
                        {proj.technologies.join(', ')}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internships & Experience */}
        {internships.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>
              Internship Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {internships.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                      {exp.role} • <span style={{ color: '#0284c7' }}>{exp.company}</span>
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.duration}</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem' }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {certifications.length > 0 && (
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.4rem' }}>
                Certifications
              </h2>
              <ul style={{ paddingLeft: '1.15rem', fontSize: '0.825rem', color: '#475569' }}>
                {certifications.map((c, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    <strong>{c.name}</strong> - {c.issuer} {c.year ? `(${c.year})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.4rem' }}>
                Achievements
              </h2>
              <ul style={{ paddingLeft: '1.15rem', fontSize: '0.825rem', color: '#475569' }}>
                {achievements.map((ach, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Template 2: Classic (Serif / Academic style)
  if (template === 'classic') {
    return (
      <div
        className="resume-paper"
        style={{
          backgroundColor: '#ffffff',
          color: '#111827',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-color)',
          fontFamily: "'Georgia', 'Times New Roman', serif",
          lineHeight: 1.5,
          minHeight: '840px',
        }}
      >
        <div style={{ textAlign: 'center', borderBottom: '1px solid #111827', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {personalInfo.fullName || 'Alex Sharma'}
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.4rem', fontFamily: 'sans-serif' }}>
            {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedIn]
              .filter(Boolean)
              .join(' | ')}
          </div>
        </div>

        {careerObjective && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem' }}>
              Objective
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#374151' }}>{careerObjective}</p>
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem' }}>
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <div>
                  <strong>{edu.institution}</strong> — {edu.degree} in {edu.fieldOfStudy}
                </div>
                <div>{edu.score ? `${edu.score} | ` : ''}{edu.startYear} - {edu.endYear}</div>
              </div>
            ))}
          </div>
        )}

        {technicalSkills.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem' }}>
              Technical Expertise
            </h2>
            <p style={{ fontSize: '0.875rem' }}>{technicalSkills.join(', ')}</p>
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #d1d5db', paddingBottom: '0.2rem', marginBottom: '0.4rem' }}>
              Key Projects
            </h2>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <strong>{proj.title}</strong> {proj.technologies?.length ? `(${proj.technologies.join(', ')})` : ''}
                <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>{proj.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Template 3: Minimalist
  return (
    <div
      className="resume-paper"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        border: '1px solid var(--border-color)',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.5,
        minHeight: '840px',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
          {personalInfo.fullName || 'Alex Sharma'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.825rem', color: '#64748b', marginTop: '0.25rem' }}>
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location || 'India'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Objective
        </div>
        <div style={{ fontSize: '0.875rem', color: '#334155' }}>{careerObjective}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Education
        </div>
        <div>
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{edu.institution}</div>
              <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                {edu.degree} in {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear}) • {edu.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Skills
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {technicalSkills.map((s, i) => (
            <span key={i} style={{ border: '1px solid #cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.775rem' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Projects
        </div>
        <div>
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '0.65rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{p.title}</div>
              <div style={{ fontSize: '0.825rem', color: '#475569' }}>{p.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
