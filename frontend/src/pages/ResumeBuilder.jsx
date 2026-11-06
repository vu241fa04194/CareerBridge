import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  User,
  GraduationCap,
  Award,
  Briefcase,
  Layout,
} from 'lucide-react';
import API from '../services/api';
import ResumePreview from '../components/ResumePreview';
import { useAuth } from '../context/AuthContext';

export default function ResumeBuilder() {
  const { user, profile, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); // personal, education, skills, projects, experience, extra
  const [template, setTemplate] = useState('modern'); // modern, classic, minimalist
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Resume form state
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      github: '',
      portfolio: '',
    },
    careerObjective: '',
    education: [],
    technicalSkills: [],
    projects: [],
    internships: [],
    certifications: [],
    achievements: [],
    selectedTemplate: 'modern',
  });

  const [skillInput, setSkillInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  // Fetch student's existing resume
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get('/resumes/my');
        if (res.data.success && res.data.resume) {
          setResumeData(res.data.resume);
          if (res.data.resume.selectedTemplate) {
            setTemplate(res.data.resume.selectedTemplate);
          }
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResume();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Handle Save
  const handleSave = async () => {
    setSaving(true);
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await API.post('/resumes/my', {
        ...resumeData,
        selectedTemplate: template,
      });
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: 'Resume saved and synced successfully!' });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save resume.' });
    } finally {
      setSaving(false);
    }
  };

  // Print as PDF
  const handleDownloadPDF = () => {
    window.print();
  };

  // Add / Remove Handlers for Education
  const handleAddEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { institution: '', degree: 'B.Tech', fieldOfStudy: '', startYear: '2022', endYear: '2026', score: '' },
      ],
    });
  };

  const handleRemoveEducation = (index) => {
    const updated = [...resumeData.education];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, education: updated });
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...resumeData.education];
    updated[index][field] = value;
    setResumeData({ ...resumeData, education: updated });
  };

  // Skill Add / Remove
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!skillInput.trim()) return;
      if (!resumeData.technicalSkills.includes(skillInput.trim())) {
        setResumeData({
          ...resumeData,
          technicalSkills: [...resumeData.technicalSkills, skillInput.trim()],
        });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setResumeData({
      ...resumeData,
      technicalSkills: resumeData.technicalSkills.filter((s) => s !== skill),
    });
  };

  // Project Add / Remove
  const handleAddProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { title: '', technologies: ['React'], description: '', link: '' },
      ],
    });
  };

  const handleRemoveProject = (index) => {
    const updated = [...resumeData.projects];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, projects: updated });
  };

  const handleProjectChange = (index, field, value) => {
    const updated = [...resumeData.projects];
    if (field === 'technologies') {
      updated[index][field] = value.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      updated[index][field] = value;
    }
    setResumeData({ ...resumeData, projects: updated });
  };

  // Internship Add / Remove
  const handleAddInternship = () => {
    setResumeData({
      ...resumeData,
      internships: [
        ...resumeData.internships,
        { company: '', role: '', duration: '', description: '' },
      ],
    });
  };

  const handleRemoveInternship = (index) => {
    const updated = [...resumeData.internships];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, internships: updated });
  };

  const handleInternshipChange = (index, field, value) => {
    const updated = [...resumeData.internships];
    updated[index][field] = value;
    setResumeData({ ...resumeData, internships: updated });
  };

  // Certification Add / Remove
  const handleAddCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        { name: '', issuer: '', year: new Date().getFullYear().toString(), link: '' },
      ],
    });
  };

  const handleRemoveCertification = (index) => {
    const updated = [...resumeData.certifications];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, certifications: updated });
  };

  const handleCertificationChange = (index, field, value) => {
    const updated = [...resumeData.certifications];
    updated[index][field] = value;
    setResumeData({ ...resumeData, certifications: updated });
  };

  // Achievement Add / Remove
  const handleAddAchievement = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!achievementInput.trim()) return;
      setResumeData({
        ...resumeData,
        achievements: [...resumeData.achievements, achievementInput.trim()],
      });
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (index) => {
    const updated = [...resumeData.achievements];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, achievements: updated });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--highlight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your resume builder...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: 'calc(100vh - 72px)', padding: '2rem 0' }}>
      <div className="container">
        {/* Top Header Actions (Hidden in Print) */}
        <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-purple">
                <FileText size={12} /> ATS-Friendly Resume Builder
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Interactive Resume Builder
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Edit your qualifications live, switch templates, and download vector PDF.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Template Selector */}
            <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#ffffff', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setTemplate('modern')}
                className={`btn btn-sm ${template === 'modern' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Modern
              </button>
              <button
                type="button"
                onClick={() => setTemplate('classic')}
                className={`btn btn-sm ${template === 'classic' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Classic
              </button>
              <button
                type="button"
                onClick={() => setTemplate('minimalist')}
                className={`btn btn-sm ${template === 'minimalist' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Minimalist
              </button>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn btn-outline-primary">
              <Save size={16} /> {saving ? 'Saving...' : 'Save & Sync'}
            </button>

            <button onClick={handleDownloadPDF} className="btn btn-secondary">
              <Download size={16} /> Download as PDF
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage.text && (
          <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-danger'} no-print`}>
            {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Split Grid: Editor (Left) & Live Preview (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem', alignItems: 'flex-start' }} className="builder-layout">
          {/* Left Column: Form Editor (No-Print) */}
          <div className="card no-print" style={{ padding: '1.75rem' }}>
            {/* Navigation Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setActiveTab('personal')}
                className={`btn btn-sm ${activeTab === 'personal' ? 'btn-primary' : 'btn-ghost'}`}
              >
                <User size={14} /> Personal Details
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`btn btn-sm ${activeTab === 'education' ? 'btn-primary' : 'btn-ghost'}`}
              >
                <GraduationCap size={14} /> Education
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`btn btn-sm ${activeTab === 'skills' ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Award size={14} /> Skills
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-ghost'}`}
              >
                <FileText size={14} /> Projects
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`btn btn-sm ${activeTab === 'experience' ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Briefcase size={14} /> Internships
              </button>
              <button
                onClick={() => setActiveTab('extra')}
                className={`btn btn-sm ${activeTab === 'extra' ? 'btn-primary' : 'btn-ghost'}`}
              >
                Certifications & Achievements
              </button>
            </div>

            {/* TAB 1: Personal Details */}
            {activeTab === 'personal' && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  Personal Information & Contacts
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, fullName: e.target.value },
                        })
                      }
                      placeholder="Alex Sharma"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={resumeData.personalInfo.email}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                        })
                      }
                      placeholder="alex.sharma@gmail.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                        })
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City, State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personalInfo.location}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                        })
                      }
                      placeholder="Bengaluru, Karnataka"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personalInfo.linkedIn}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedIn: e.target.value },
                        })
                      }
                      placeholder="linkedin.com/in/alex-sharma"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resumeData.personalInfo.github}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, github: e.target.value },
                        })
                      }
                      placeholder="github.com/alex-sharma-dev"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Career Objective / Professional Summary</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={resumeData.careerObjective}
                    onChange={(e) => setResumeData({ ...resumeData, careerObjective: e.target.value })}
                    placeholder="Results-driven engineering student with solid foundation in Data Structures, Full-Stack React/Node.js..."
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Education */}
            {activeTab === 'education' && (
              <div>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Educational Qualifications
                  </h3>
                  <button onClick={handleAddEducation} className="btn btn-outline-primary btn-sm">
                    <Plus size={14} /> Add Education
                  </button>
                </div>

                {resumeData.education.map((edu, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="form-group">
                      <label className="form-label">Institution / College Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                        placeholder="National Institute of Technology (NIT)"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Degree</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                          placeholder="B.Tech"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Field of Study</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.fieldOfStudy}
                          onChange={(e) => handleEducationChange(idx, 'fieldOfStudy', e.target.value)}
                          placeholder="Computer Science & Engineering"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Start Year</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.startYear}
                          onChange={(e) => handleEducationChange(idx, 'startYear', e.target.value)}
                          placeholder="2022"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Year</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.endYear}
                          onChange={(e) => handleEducationChange(idx, 'endYear', e.target.value)}
                          placeholder="2026"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Score / CGPA</label>
                        <input
                          type="text"
                          className="form-control"
                          value={edu.score}
                          onChange={(e) => handleEducationChange(idx, 'score', e.target.value)}
                          placeholder="8.8 CGPA"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {resumeData.education.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No educational entries added yet. Click "+ Add Education" above.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Skills */}
            {activeTab === 'skills' && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  Technical Skills
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type skill & press Enter (e.g. React.js, Python, MongoDB)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                  />
                  <button type="button" onClick={handleAddSkill} className="btn btn-primary">
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '100px', padding: '1rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
                  {resumeData.technicalSkills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                      }}
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {resumeData.technicalSkills.length === 0 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      No skills added yet. Type a skill above and press Add!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Projects */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Technical Projects
                  </h3>
                  <button onClick={handleAddProject} className="btn btn-outline-primary btn-sm">
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <button
                      onClick={() => handleRemoveProject(idx)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="form-group">
                      <label className="form-label">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={proj.title}
                        onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                        placeholder="CareerBridge – Student Career Portal"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Technologies Used (Comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={proj.technologies?.join(', ') || ''}
                        onChange={(e) => handleProjectChange(idx, 'technologies', e.target.value)}
                        placeholder="React.js, Node.js, Express, MongoDB"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Project Description</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={proj.description}
                        onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                        placeholder="Designed and implemented full-stack platform with JWT authentication..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Project / GitHub Link (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={proj.link}
                        onChange={(e) => handleProjectChange(idx, 'link', e.target.value)}
                        placeholder="https://github.com/alex-sharma/careerbridge"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Internships */}
            {activeTab === 'experience' && (
              <div>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Internships & Practical Experience
                  </h3>
                  <button onClick={handleAddInternship} className="btn btn-outline-primary btn-sm">
                    <Plus size={14} /> Add Internship
                  </button>
                </div>

                {resumeData.internships.map((exp, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', position: 'relative' }}>
                    <button
                      onClick={() => handleRemoveInternship(idx)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={exp.company}
                          onChange={(e) => handleInternshipChange(idx, 'company', e.target.value)}
                          placeholder="Google / Startup"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Role / Designation</label>
                        <input
                          type="text"
                          className="form-control"
                          value={exp.role}
                          onChange={(e) => handleInternshipChange(idx, 'role', e.target.value)}
                          placeholder="Software Engineering Intern"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duration (e.g. May 2025 - July 2025)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={exp.duration}
                        onChange={(e) => handleInternshipChange(idx, 'duration', e.target.value)}
                        placeholder="May 2025 - July 2025"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Key Contributions & Learnings</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={exp.description}
                        onChange={(e) => handleInternshipChange(idx, 'description', e.target.value)}
                        placeholder="Refactored database query layer reducing latency by 20%..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: Certifications & Achievements */}
            {activeTab === 'extra' && (
              <div>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Certifications
                  </h3>
                  <button onClick={handleAddCertification} className="btn btn-outline-primary btn-sm">
                    <Plus size={14} /> Add Certification
                  </button>
                </div>

                {resumeData.certifications.map((c, idx) => (
                  <div key={idx} style={{ padding: '1rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Certification Name (e.g. AWS Certified Practitioner)"
                      value={c.name}
                      onChange={(e) => handleCertificationChange(idx, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Issuer (e.g. Amazon Web Services)"
                      value={c.issuer}
                      onChange={(e) => handleCertificationChange(idx, 'issuer', e.target.value)}
                    />
                    <button onClick={() => handleRemoveCertification(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '1.5rem 0 0.75rem', color: 'var(--text-main)' }}>
                  Honors & Achievements
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type achievement and press Add (e.g. Winner Smart India Hackathon 2025)..."
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={handleAddAchievement}
                  />
                  <button type="button" onClick={handleAddAchievement} className="btn btn-primary">
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {resumeData.achievements.map((ach, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '0.85rem' }}>• {ach}</span>
                      <button onClick={() => handleRemoveAchievement(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Resume Preview (Printable) */}
          <div style={{ position: 'sticky', top: '90px' }} className="preview-pane">
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                <Eye size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Live ATS Resume Preview ({template})
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-updates as you type</span>
            </div>

            <ResumePreview resumeData={resumeData} template={template} />
          </div>
        </div>

        {/* Responsive CSS */}
        <style>{`
          @media (max-width: 1024px) {
            .builder-layout {
              grid-template-columns: 1fr !important;
            }
            .preview-pane {
              position: static !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
