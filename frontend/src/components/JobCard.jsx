import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Bookmark, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function JobCard({ job, onBookmark, onApply }) {
  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src={
              job.companyLogo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || 'Company')}&background=0f172a&color=38bdf8`
            }
            alt={job.companyName}
            style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'contain', border: '1px solid var(--border-color)', padding: '2px', backgroundColor: '#ffffff' }}
          />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
              <Link to={`/jobs/${job._id}`} style={{ color: 'inherit' }}>
                {job.title}
              </Link>
            </h3>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {job.companyName}
            </p>
          </div>
        </div>

        {onBookmark && (
          <button
            onClick={() => onBookmark(job._id)}
            className="btn btn-ghost btn-icon"
            style={{
              width: '36px',
              height: '36px',
              color: job.isSaved ? '#f59e0b' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
            }}
            title={job.isSaved ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <Bookmark size={18} fill={job.isSaved ? '#f59e0b' : 'none'} />
          </button>
        )}
      </div>

      {/* Meta Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <span className="badge badge-blue">
          <DollarSign size={12} /> {job.salaryPackage}
        </span>
        <span className="badge badge-gray">
          <MapPin size={12} /> {job.location} ({job.locationType})
        </span>
        <span className="badge badge-purple">
          <Briefcase size={12} /> {job.jobType}
        </span>
      </div>

      {/* Description Excerpt */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {job.description}
      </p>

      {/* Required Skills */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {job.requiredSkills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                backgroundColor: 'var(--bg-alt)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontWeight: 500,
              }}
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Calendar size={13} />
          {job.applicationDeadline
            ? `Deadline: ${new Date(job.applicationDeadline).toLocaleDateString()}`
            : 'Open Now'}
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
            Details
          </Link>
          {job.isApplied ? (
            <span className="badge badge-green" style={{ height: '32px', padding: '0 0.75rem' }}>
              <CheckCircle2 size={14} /> Applied
            </span>
          ) : (
            onApply && (
              <button onClick={() => onApply(job)} className="btn btn-primary btn-sm">
                Apply Now <ArrowRight size={14} />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
