import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MockTestRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 0: optionIdx, 1: optionIdx }
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/prep/mock-tests/${id}`);
        if (res.data.success) {
          const testData = res.data.mockTest;
          setTest(testData);
          setSecondsLeft(testData.durationMinutes * 60);
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to start test.');
        navigate('/placement-prep/mock-tests');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (result || loading || secondsLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [result, loading, secondsLeft]);

  const handleSelectOption = (qIdx, optIdx) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your test automatically.');
    submitAnswers();
  };

  const handleSubmitClick = () => {
    const answeredCount = Object.keys(answers).length;
    const totalQ = test.questions.length;
    const confirmMsg = `You have answered ${answeredCount} of ${totalQ} questions. Are you sure you want to finish and submit the assessment?`;

    if (window.confirm(confirmMsg)) {
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);

    try {
      const timeTaken = test.durationMinutes * 60 - secondsLeft;
      const res = await API.post(`/prep/mock-tests/${id}/submit`, {
        answers,
        timeTakenSeconds: timeTaken,
      });

      if (res.data.success) {
        setResult(res.data.result);
        if (res.data.result.passed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Preparing examination room...</p>
      </div>
    );
  }

  // RESULT SCREEN
  if (result) {
    return (
      <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '3rem 0' }}>
        <div className="container container-narrow">
          <div
            className="card"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: result.passed ? 'var(--accent-green-subtle)' : 'var(--accent-rose-subtle)',
                color: result.passed ? '#047857' : '#9f1239',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              {result.passed ? <CheckCircle2 size={36} /> : <AlertCircle size={36} />}
            </div>

            <span className={`badge ${result.passed ? 'badge-green' : 'badge-rose'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              {result.passed ? 'ASSESSMENT PASSED' : 'NEEDS PRACTICE'}
            </span>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              Your Score: {result.score} / {result.totalMarks} Marks ({result.percentage}%)
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              {result.passed
                ? 'Great job! You met the passing cutoff for this placement diagnostic test.'
                : 'Review your incorrect answers below and practice the topic explanations to improve your speed.'}
            </p>

            {/* Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--accent-green-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>{result.correctCount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46' }}>Correct Answers</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--accent-rose-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#9f1239' }}>{result.wrongCount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#be123c' }}>Incorrect</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>{result.unansweredCount}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Unanswered</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link to="/placement-prep/mock-tests" className="btn btn-outline">
                <ArrowLeft size={16} /> All Mock Tests
              </Link>
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                <RotateCcw size={16} /> Retake Test
              </button>
            </div>
          </div>

          {/* Full Question Breakdown Review */}
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Detailed Answers & Explanations Review
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {result.evaluatedQuestions?.map((eq, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-purple">{eq.topic}</span>
                  {eq.isCorrect ? (
                    <span className="badge badge-green">
                      <CheckCircle2 size={12} /> Correct (+{Math.round(result.totalMarks / result.evaluatedQuestions.length)})
                    </span>
                  ) : eq.selectedOption === null ? (
                    <span className="badge badge-gray">Not Attempted</span>
                  ) : (
                    <span className="badge badge-rose">
                      <XCircle size={12} /> Incorrect
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  {i + 1}. {eq.question}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                  {eq.options.map((opt, optIdx) => {
                    let border = '1px solid var(--border-color)';
                    let bg = 'var(--bg-alt)';
                    let text = 'var(--text-main)';

                    if (optIdx === eq.correctAnswer) {
                      bg = 'var(--accent-green-subtle)';
                      border = '1px solid #10b981';
                      text = '#047857';
                    } else if (optIdx === eq.selectedOption && !eq.isCorrect) {
                      bg = 'var(--accent-rose-subtle)';
                      border = '1px solid #f43f5e';
                      text = '#9f1239';
                    }

                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: bg,
                          border,
                          fontSize: '0.85rem',
                          color: text,
                          fontWeight: optIdx === eq.correctAnswer ? 700 : 500,
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt}
                        {optIdx === eq.correctAnswer && ' ✓ (Correct)'}
                        {optIdx === eq.selectedOption && !eq.isCorrect && ' ✗ (Your choice)'}
                      </div>
                    );
                  })}
                </div>

                {eq.explanation && (
                  <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--highlight-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--highlight-border)' }}>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      Explanation:
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#0c4a6e', lineHeight: 1.5 }}>
                      {eq.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE TEST ROOM
  const currentQ = test.questions[currentQuestionIndex];
  const isTimeRunningLow = secondsLeft <= 180; // 3 mins remaining

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2rem 0' }}>
      <div className="container container-narrow">
        {/* Floating / Sticky Header with Timer */}
        <div
          className="card"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {test.title}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Timer Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: isTimeRunningLow ? 'var(--accent-rose-subtle)' : 'var(--bg-alt)',
                border: `1px solid ${isTimeRunningLow ? '#f43f5e' : 'var(--border-color)'}`,
                color: isTimeRunningLow ? '#e11d48' : 'var(--text-main)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              <Clock size={18} />
              <span>{formatTime(secondsLeft)}</span>
            </div>

            <button
              onClick={handleSubmitClick}
              disabled={submitting}
              className="btn btn-primary btn-sm"
            >
              {submitting ? 'Submitting...' : 'Finish & Submit'}
            </button>
          </div>
        </div>

        {/* Question Navigation Grid */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {test.questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isCurrent = currentQuestionIndex === i;

            return (
              <button
                key={i}
                onClick={() => setCurrentQuestionIndex(i)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  border: isCurrent ? '2px solid var(--highlight)' : '1px solid var(--border-color)',
                  backgroundColor: isAnswered ? 'var(--highlight-subtle)' : '#ffffff',
                  color: isAnswered ? 'var(--highlight)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Active Question Card */}
        {currentQ && (
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-purple">{currentQ.topic || 'General'}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Single Choice MCQ
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {currentQuestionIndex + 1}. {currentQ.question}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              {currentQ.options.map((option, optIdx) => {
                const isSelected = answers[currentQuestionIndex] === optIdx;

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--highlight-subtle)' : 'var(--bg-alt)',
                      border: isSelected ? '2px solid var(--highlight)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      transition: 'var(--transition)',
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? 'var(--highlight)' : '#ffffff',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span style={{ fontSize: '0.925rem', color: 'var(--text-main)' }}>{option}</span>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="btn btn-outline"
              >
                &larr; Previous Question
              </button>

              {currentQuestionIndex < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="btn btn-primary"
                >
                  Next Question &rarr;
                </button>
              ) : (
                <button onClick={handleSubmitClick} className="btn btn-secondary">
                  Complete Assessment &rarr;
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
