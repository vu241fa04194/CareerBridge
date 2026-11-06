import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  Star,
  Globe,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import API from '../services/api';
import JobCard from '../components/JobCard';
import InternshipCard from '../components/InternshipCard';

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/companies/${id}`);
        if (res.data.success) {
          setCompany(res.data.company);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--highlight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading company profile...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h3>Company not found</h3>
        <Link to="/companies" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/companies"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back to Companies Directory
          </Link>
        </div>

        {/* Company Header Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <img
                src={
                  company.logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0f172a&color=38bdf8`
                }
                alt={company.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  objectFit: 'contain',
                  border: '1px solid var(--border-color)',
                  padding: '6px',
                  backgroundColor: '#ffffff',
                }}
              />
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                  {company.name}
                </h1>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  {company.industry}
                </span>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Globe size={16} /> Official Careers Site
              </a>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: '850px' }}>
            {company.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              padding: '1.25rem',
              backgroundColor: 'var(--bg-alt)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <MapPin size={18} color="var(--highlight)" />
              <span>Location: <strong>{company.location}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <Users size={18} color="var(--secondary)" />
              <span>Company Size: <strong>{company.size}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <Calendar size={18} color="#f59e0b" />
              <span>Founded: <strong>{company.founded}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 700 }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span>{company.rating} Rating</span>
            </div>
          </div>
        </div>

        {/* Open Opportunities Sections */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Full-Time Positions at {company.name} ({company.jobs?.length || 0})
          </h2>

          {company.jobs && company.jobs.length > 0 ? (
            <div className="grid-cols-auto">
              {company.jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No full-time roles currently listed for this company.</p>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Internship Opportunities at {company.name} ({company.internships?.length || 0})
          </h2>

          {company.internships && company.internships.length > 0 ? (
            <div className="grid-cols-auto">
              {company.internships.map((intern) => (
                <InternshipCard key={intern._id} internship={intern} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No internships currently listed for this company.</p>
          )}
        </div>
      </div>
    </div>
  );
}
