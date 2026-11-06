import React, { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Users, Star } from 'lucide-react';
import API from '../services/api';
import CompanyCard from '../components/CompanyCard';

export default function CompanyDirectory() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [location, setLocation] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (industry !== 'All') params.append('industry', industry);
      if (location !== 'All') params.append('location', location);

      const res = await API.get(`/companies?${params.toString()}`);
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [industry, location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
            Recruiter Profiles
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Hiring Companies Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Learn about leading tech companies, work culture, and currently open jobs and internships.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 280px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search companies by name or industry (e.g. Google, FinTech)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </form>

          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="form-control form-select"
            style={{ width: 'auto', fontSize: '0.875rem' }}
          >
            <option value="All">All Industries</option>
            <option value="Technology & Cloud">Technology & Cloud</option>
            <option value="Software & Cloud Computing">Software & Cloud Computing</option>
            <option value="FinTech & Payments">FinTech & Payments</option>
            <option value="E-Commerce & AWS Cloud">E-Commerce</option>
            <option value="FoodTech & Logistics">FoodTech & Logistics</option>
            <option value="IT Services & Consulting">IT Services</option>
          </select>

          <button onClick={fetchCompanies} className="btn btn-primary">
            Apply Filters
          </button>
        </div>

        {/* Counter */}
        <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Showing {companies.length} Registered Companies
        </div>

        {/* Companies Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--highlight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Building2 size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No companies found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid-cols-auto">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
