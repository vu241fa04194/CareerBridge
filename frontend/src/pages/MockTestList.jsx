import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MockTestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await API.get('/prep/mock-tests');
        if (res.data.success) {
          setTests(res.data.mockTests);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

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
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.05em' }}>
            Diagnostic Assessment
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Placement Mock Tests & Assessments
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Timed examinations simulating actual placement filtering rounds. Test your speed, accuracy, and concepts.
          </p>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading mock assessments...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No mock tests currently scheduled.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tests.map((test) => {
              const userStats = test.userStats;

              return (
                <div key={test._id} className="card card-interactive" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
                        {test.category}
                      </span>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {test.title}
                      </h2>
                    </div>

                    {userStats && (
                      <div className={`badge ${userStats.passed ? 'badge-green' : 'badge-amber'}`} style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
                        Best Score: {userStats.bestScore}/{test.totalMarks} ({userStats.percentage}%)
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {test.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      padding: '1rem 1.25rem',
                      backgroundColor: 'var(--bg-alt)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.5rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      <Clock size={16} color="var(--highlight)" />
                      <span>Duration: {test.durationMinutes} Minutes</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      <FileQuestion size={16} color="var(--secondary)" />
                      <span>{test.totalQuestions} Questions</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      <Award size={16} color="#10b981" />
                      <span>Total: {test.totalMarks} Marks (Pass: {test.passingMarks})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Timer begins as soon as you launch the test.
                    </span>

                    <Link
                      to={`/placement-prep/mock-tests/${test._id}`}
                      className="btn btn-primary"
                    >
                      {userStats ? 'Retake Test' : 'Start Mock Test'} <ArrowRight size={16} />
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
