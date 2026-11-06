import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Globe,
  MapPin,
  Star,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    location: '',
    website: '',
    description: '',
    size: '1000+ employees',
    founded: 2015,
    rating: 4.6,
  });
  const [saving, setSaving] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await API.get('/companies');
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
  }, []);

  const handleOpenAddModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      logo: '',
      industry: 'Software & Technology',
      location: 'Bengaluru / Hyderabad',
      website: 'https://',
      description: 'Leading global enterprise building digital products...',
      size: '5,000+ employees',
      founded: 2012,
      rating: 4.6,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (comp) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      logo: comp.logo || '',
      industry: comp.industry,
      location: comp.location,
      website: comp.website || '',
      description: comp.description,
      size: comp.size || '1,000+ employees',
      founded: comp.founded || 2010,
      rating: comp.rating || 4.5,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await API.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete company.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCompany) {
        const res = await API.put(`/companies/${editingCompany._id}`, formData);
        if (res.data.success) {
          setCompanies((prev) =>
            prev.map((c) => (c._id === editingCompany._id ? res.data.company : c))
          );
        }
      } else {
        const res = await API.post('/companies', formData);
        if (res.data.success) {
          setCompanies((prev) => [res.data.company, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save company.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
            Enterprise Directory
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Manage Partner Companies
          </h1>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} /> Add New Company
        </button>
      </div>

      <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search company by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Company</th>
                <th style={{ padding: '1rem' }}>Industry</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Rating</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading companies...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No companies found.
                  </td>
                </tr>
              ) : (
                filtered.map((comp) => (
                  <tr key={comp._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={comp.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(comp.name)}`}
                          alt={comp.name}
                          style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'contain' }}
                        />
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{comp.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{comp.industry}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{comp.location}</td>
                    <td style={{ padding: '1rem', color: '#b45309', fontWeight: 600 }}>★ {comp.rating}</td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEditModal(comp)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(comp._id)}
                          className="btn btn-outline btn-icon"
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? 'Edit Company Profile' : 'Add New Partner Company'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Google"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Industry *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Technology & Cloud"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location / Headquarters *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Bengaluru, Karnataka"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Careers Website URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://careers.google.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Company Logo URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://logo.clearbit.com/google.com"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Description *</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Overview of the company's mission and engineering work..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : editingCompany ? 'Update Company' : 'Add Company'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
