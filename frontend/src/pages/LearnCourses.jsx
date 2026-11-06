import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code,
  Terminal,
  Cpu,
  Coffee,
  FileCode,
  Server,
  Layout,
  Palette,
  Layers,
  Atom,
  Database,
  HardDrive,
  GitBranch,
  Activity,
  ShieldCheck,
  GitCommit,
  Award,
  CheckCircle2,
  Circle,
  ExternalLink,
  Clock,
  Star,
  Search,
  Sparkles,
  TrendingUp,
  Compass,
  ArrowRight,
  Check,
  Info,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const CATEGORIES = [
  'All',
  'Programming Languages',
  'Web Development',
  'Database Management',
  'Other Technical Subjects',
];

// Helper to pick an icon for each subject
const getSubjectIcon = (iconName, category) => {
  switch (iconName) {
    case 'Terminal':
      return <Terminal size={22} color="#0284c7" />;
    case 'Cpu':
      return <Cpu size={22} color="#7c3aed" />;
    case 'Code':
      return <Code size={22} color="#16a34a" />;
    case 'Coffee':
      return <Coffee size={22} color="#ea580c" />;
    case 'FileCode':
      return <FileCode size={22} color="#eab308" />;
    case 'Server':
      return <Server size={22} color="#6366f1" />;
    case 'Layout':
      return <Layout size={22} color="#f97316" />;
    case 'Palette':
      return <Palette size={22} color="#06b6d4" />;
    case 'Layers':
      return <Layers size={22} color="#8b5cf6" />;
    case 'Atom':
      return <Atom size={22} color="#0ea5e9" />;
    case 'Database':
      return <Database size={22} color="#10b981" />;
    case 'HardDrive':
      return <HardDrive size={22} color="#2563eb" />;
    case 'GitBranch':
      return <GitBranch size={22} color="#d97706" />;
    case 'Activity':
      return <Activity size={22} color="#ec4899" />;
    case 'ShieldCheck':
      return <ShieldCheck size={22} color="#dc2626" />;
    case 'GitCommit':
      return <GitCommit size={22} color="#f43f5e" />;
    default:
      if (category === 'Programming Languages') return <Code size={22} color="#0284c7" />;
      if (category === 'Web Development') return <Layout size={22} color="#7c3aed" />;
      if (category === 'Database Management') return <Database size={22} color="#10b981" />;
      return <BookOpen size={22} color="#0ea5e9" />;
  }
};

