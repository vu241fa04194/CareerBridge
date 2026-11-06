import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  Star,
  Compass,
} from 'lucide-react';
import API from '../services/api';
import JobCard from '../components/JobCard';
import InternshipCard from '../components/InternshipCard';
import CompanyCard from '../components/CompanyCard';

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [jobsRes, internsRes, compsRes, coursesRes] = await Promise.all([
          API.get('/jobs?limit=4'),
          API.get('/internships?limit=4'),
          API.get('/companies'),
          API.get('/courses?limit=4'),
        ]);

        if (jobsRes.data.success) setFeaturedJobs(jobsRes.data.jobs.slice(0, 3));
        if (internsRes.data.success) setFeaturedInternships(internsRes.data.internships.slice(0, 3));
        if (compsRes.data.success) setFeaturedCompanies(compsRes.data.companies.slice(0, 6));
        if (coursesRes.data.success) setCourses(coursesRes.data.courses.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '5.5rem 0 4.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background glow spheres */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#38bdf8',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={14} /> The Complete Student Career & Placement Gateway
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Build Your Future With{' '}
              <span className="text-gradient-sky">CareerBridge</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                marginBottom: '2.25rem',
                maxWidth: '680px',
                margin: '0 auto 2.25rem',
              }}
            >
              Connecting Students to Their Future. Explore verified full-time jobs, summer internships, build ATS-ready resumes, and master placement tests with curated learning paths.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '3rem',
              }}
            >
              <Link to="/jobs" className="btn btn-secondary btn-lg">
                <Briefcase size={20} /> Explore Jobs
              </Link>
              <Link to="/internships" className="btn btn-primary btn-lg" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                <GraduationCap size={20} color="#38bdf8" /> Explore Internships
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>500+</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Partner Companies</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a855f7' }}>12,000+</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Students Placed</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>₹28 LPA</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Top Package Offered</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>98%</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Test Pass Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Shelf */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
              Top Recruiters
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
              Leading Enterprises Hiring On CareerBridge
            </h2>
          </div>

          <div className="grid-cols-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {featuredCompanies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/companies" className="btn btn-outline" style={{ fontWeight: 600 }}>
              Browse All Companies <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Career Opportunities (Jobs & Internships) */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
                Latest Postings
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                Popular Job Opportunities
              </h2>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary">
              View All Jobs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-cols-auto" style={{ marginBottom: '3.5rem' }}>
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* Internships Row */}
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
                Gain Practical Experience
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                Featured Summer & Winter Internships
              </h2>
            </div>
            <Link to="/internships" className="btn btn-outline-primary">
              View All Internships <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-cols-auto">
            {featuredInternships.map((intern) => (
              <InternshipCard key={intern._id} internship={intern} />
            ))}
          </div>
        </div>
      </section>

      {/* Subject-Wise Learning & W3Schools Tutorials Highlight */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '750px', margin: '0 auto 3rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
              Subject-Wise Learning & W3Schools Tutorials
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              Official W3Schools Tutorials & Career Guidance
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Master 17+ official tutorial subjects across Programming Languages, Web Development, Database Management, and Other Technical Subjects. Analyze your skill gaps and track your progress in MongoDB.
            </p>
          </div>

          <div className="grid-cols-auto" style={{ marginBottom: '2.5rem' }}>
            {courses.map((course) => (
              <div key={course._id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <span className="badge badge-purple">{course.category}</span>
                  <span className="badge badge-blue">{course.difficulty}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  <Link to="/courses" style={{ color: 'inherit' }}>
                    {course.title}
                  </Link>
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                  {course.description}
                </p>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {course.duration || 'Self-Paced'} • ★ {course.rating || 4.9}
                  </span>
                  {course.tutorialUrl ? (
                    <a
                      href={course.tutorialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--highlight)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      Start W3Schools &rarr;
                    </a>
                  ) : (
                    <Link to="/courses" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--highlight)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      Learn &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary btn-lg">
              <BookOpen size={18} /> Explore All 17+ W3Schools Subjects
            </Link>
            <Link to="/career-guidance" className="btn btn-secondary btn-lg">
              <Compass size={18} /> Career Guidance & Skill Gap Analyzer
            </Link>
          </div>
        </div>
      </section>

      {/* Placement Preparation Module Highlight */}
      <section
        style={{
          padding: '4.5rem 0',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '750px', margin: '0 auto 3rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
              Campus Placement Preparation
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              Everything You Need To Clear Campus Selection
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Practice real questions asked by TCS, Infosys, Amazon, Microsoft, and Google across Aptitude, Core CS rounds, HR interviews, and Diagnostic Mock Tests.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {/* Box 1 */}
            <div className="card card-interactive" style={{ textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--highlight-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Target size={24} color="var(--highlight)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Aptitude Practice</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Master Quantitative Aptitude, Logical Reasoning, and Verbal Ability with step-by-step formula explanations and speed shortcuts.
              </p>
              <Link to="/placement-prep/aptitude" className="btn btn-outline btn-sm">
                Practice Aptitude &rarr;
              </Link>
            </div>

            {/* Box 2 */}
            <div className="card card-interactive" style={{ textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <TrendingUp size={24} color="var(--secondary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Technical Q&A</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Curated technical questions with code samples in Java, Python, C, Data Structures, DBMS, and Operating Systems.
              </p>
              <Link to="/placement-prep/technical" className="btn btn-outline btn-sm">
                Technical Rounds &rarr;
              </Link>
            </div>

            {/* Box 3 */}
            <div className="card card-interactive" style={{ textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Users size={24} color="#f59e0b" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. HR Interview & Tips</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Master the STAR technique, salary expectations, behavioral conflict scenarios, and sample candidate answers.
              </p>
              <Link to="/placement-prep/hr" className="btn btn-outline btn-sm">
                HR Interview Prep &rarr;
              </Link>
            </div>

            {/* Box 4 */}
            <div className="card card-interactive" style={{ textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Award size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>4. Online Mock Tests</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Timed online assessments matching the exact duration and negative marking of MNC campus hiring drives.
              </p>
              <Link to="/placement-prep/mock-tests" className="btn btn-outline btn-sm">
                Take Mock Test &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Resume Builder CTA Banner */}
      <section style={{ padding: '4rem 0', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(124, 58, 237, 0.4))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem',
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <span className="badge badge-blue" style={{ marginBottom: '1rem' }}>
                ATS-Optimized Resumes
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                Craft Your Winning Student Resume in Minutes
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Enter your education, projects, skills, certifications, and achievements. Preview live, choose from professional templates, and download instant print-ready PDFs.
              </p>
              <Link to="/resume-builder" className="btn btn-secondary btn-lg">
                Launch Resume Builder <ArrowRight size={18} />
              </Link>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: '180px',
                  height: '240px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ height: '14px', width: '60%', backgroundColor: '#0f172a', borderRadius: '4px' }} />
                <div style={{ height: '8px', width: '90%', backgroundColor: '#e2e8f0', borderRadius: '3px' }} />
                <div style={{ height: '8px', width: '75%', backgroundColor: '#e2e8f0', borderRadius: '3px' }} />
                <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.35rem 0' }} />
                <div style={{ height: '10px', width: '40%', backgroundColor: '#7c3aed', borderRadius: '3px' }} />
                <div style={{ height: '6px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '2px' }} />
                <div style={{ height: '6px', width: '95%', backgroundColor: '#f1f5f9', borderRadius: '2px' }} />
                <div style={{ height: '6px', width: '80%', backgroundColor: '#f1f5f9', borderRadius: '2px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
              Student Success Stories
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
              Placed at Dream Companies
            </h2>
          </div>

          <div className="grid-cols-auto">
            {/* Testimonial 1 */}
            <div className="card">
              <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                "The mock tests and aptitude practice questions were identical to the online assessment format used in my Google interview. CareerBridge made my preparation structured and stress-free."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Rhea Sen</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--highlight)', fontWeight: 600 }}>Placed at Google (SDE-1)</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="card">
              <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                "I used the interactive Resume Builder to design an ATS-friendly single-page CV. Within 3 weeks, I got shortlisted for Razorpay’s full-time software engineering role!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Kunal Verma</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>Placed at Razorpay (Full Stack Dev)</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="card">
              <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                "The application tracking system let me track my status from 'Under Review' to 'Interview Scheduled'. The transparent updates gave me confidence throughout the drive."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Ananya Roy</h4>
                  <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Placed at Microsoft (Cloud Engineer)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
