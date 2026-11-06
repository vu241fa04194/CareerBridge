import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  Lightbulb,
} from 'lucide-react';
import API from '../services/api';

const categories = ['All', 'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'];

export default function AptitudePractice() {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // User interactions: question answers selected and solutions shown
  const [userSelections, setUserSelections] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search) params.append('search', search);

      const res = await API.get(`/prep/aptitude?${params.toString()}`);
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory]);

  const handleOptionSelect = (qId, optionIndex) => {
    setUserSelections((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const toggleSolution = (qId) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
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
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
            Round 1 Practice
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Aptitude Practice & Speed Math
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Master Quantitative, Logical Reasoning, and Verbal Ability tests used by TCS, Infosys, and Cognizant.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--highlight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading aptitude questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No questions available for this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {questions.map((q, idx) => {
              const selectedOpt = userSelections[q._id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctAnswer;
              const isShowSolution = revealedSolutions[q._id];

              return (
                <div key={q._id} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge badge-blue">{q.category}</span>
                      <span className="badge badge-gray">{q.topic}</span>
                    </div>
                    <span className="badge badge-purple">{q.difficulty}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Q{idx + 1}. {q.question}
                  </h3>

                  {/* Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    {q.options.map((opt, optIdx) => {
                      let bgColor = 'var(--bg-alt)';
                      let borderColor = 'var(--border-color)';
                      let textColor = 'var(--text-main)';

                      if (isAnswered) {
                        if (optIdx === q.correctAnswer) {
                          bgColor = 'var(--accent-green-subtle)';
                          borderColor = '#10b981';
                          textColor = '#047857';
                        } else if (optIdx === selectedOpt) {
                          bgColor = 'var(--accent-rose-subtle)';
                          borderColor = '#f43f5e';
                          textColor = '#9f1239';
                        }
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleOptionSelect(q._id, optIdx)}
                          style={{
                            padding: '0.85rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: bgColor,
                            border: `1px solid ${borderColor}`,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: isAnswered && optIdx === q.correctAnswer ? 700 : 500,
                            color: textColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            transition: 'var(--transition)',
                          }}
                        >
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#ffffff',
                              border: `1px solid ${borderColor}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback Banner */}
                  {isAnswered && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isCorrect ? 'var(--accent-green-subtle)' : 'var(--accent-rose-subtle)',
                        border: `1px solid ${isCorrect ? '#a7f3d0' : '#fecdd3'}`,
                        color: isCorrect ? '#065f46' : '#9f1239',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        <span>
                          {isCorrect
                            ? 'Correct answer! Excellent calculation.'
                            : `Incorrect. Correct answer is Option ${String.fromCharCode(65 + q.correctAnswer)}.`}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleSolution(q._id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'inherit', fontWeight: 700 }}
                      >
                        {isShowSolution ? 'Hide Solution' : 'View Solution'}
                      </button>
                    </div>
                  )}

                  {!isAnswered && (
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => toggleSolution(q._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--highlight)', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Lightbulb size={14} /> {isShowSolution ? 'Hide Explanation' : 'Show Explanation'}
                      </button>
                    </div>
                  )}

                  {/* Step-by-Step Explanation */}
                  {isShowSolution && (
                    <div
                      style={{
                        padding: '1.25rem',
                        backgroundColor: 'var(--highlight-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--highlight-border)',
                        marginTop: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369a1', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <Lightbulb size={16} /> Step-by-Step Explanation:
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#0c4a6e', lineHeight: 1.6 }}>
                        {q.explanation}
                      </p>
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
