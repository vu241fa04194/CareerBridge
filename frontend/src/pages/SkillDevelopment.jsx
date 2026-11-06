import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  Database,
  Brain,
  MessageSquare,
  Calculator,
  Compass,
  Star,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import API from '../services/api';

const categories = [
  'All',
  'Programming',
  'Web Development',
  'Database Management',
  'Data Science',
  'Artificial Intelligence',
  'Communication Skills',
  'Aptitude',
  'Interview Skills',
];

export default function SkillDevelopment() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (search) params.append('search', search);

      const res = await API.get(`/courses?${params.toString()}`);
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedDifficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container">
        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
            Curated Learning Tracks
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Skill Development & Career Tracks
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Learn in-demand skills, follow interactive lesson plans, and track your completion progress.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-secondary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 260px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search courses or skills (e.g. Python, SQL, React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </form>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="form-control form-select"
            style={{ width: 'auto', fontSize: '0.875rem' }}
          >
            <option value="All">All Difficulty Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No courses match your criteria</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Try selecting another category or resetting the search term.
            </p>
            <button onClick={() => { setSelectedCategory('All'); setSearch(''); }} className="btn btn-primary btn-sm">
              Show All Courses
            </button>
          </div>
        ) : (
          <div className="grid-cols-auto">
            {courses.map((course) => {
              const progressPct = course.progress?.progressPercent || 0;
              return (
                <div key={course._id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-purple">{course.category}</span>
                    <span className="badge badge-blue">{course.difficulty}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    <Link to={`/skills/${course._id}`} style={{ color: 'inherit' }}>
                      {course.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, lineHeight: 1.5 }}>
                    {course.description}
                  </p>

                  {/* Skills tags */}
                  {course.skillsCovered && course.skillsCovered.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {course.skillsCovered.slice(0, 4).map((sk, i) => (
                        <span key={i} style={{ fontSize: '0.725rem', padding: '0.2rem 0.45rem', backgroundColor: 'var(--bg-alt)', borderRadius: '4px' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Meter */}
                  {progressPct > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        <span>Progress</span>
                        <span style={{ color: 'var(--secondary)' }}>{progressPct}%</span>
                      </div>
                      <div className="progress-container" style={{ height: '6px' }}>
                        <div className="progress-bar" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={12} /> {course.duration}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#b45309', fontWeight: 600 }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" /> {course.rating}
                      </span>
                    </div>

                    <Link to={`/skills/${course._id}`} className="btn btn-outline btn-sm">
                      {progressPct > 0 ? 'Continue' : 'Start Track'} &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
