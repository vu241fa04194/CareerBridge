import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public & Student Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import CompanyDirectory from './pages/CompanyDirectory';
import CompanyDetails from './pages/CompanyDetails';
import SkillDevelopment from './pages/SkillDevelopment';
import LearnCourses from './pages/LearnCourses';
import CareerGuidance from './pages/CareerGuidance';
import CourseDetails from './pages/CourseDetails';
import PlacementPrep from './pages/PlacementPrep';
import AptitudePractice from './pages/AptitudePractice';
import TechnicalInterview from './pages/TechnicalInterview';
import HRInterview from './pages/HRInterview';
import MockTestList from './pages/MockTestList';
import MockTestRunner from './pages/MockTestRunner';
import ResumeBuilder from './pages/ResumeBuilder';

// Student Dashboard Routes
import StudentDashboard from './pages/StudentDashboard';
import ApplicationsTracker from './pages/ApplicationsTracker';
import SavedOpportunities from './pages/SavedOpportunities';
import StudentProfile from './pages/StudentProfile';
import NotificationsPage from './pages/NotificationsPage';

// Admin Routes
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminInternships from './pages/AdminInternships';
import AdminApplications from './pages/AdminApplications';
import AdminCompanies from './pages/AdminCompanies';
import AdminStudents from './pages/AdminStudents';
import AdminCourses from './pages/AdminCourses';

import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Main Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Jobs & Internships */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />

        {/* Companies */}
        <Route path="/companies" element={<CompanyDirectory />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />

        {/* Subject-Wise Learning & W3Schools Tutorials */}
        <Route path="/courses" element={<LearnCourses />} />
        <Route path="/skills" element={<LearnCourses />} />
        <Route path="/skills/:id" element={<CourseDetails />} />

        {/* Career Guidance & Skill Gap Analyzer */}
        <Route path="/career-guidance" element={<CareerGuidance />} />

        {/* Placement Preparation */}
        <Route path="/placement-prep" element={<PlacementPrep />} />
        <Route path="/placement-prep/aptitude" element={<AptitudePractice />} />
        <Route path="/placement-prep/technical" element={<TechnicalInterview />} />
        <Route path="/placement-prep/hr" element={<HRInterview />} />
        <Route path="/placement-prep/mock-tests" element={<MockTestList />} />
        <Route path="/placement-prep/mock-tests/:id" element={<MockTestRunner />} />

        {/* Resume Builder */}
        <Route path="/resume-builder" element={<ResumeBuilder />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Protected Student Dashboard Layout */}
      <Route element={<DashboardLayout requireAdmin={false} />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/applications" element={<ApplicationsTracker />} />
        <Route path="/saved" element={<SavedOpportunities />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Protected Admin Dashboard Layout */}
      <Route element={<DashboardLayout requireAdmin={true} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/internships" element={<AdminInternships />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
      </Route>
    </Routes>
  );
}