export default function LearnCourses() {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [activeModalCourse, setActiveModalCourse] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

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
      console.error('Failed to load courses', err);
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

  const handleToggleCompletion = async (courseId, currentStatus) => {
    if (!isAuthenticated) {
      alert('Please log in with your student account to record course completion.');
      return;
    }
    try {
      setTogglingId(courseId);
      const res = await API.post(`/courses/${courseId}/toggle-completion`);
      if (res.data.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c._id === courseId
              ? {
                  ...c,
                  progress: {
                    ...c.progress,
                    isCompleted: res.data.progress.isCompleted,
                    progressPercent: res.data.progress.progressPercent,
                    completedAt: res.data.progress.completedAt,
                  },
                }
              : c
          )
        );
        setFeedbackMsg(res.data.message);
        setTimeout(() => setFeedbackMsg(''), 4000);
      }
    } catch (err) {
      console.error('Toggle completion failed', err);
      alert('Failed to update course completion status.');
    } finally {
      setTogglingId(null);
    }
  };

  // Compute overall progress stats
  const totalCourses = courses.length;
  const completedCount = courses.filter((c) => c.progress?.isCompleted).length;
  const overallPercent = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  const popularCourses = courses.filter((c) => c.isPopular);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Banner Alert if updated */}
        {feedbackMsg && (
          <div
            className="alert alert-success"
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Header Hero Section */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
            color: '#ffffff',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={14} /> Subject-Wise Learning & W3Schools Tutorials
            </div>

            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.75rem',
                lineHeight: 1.25,
              }}
            >
              Master Core Programming & Web Subjects
            </h1>

            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Connect directly with official, industry-standard <strong>W3Schools tutorials</strong> across 17+ subjects in
              Programming, Full Stack Web Development, Database Systems, and Core Computer Science. Click <strong>"Start Learning"</strong> to
              open the tutorial and mark subjects completed to track your placement preparation.
            </p>

            {/* Quick Links / Navigation to Career Guidance */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Link to="/career-guidance" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={16} /> Open Skill Gap Analyzer & Guidance
              </Link>
              <Link to="/placement-prep" className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
                <Award size={16} /> Placement Mock Tests & Aptitude
              </Link>
            </div>
          </div>

          {/* Student Progress Summary Meter */}
          {isAuthenticated && (
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  Personal Learning Progress
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
                  {completedCount} of {totalCourses} Subjects Completed ({overallPercent}%)
                </div>
              </div>

              <div style={{ flex: '1 1 240px', maxWidth: '340px' }}>
                <div
                  style={{
                    height: '10px',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${overallPercent}%`,
                      backgroundColor: '#38bdf8',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.85rem',
                  padding: '0.45rem 1rem',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 260px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by subject, language, or concept (e.g., Python, C++, SQL, React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </form>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="form-control form-select"
            style={{ width: 'auto', minWidth: '180px', fontSize: '0.875rem' }}
          >
            <option value="All">All Difficulty Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                border: '3px solid #e2e8f0',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p style={{ color: 'var(--text-secondary)' }}>Loading subject tutorials from W3Schools catalog...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No courses match your filter</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Try selecting another category tab or clearing the search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearch('');
              }}
              className="btn btn-primary btn-sm"
            >
              Show All 17+ Subjects
            </button>
          </div>
        ) : (
          <>
            {/* Active Category Heading */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '1.25rem',
              }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {selectedCategory === 'All' ? 'All Subjects & Tutorials' : selectedCategory} ({courses.length})
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Links connect directly to verified W3Schools modules
              </span>
            </div>

            {/* Courses Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {courses.map((course) => {
                const isCompleted = course.progress?.isCompleted;
                const isToggling = togglingId === course._id;

                return (
                  <div
                    key={course._id}
                    className="card card-interactive"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '1.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: isCompleted ? '2px solid #10b981' : '1px solid var(--border-color)',
                      backgroundColor: isCompleted ? '#f0fdf4' : '#ffffff',
                      position: 'relative',
                    }}
                  >
                    {/* Top Row: Icon + Badges */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: isCompleted ? '#dcfce7' : '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          {getSubjectIcon(course.iconName, course.category)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                              {course.category}
                            </span>
                            <span
                              className={`badge ${
                                course.difficulty === 'Beginner'
                                  ? 'badge-blue'
                                  : course.difficulty === 'Intermediate'
                                  ? 'badge-amber'
                                  : 'badge-purple'
                              }`}
                              style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                            >
                              {course.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Completed Pill */}
                      {isCompleted && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          <Check size={12} /> Completed
                        </span>
                      )}
                    </div>

                    {/* Subject Title */}
                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        marginBottom: '0.45rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p
                      style={{
                        fontSize: '0.86rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.85rem',
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {course.description}
                    </p>

                    {/* Skills Covered Tags */}
                    {course.skillsCovered && course.skillsCovered.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.35rem',
                          marginBottom: '1rem',
                        }}
                      >
                        {course.skillsCovered.slice(0, 4).map((sk, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.2rem 0.5rem',
                              backgroundColor: isCompleted ? '#e2e8f0' : 'var(--bg-alt)',
                              color: 'var(--text-secondary)',
                              borderRadius: '4px',
                              fontWeight: 500,
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.775rem',
                        color: 'var(--text-muted)',
                        paddingTop: '0.65rem',
                        borderTop: '1px solid var(--border-color)',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={13} /> {course.duration || 'Self-Paced'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b45309', fontWeight: 600 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" /> {course.rating || 4.9}
                      </span>
                      <button
                        onClick={() => setActiveModalCourse(course)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--highlight)',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <Info size={13} /> Syllabus
                      </button>
                    </div>

                    {/* Primary Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {/* 1. Start Learning on W3Schools */}
                      {course.tutorialUrl ? (
                        <a
                          href={course.tutorialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            fontWeight: 600,
                            fontSize: '0.825rem',
                            textDecoration: 'none',
                          }}
                        >
                          Start Learning <ExternalLink size={13} />
                        </a>
                      ) : (
                        <Link
                          to={`/skills/${course._id}`}
                          className="btn btn-primary btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            fontWeight: 600,
                            fontSize: '0.825rem',
                          }}
                        >
                          View Track &rarr;
                        </Link>
                      )}

                      {/* 2. Mark as Completed / Toggle Button */}
                      <button
                        onClick={() => handleToggleCompletion(course._id, isCompleted)}
                        disabled={isToggling}
                        className={`btn btn-sm ${isCompleted ? 'btn-outline' : 'btn-secondary'}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          backgroundColor: isCompleted ? '#ffffff' : undefined,
                          borderColor: isCompleted ? '#10b981' : undefined,
                          color: isCompleted ? '#059669' : undefined,
                        }}
                      >
                        {isToggling ? (
                          'Saving...'
                        ) : isCompleted ? (
                          <>
                            <Check size={14} /> Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} /> Mark Done
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Syllabus / Details Modal */}
        {activeModalCourse && (
          <Modal
            isOpen={!!activeModalCourse}
            onClose={() => setActiveModalCourse(null)}
            title={`Syllabus: ${activeModalCourse.title}`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-purple">{activeModalCourse.category}</span>
                <span className="badge badge-blue">{activeModalCourse.difficulty}</span>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {activeModalCourse.description}
              </p>

              {/* Official Link Pill */}
              {activeModalCourse.tutorialUrl && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-alt)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      OFFICIAL W3SCHOOLS TUTORIAL
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {activeModalCourse.tutorialUrl}
                    </div>
                  </div>
                  <a
                    href={activeModalCourse.tutorialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    Open <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {/* Lesson Outline */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Curriculum Topics & Lessons ({activeModalCourse.lessons?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeModalCourse.lessons && activeModalCourse.lessons.length > 0 ? (
                    activeModalCourse.lessons.map((ls, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            {idx + 1}. {ls.title}
                          </div>
                          {ls.content && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                              {ls.content}
                            </div>
                          )}
                        </div>
                        {ls.url ? (
                          <a
                            href={ls.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--highlight)', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            Read <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ls.duration}</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Follow the structured topics on the official W3Schools portal.
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={() => setActiveModalCourse(null)} className="btn btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
