import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Briefcase,
  Layers,
  ShieldCheck,
  Check,
  ChevronRight,
  RefreshCw,
  Plus,
  X,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CareerGuidance() {
  const { user, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [customSkills, setCustomSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [toggleSuccessId, setToggleSuccessId] = useState(null);

  // Fetch all career pathways
  const fetchPathways = async () => {
    try {
      setLoading(true);
      const res = await API.get('/guidance/recommendations');
      if (res.data.success && res.data.recommendations.length > 0) {
        setRecommendations(res.data.recommendations);
        const defaultRole = res.data.recommendations[0];
        setSelectedPathway(defaultRole);
        runSkillGapAnalysis(defaultRole._id);
      }
    } catch (err) {
      console.error('Failed to load career recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  // Run skill gap analysis
  const runSkillGapAnalysis = async (pathwayId, skillsOverride = null) => {
    try {
      setAnalyzing(true);
      const payload = {
        careerPathId: pathwayId,
      };
      if (skillsOverride) {
        payload.studentSkills = skillsOverride;
      } else if (customSkills.length > 0) {
        payload.studentSkills = customSkills;
      }

      const res = await API.post('/guidance/skill-gap', payload);
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        if (customSkills.length === 0 && res.data.analysis.studentSkills) {
          setCustomSkills(res.data.analysis.studentSkills);
        }
      }
    } catch (err) {
      console.error('Skill gap analysis error', err);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchPathways();
  }, []);

  const handleSelectPathway = (pathway) => {
    setSelectedPathway(pathway);
    runSkillGapAnalysis(pathway._id);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (customSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkillInput('');
      return;
    }
    const updated = [...customSkills, trimmed];
    setCustomSkills(updated);
    setNewSkillInput('');
    if (selectedPathway) {
      runSkillGapAnalysis(selectedPathway._id, updated);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = customSkills.filter((s) => s !== skillToRemove);
    setCustomSkills(updated);
    if (selectedPathway) {
      runSkillGapAnalysis(selectedPathway._id, updated);
    }
  };

  const handleToggleCourse = async (courseId) => {
    try {
      const res = await API.post(`/courses/${courseId}/toggle-completion`);
      if (res.data.success) {
        setToggleSuccessId(courseId);
        setTimeout(() => setToggleSuccessId(null), 3000);
        // Refresh gap analysis
        if (selectedPathway) {
          runSkillGapAnalysis(selectedPathway._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading career pathways & skill analyzer...</p>
      </div>
    );
  }

  const matchScore = analysis?.matchPercentage || 0;
  const matchedSkills = analysis?.matchedSkills || [];
  const missingSkills = analysis?.missingSkills || [];
  const recommendedCourses = analysis?.recommendedCourses || [];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#e0e7ff',
              color: 'var(--secondary)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.65rem',
            }}
          >
            <Compass size={14} /> Personalized Career Intelligence
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
            Career Guidance & Interactive Skill Gap Analyzer
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.35rem', maxWidth: '780px' }}>
            Compare your student profile skills against top industry job roles. Identify missing competencies and
            bridge your skill gap with direct links to official W3Schools tutorials.
          </p>
        </div>

        {/* Pathway Selection Carousel / Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Select Target Career Role:
          </div>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}
          >
            {recommendations.map((path) => {
              const isSelected = selectedPathway?._id === path._id;
              return (
                <button
                  key={path._id}
                  onClick={() => handleSelectPathway(path)}
                  className="card"
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--highlight)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    boxShadow: isSelected ? '0 4px 12px rgba(14, 165, 233, 0.15)' : 'var(--shadow-sm)',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                    {path.title}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                      {path.demandLevel} Demand
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {path.averageSalary}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Analyzer Grid: 2 Columns */}
        {selectedPathway && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1.4fr)',
              gap: '1.75rem',
              marginBottom: '3rem',
            }}
          >
            {/* Left Column: Match Score & Current Skills Manager */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Match Score Card */}
              <div
                className="card"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  Target Role Readiness Score
                </span>

                <div
                  style={{
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    color: matchScore >= 70 ? '#4ade80' : matchScore >= 40 ? '#facc15' : '#f87171',
                    lineHeight: 1,
                    margin: '1rem 0 0.5rem',
                  }}
                >
                  {analyzing ? '...' : `${matchScore}%`}
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {matchScore >= 80
                    ? '🎉 Placement Ready'
                    : matchScore >= 50
                    ? '⚡ Moderate Readiness — Close the Gap'
                    : '🌱 Early Stage — Follow Learning Roadmap'}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  You have acquired <strong>{matchedSkills.length}</strong> of{' '}
                  <strong>{selectedPathway.requiredSkills.length}</strong> required skills for this profile.
                </p>

                {/* Meter Bar */}
                <div
                  style={{
                    height: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginTop: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${matchScore}%`,
                      backgroundColor: matchScore >= 70 ? '#4ade80' : matchScore >= 40 ? '#facc15' : '#f87171',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>

              {/* Student Skills Interactive Box */}
              <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Profile Skills</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {customSkills.length} Total
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Skills are synchronized with your Student Profile. Add or remove skills to simulate how your match score changes:
                </p>

                {/* Skills tags with delete pill */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                  {customSkills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#f1f5f9',
                        color: 'var(--text-main)',
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {sk}
                      <button
                        onClick={() => handleRemoveSkill(sk)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#94a3b8',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new skill form */}
                <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add skill (e.g. Docker, C++, React)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    <Plus size={14} /> Add
                  </button>
                </form>
              </div>

              {/* Recommended Certifications */}
              <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="var(--secondary)" /> Industry Certifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {selectedPathway.certifications && selectedPathway.certifications.length > 0 ? (
                    selectedPathway.certifications.map((cert, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.65rem 0.85rem',
                          backgroundColor: 'var(--bg-alt)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <CheckCircle2 size={14} color="#10b981" />
                        <span>{cert}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No specific certifications listed.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Skill Breakdown & Direct W3Schools Bridge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Role Overview */}
              <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="badge badge-blue" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                      {selectedPathway.category}
                    </span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {selectedPathway.title}
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                      {selectedPathway.averageSalary}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Typical Tier-1/MNC Package</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.5rem' }}>
                  {selectedPathway.description}
                </p>
              </div>

              {/* Skills Analysis Columns (Acquired vs Gap) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                {/* Acquired Skills Box */}
                <div
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderLeft: '4px solid #10b981',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#065f46' }}>
                      Acquired Skills ({matchedSkills.length})
                    </span>
                  </div>
                  {matchedSkills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {matchedSkills.map((sk, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '0.775rem',
                            fontWeight: 600,
                          }}
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      No direct matches found. Add your skills on the left to see progress!
                    </div>
                  )}
                </div>

                {/* Skill Gap Box */}
                <div
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderLeft: '4px solid #f59e0b',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <AlertCircle size={18} color="#f59e0b" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e' }}>
                      Skills to Learn (Gap) ({missingSkills.length})
                    </span>
                  </div>
                  {missingSkills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {missingSkills.map((sk, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '0.775rem',
                            fontWeight: 600,
                          }}
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.825rem', color: '#166534', fontWeight: 600 }}>
                      🎉 Zero skill gap! You match all core technical requirements.
                    </div>
                  )}
                </div>
              </div>

              {/* Direct W3Schools Bridge: Actionable Courses */}
              <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      Close the Gap: Recommended W3Schools Courses
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Start these specific tutorials to acquire your missing competencies:
                    </p>
                  </div>
                  <Link to="/courses" className="btn btn-outline btn-sm">
                    View All 17+ Subjects &rarr;
                  </Link>
                </div>

                {recommendedCourses.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {recommendedCourses.map((crs) => {
                      return (
                        <div
                          key={crs._id}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#ffffff',
                            gap: '1rem',
                          }}
                        >
                          <div style={{ flex: '1 1 240px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                                {crs.category}
                              </span>
                              <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                                {crs.difficulty}
                              </span>
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>
                              {crs.title}
                            </h4>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                              {crs.description}
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {crs.tutorialUrl && (
                              <a
                                href={crs.tutorialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                              >
                                Learn on W3Schools <ExternalLink size={13} />
                              </a>
                            )}
                            <button
                              onClick={() => handleToggleCourse(crs._id)}
                              className="btn btn-secondary btn-sm"
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              <CheckCircle2 size={13} /> Mark Done
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
                    <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      All key skills for this pathway are already mastered!
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      Check out our interview preparation and mock test series to test your readiness.
                    </p>
                  </div>
                )}
              </div>

              {/* 3-Step Learning Roadmap */}
              {selectedPathway.learningRoadmap && selectedPathway.learningRoadmap.length > 0 && (
                <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                    Step-by-Step Learning Roadmap
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedPathway.learningRoadmap.map((step) => (
                      <div
                        key={step.stepNumber}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            flexShrink: 0,
                          }}
                        >
                          {step.stepNumber}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {step.title}
                          </h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {step.description}
                          </p>
                          {step.recommendedSubjects && step.recommendedSubjects.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                              {step.recommendedSubjects.map((sb, i) => (
                                <span
                                  key={i}
                                  style={{
                                    backgroundColor: 'var(--bg-alt)',
                                    color: 'var(--text-secondary)',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.725rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  📚 {sb}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placement Interview Focus Areas */}
              {selectedPathway.interviewFocusAreas && selectedPathway.interviewFocusAreas.length > 0 && (
                <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      Placement Interview Focus Areas
                    </h3>
                    <Link to="/placement-prep" className="btn btn-outline btn-sm">
                      Take Mock Tests &rarr;
                    </Link>
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {selectedPathway.interviewFocusAreas.map((fa, i) => (
                      <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {fa}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
