import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Code2,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function PlacementPrep() {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--highlight-subtle)', color: 'var(--highlight)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Comprehensive Placement Portal
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Master Every Round of Campus Hiring
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            From initial online aptitude screening to core engineering technical rounds and final HR behavioral interviews, CareerBridge gives you the exact questions and mock evaluations needed to succeed.
          </p>
        </div>

        {/* 4 Feature Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {/* Card 1: Aptitude */}
          <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--highlight-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Target size={28} color="var(--highlight)" />
            </div>
            <span className="badge badge-blue" style={{ width: 'fit-content', marginBottom: '0.65rem' }}>
              Round 1 Screening
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Aptitude Practice
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
              Solve targeted practice questions in Quantitative Aptitude, Logical Reasoning, and Verbal Ability with step-by-step formula derivations.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Quantitative (Time-Work, Percentages, Speed)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Logical Reasoning (Series, Blood Relations)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Verbal Ability (Synonyms, Error Spotting)
              </li>
            </ul>
            <Link to="/placement-prep/aptitude" className="btn btn-primary" style={{ width: '100%' }}>
              Start Aptitude Practice <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2: Technical Interview */}
          <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Code2 size={28} color="var(--secondary)" />
            </div>
            <span className="badge badge-purple" style={{ width: 'fit-content', marginBottom: '0.65rem' }}>
              Round 2 Technical
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Technical Interview Q&A
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
              Core Computer Science interview questions asked by top Tier-1 MNCs with clean code explanations and complexity analyses.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Java, Python & C Core Syntax
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Data Structures & Algorithms
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> DBMS (ACID, Normalization) & OS
              </li>
            </ul>
            <Link to="/placement-prep/technical" className="btn btn-secondary" style={{ width: '100%' }}>
              Explore Technical Q&A <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 3: HR Interview */}
          <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Users size={28} color="#f59e0b" />
            </div>
            <span className="badge badge-amber" style={{ width: 'fit-content', marginBottom: '0.65rem' }}>
              Final HR Round
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              HR Interview & Tips
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
              Common behavioral questions, sample high-impact candidate answers, what recruiters look for, and key Dos & Don'ts.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> "Tell me about yourself" Framework
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Handling Conflict via STAR method
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> 5-Year Goals & Salary Discussions
              </li>
            </ul>
            <Link to="/placement-prep/hr" className="btn btn-outline" style={{ width: '100%', borderColor: '#f59e0b', color: '#b45309' }}>
              HR Interview Guide <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 4: Mock Tests */}
          <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={28} color="#10b981" />
            </div>
            <span className="badge badge-green" style={{ width: 'fit-content', marginBottom: '0.65rem' }}>
              Simulated Exam
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Diagnostic Mock Tests
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
              Real-time online tests with timer countdown, score calculation, instant pass/fail verdict, and full answer review explanations.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Countdown Timer & Question Grid
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Instant Score & Accuracy Breakdown
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={14} color="#10b981" /> Performance History Tracking
              </li>
            </ul>
            <Link to="/placement-prep/mock-tests" className="btn btn-outline" style={{ width: '100%', borderColor: '#10b981', color: '#047857' }}>
              View Mock Tests <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
