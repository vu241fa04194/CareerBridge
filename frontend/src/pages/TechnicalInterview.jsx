import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ArrowLeft,
  Building2,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import API from '../services/api';

const topics = [
  'All',
  'Java',
  'Python',
  'C',
  'Data Structures',
  'DBMS',
  'Operating Systems',
];

export default function TechnicalInterview() {
  const [questions, setQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Expand / collapse questions
  const [expandedMap, setExpandedMap] = useState({});

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTopic !== 'All') params.append('topic', selectedTopic);
      if (search) params.append('search', search);

      const res = await API.get(`/prep/technical?${params.toString()}`);
      if (res.data.success) {
        setQuestions(res.data.questions);
        // Expand first two by default
        const initExpanded = {};
        res.data.questions.forEach((q, i) => {
          if (i < 2) initExpanded[q._id] = true;
        });
        setExpandedMap(initExpanded);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedTopic]);

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
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
            Round 2 Technical Interview
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Technical Q&A & Code Solutions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Core programming concepts, algorithms, database transactions, and operating systems fundamentals.
          </p>
        </div>

        {/* Topic Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`btn btn-sm ${selectedTopic === t ? 'btn-secondary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '0.85rem 1.25rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by topic, concept or keyword (e.g. Deadlock, LinkedList, QuickSort, ACID)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--secondary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading technical interview questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No technical questions found for this topic.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-purple">{q.topic}</span>
                        <span className="badge badge-blue">{q.difficulty}</span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                        {idx + 1}. {q.question}
                      </h3>
                    </div>

                    <button
                      className="btn btn-ghost btn-icon"
                      style={{ width: '32px', height: '32px', flexShrink: 0 }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Frequently Asked Companies */}
                  {q.companyTags && q.companyTags.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Frequently Asked In:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {q.companyTags.map((comp, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.725rem',
                              fontWeight: 600,
                              padding: '0.15rem 0.45rem',
                              backgroundColor: 'var(--bg-alt)',
                              borderRadius: '4px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expanded Answer & Code */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.25rem', paddingTop: '1.25rem' }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Detailed Answer & Explanation
                      </div>
                      <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                        {q.answer}
                      </p>

                      {q.codeSnippet && (
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                            Code Implementation Sample
                          </div>
                          <pre
                            style={{
                              backgroundColor: '#0f172a',
                              color: '#38bdf8',
                              padding: '1.25rem',
                              borderRadius: 'var(--radius-md)',
                              overflowX: 'auto',
                              fontSize: '0.85rem',
                              fontFamily: "'Courier New', Courier, monospace",
                              lineHeight: 1.5,
                            }}
                          >
                            <code>{q.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
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
