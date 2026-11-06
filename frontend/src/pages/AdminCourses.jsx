import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';
import API from '../services/api';
import Modal from '../components/Modal';

const CATEGORIES = [
  'Programming Languages',
  'Web Development',
  'Database Management',
  'Other Technical Subjects',
  'Programming',
  'Data Science',
  'Artificial Intelligence',
  'Communication Skills',
  'Aptitude',
  'Interview Skills',
];

const INITIAL_FORM = {
  title: '',
  category: 'Programming Languages',
  difficulty: 'Beginner',
  duration: 'Self-Paced / 3 Weeks',
  rating: 4.8,
  tutorialUrl: 'https://www.w3schools.com/',
  skillsCovered: '',
  description: '',
  iconName: 'Code',
  isPopular: false,
  isRecommended: false,
};

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get('/courses');
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData(INITIAL_FORM);
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      rating: course.rating,
      tutorialUrl: course.tutorialUrl || '',
      skillsCovered: Array.isArray(course.skillsCovered)
        ? course.skillsCovered.join(', ')
        : course.skillsCovered || '',
      description: course.description,
      iconName: course.iconName || 'Code',
      isPopular: !!course.isPopular,
      isRecommended: !!course.isRecommended,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingCourse) {
        const res = await API.put(`/courses/${editingCourse._id}`, formData);
        if (res.data.success) {
          setFeedback({ type: 'success', message: 'Course updated successfully!' });
          fetchCourses();
          setModalOpen(false);
        }
      } else {
        const res = await API.post('/courses', formData);
        if (res.data.success) {
          setFeedback({ type: 'success', message: 'New subject / course added successfully!' });
          fetchCourses();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Save failed', err);
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Failed to save course.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await API.delete(`/courses/${deleteId}`);
      if (res.data.success) {
        setFeedback({ type: 'success', message: 'Course removed successfully!' });
        fetchCourses();
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Delete failed', err);
      setFeedback({ type: 'error', message: 'Failed to delete course.' });
    } finally {
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Filtered courses
  const filtered = courses.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ padding: '2rem' }}>
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'}`}
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Course & W3Schools Subject Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Add, update, and manage official W3Schools tutorial subjects, links, difficulty levels, and syllabi.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Subject / Course
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-control form-select"
          style={{ width: 'auto', minWidth: '220px' }}
        >
          <option value="All">All Categories ({courses.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Course Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading courses...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No courses found matching your criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Subject / Course Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Official W3Schools URL</th>
                  <th>Rating</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((crs) => (
                  <tr key={crs._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{crs.title}</div>
                      <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                        {crs.isPopular && (
                          <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                            Popular
                          </span>
                        )}
                        {crs.isRecommended && (
                          <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                            Recommended
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                        {crs.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-blue" style={{ fontSize: '0.75rem' }}>
                        {crs.difficulty}
                      </span>
                    </td>
                    <td>
                      {crs.tutorialUrl ? (
                        <a
                          href={crs.tutorialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--highlight)',
                            fontSize: '0.825rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {crs.tutorialUrl} <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" /> {crs.rating}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {crs.tutorialUrl && (
                          <a
                            href={crs.tutorialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                            title="Test W3Schools Tutorial"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(crs)}
                          className="btn btn-outline btn-sm"
                          title="Edit Subject"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(crs._id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: '#ef4444' }}
                          title="Delete Subject"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCourse ? 'Edit Subject / Course' : 'Add New Subject / Course'}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Subject Title *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Python Programming, React.js Frontend Library"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Category *</label>
                <select
                  required
                  className="form-control form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Difficulty *</label>
                <select
                  required
                  className="form-control form-select"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Official W3Schools Tutorial URL *</label>
              <input
                type="url"
                required
                className="form-control"
                placeholder="https://www.w3schools.com/python/"
                value={formData.tutorialUrl}
                onChange={(e) => setFormData({ ...formData, tutorialUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Description *</label>
              <textarea
                required
                rows={3}
                className="form-control"
                placeholder="Overview of topics and practical competencies covered..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Skills Covered (comma separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Python, OOP, Data Structures, Algorithms"
                value={formData.skillsCovered}
                onChange={(e) => setFormData({ ...formData, skillsCovered: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Self-Paced / 3 Weeks"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Rating (0 - 5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  className="form-control"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="form-label">Icon Identifier</label>
                <select
                  className="form-control form-select"
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                >
                  <option value="Code">Code</option>
                  <option value="Terminal">Terminal (C)</option>
                  <option value="Cpu">Cpu (C++)</option>
                  <option value="Coffee">Coffee (Java)</option>
                  <option value="FileCode">FileCode (JS)</option>
                  <option value="Server">Server (PHP/Postgres)</option>
                  <option value="Layout">Layout (HTML)</option>
                  <option value="Palette">Palette (CSS)</option>
                  <option value="Layers">Layers (Bootstrap)</option>
                  <option value="Atom">Atom (React)</option>
                  <option value="Database">Database (SQL/Mongo)</option>
                  <option value="HardDrive">HardDrive (MySQL)</option>
                  <option value="GitBranch">GitBranch (DSA)</option>
                  <option value="Activity">Activity (ML)</option>
                  <option value="ShieldCheck">ShieldCheck (Security)</option>
                  <option value="GitCommit">GitCommit (Git)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                />
                Mark as Popular Subject
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={formData.isRecommended}
                  onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                />
                Mark as Recommended
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                {submitting ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Confirm Delete"
        >
          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Are you sure you want to remove this subject / course? Any enrolled student progress records associated with it will also be removed.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                Delete Subject
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
