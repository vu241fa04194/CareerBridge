import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import API from '../services/api';

export default function HRInterview() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedMap, setExpandedMap] = useState({});

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await API.get(`/prep/hr?${params.toString()}`);
      if (res.data.success) {
        setQuestions(res.data.questions);
        const init = {};
        res.data.questions.forEach((q, i) => {
          if (i === 0) init[q._id] = true;
        });
        setExpandedMap(init);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2.5rem 0' }}>
      <div className="container container-narrow">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/placement-prep"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back to Placement Prep Hub
          </Link>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#f59e0b', letterSpacing: '0.05em' }}>
            Final Placement Round
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            HR Interview Questions & Winning Answers
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Master behavioral questions, interpersonal storytelling using the STAR formula, and recruiter evaluation criteria.
          </p>
        </div>

        {/* Questions Accordion List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading HR interview guide...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {questions.map((q, idx) => {
              const isExpanded = !!expandedMap[q._id];

              return (
                <div key={q._id} className="card" style={{ padding: '1.75rem' }}>
                  <div
                    onClick={() => toggleExpand(q._id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
                        {q.category}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35 }}>
                        {idx + 1}. "{q.question}"
                      </h3>
                    </div>

                    <button
                      className="btn btn-ghost btn-icon"
                      style={{ width: '32px', height: '32px', flexShrink: 0 }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.25rem', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* What recruiter looks for */}
                      <div
                        style={{
                          padding: '1rem',
                          backgroundColor: 'var(--bg-alt)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '4px solid #f59e0b',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          What the Interviewer Evaluates:
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {q.whatInterviewerEvaluates}
                        </p>
                      </div>

                      {/* Sample Winning Answer */}
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          Sample High-Scoring Response:
                        </div>
                        <div
                          style={{
                            padding: '1.25rem',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.925rem',
                            lineHeight: 1.7,
                            color: '#1e293b',
                            fontStyle: 'italic',
                          }}
                        >
                          "{q.sampleAnswer}"
                        </div>
                      </div>

                      {/* Key Tips */}
                      {q.tips && q.tips.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Lightbulb size={16} color="#f59e0b" /> Expert Interview Tips:
                          </div>
                          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {q.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dos & Don'ts */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {q.dos && q.dos.length > 0 && (
                          <div style={{ padding: '0.85rem', backgroundColor: 'var(--accent-green-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', marginBottom: '0.4rem' }}>
                              DOs:
                            </div>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.825rem', color: '#065f46' }}>
                              {q.dos.map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {q.donts && q.donts.length > 0 && (
                          <div style={{ padding: '0.85rem', backgroundColor: 'var(--accent-rose-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#be123c', marginBottom: '0.4rem' }}>
                              DON'Ts:
                            </div>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.825rem', color: '#9f1239' }}>
                              {q.donts.map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
