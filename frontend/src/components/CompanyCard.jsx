import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star, ArrowRight, Briefcase } from 'lucide-react';

export default function CompanyCard({ company }) {
  return (
    <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img
          src={
            company.logo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0f172a&color=38bdf8`
          }
          alt={company.name}
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            objectFit: 'contain',
            border: '1px solid var(--border-color)',
            padding: '4px',
            backgroundColor: '#ffffff',
          }}
        />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
            <Link to={`/companies/${company._id}`} style={{ color: 'inherit' }}>
              {company.name}
            </Link>
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>
            {company.industry}
          </span>
        </div>
      </div>

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
        {company.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={13} /> {company.location}
        </span>
        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Users size={13} /> {company.size || '500+ employees'}
        </span>
        <span style={{ fontSize: '0.775rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
          <Star size={13} fill="#f59e0b" color="#f59e0b" /> {company.rating || 4.5}
        </span>
      </div>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="badge badge-blue">
          <Briefcase size={12} /> {company.totalOpportunities ?? (company.openJobsCount || 0) + (company.openInternshipsCount || 0)} Open Roles
        </span>

        <Link
          to={`/companies/${company._id}`}
          style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            color: 'var(--highlight)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          View Profile <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
