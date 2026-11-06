import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  ExternalLink,
  ArrowLeft,
  Award,
  Video,
  FileText,
  Code,
  Share2,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CourseDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/courses/${id}`);
      if (res.data.success) {
        setCourse(res.data.course);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleToggleLesson = async (index) => {
    if (!isAuthenticated) {
      alert('Please log in as a student to track lesson progress.');
      return;
    }
    try {
      setUpdating(true);
      const res = await API.post(`/courses/${id}/lessons/${index}/toggle`);
      if (res.data.success) {
        setCourse((prev) => ({
          ...prev,
          userProgress: res.data.progress,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading course content...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h3>Course not found</h3>
        <Link to="/skills" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  const completedList = course.userProgress?.completedLessons || [];
  const progressPercent = course.userProgress?.progressPercent || 0;
  const currentLesson = course.lessons?.[activeLessonIndex];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/skills"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back to All Skill Tracks
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ maxWidth: '750px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-purple">{course.category}</span>
                <span className="badge badge-blue">{course.difficulty}</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25, marginBottom: '0.5rem' }}>
                {course.title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <span>Instructor: <strong>{course.instructor}</strong></span>
                <span>•</span>
                <span>Duration: <strong>{course.duration}</strong></span>
                <span>•</span>
                <span style={{ color: '#b45309', fontWeight: 700 }}>★ {course.rating} Rating</span>
              </div>
            </div>

            {/* Progress Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-alt)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                minWidth: '220px',
                textAlign: 'center',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Track Completion
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', margin: '0.25rem 0' }}>
                {progressPercent}%
              </div>
              <div className="progress-container" style={{ height: '8px', marginBottom: '0.75rem' }}>
                <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {completedList.length} of {course.lessons?.length || 0} Lessons Completed
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Lessons Sidebar & Active Lesson Viewer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }} className="course-grid">
          {/* Left Column: Lesson Modules List */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Course Lessons & Syllabus
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {course.lessons?.map((lesson, idx) => {
                const isCompleted = completedList.includes(idx);
                const isActive = activeLessonIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveLessonIndex(idx)}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isActive ? 'var(--secondary-subtle)' : 'var(--bg-alt)',
                      border: isActive ? '1px solid var(--secondary)' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLesson(idx);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                        title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={18} color="#10b981" />
                        ) : (
                          <Circle size={18} color="var(--text-muted)" />
                        )}
                      </button>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'var(--secondary)' : 'var(--text-main)',
                        }}
                      >
                        {idx + 1}. {lesson.title}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {lesson.duration}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* External Resources */}
            {course.externalResources && course.externalResources.length > 0 && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Useful External Links
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {course.externalResources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: '0.825rem',
                        color: 'var(--highlight)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-alt)',
                      }}
                    >
                      <span>{res.title}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Active Lesson Content Display */}
          <div className="card" style={{ padding: '2rem' }}>
            {currentLesson ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-purple">{currentLesson.type}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentLesson.duration}</span>
                  </div>

                  <button
                    onClick={() => handleToggleLesson(activeLessonIndex)}
                    disabled={updating}
                    className={`btn btn-sm ${completedList.includes(activeLessonIndex) ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {completedList.includes(activeLessonIndex) ? (
                      <>
                        <CheckCircle2 size={14} color="#10b981" /> Completed (Click to undo)
                      </>
                    ) : (
                      <>
                        <Circle size={14} /> Mark as Finished
                      </>
                    )}
                  </button>
                </div>

                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
                  {currentLesson.title}
                </h2>

                <div
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: '#334155',
                    marginBottom: '1.75rem',
                  }}
                >
                  {currentLesson.content || 'Content for this module is available in the learning resource link.'}
                </div>

                {/* Lesson Navigation Bottom Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <button
                    disabled={activeLessonIndex === 0}
                    onClick={() => setActiveLessonIndex((prev) => prev - 1)}
                    className="btn btn-outline btn-sm"
                  >
                    &larr; Previous Lesson
                  </button>
                  <button
                    disabled={activeLessonIndex === (course.lessons?.length || 1) - 1}
                    onClick={() => setActiveLessonIndex((prev) => prev + 1)}
                    className="btn btn-outline btn-sm"
                  >
                    Next Lesson &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <p>Select a lesson from the left syllabus to start reading.</p>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .course-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
