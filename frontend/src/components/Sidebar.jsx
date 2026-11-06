import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FileText,
  Award,
  BookOpen,
  Bookmark,
  User,
  Bell,
  ShieldCheck,
  Building2,
  Users,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isAdminSidebar = false }) {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'My Applications', icon: Briefcase },
    { to: '/saved', label: 'Saved Items', icon: Bookmark },
    { to: '/resume-builder', label: 'Resume Builder', icon: FileText },
    { to: '/courses', label: 'Learn Courses (W3Schools)', icon: BookOpen },
    { to: '/career-guidance', label: 'Career Guidance', icon: Compass },
    { to: '/placement-prep', label: 'Placement Prep', icon: Award },
    { to: '/profile', label: 'Profile & Skills', icon: User },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview & Stats', icon: LayoutDashboard },
    { to: '/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/admin/internships', label: 'Manage Internships', icon: GraduationCap },
    { to: '/admin/courses', label: 'Manage Courses', icon: BookOpen },
    { to: '/admin/applications', label: 'All Applications', icon: FileText },
    { to: '/admin/companies', label: 'Companies', icon: Building2 },
    { to: '/admin/students', label: 'Registered Students', icon: Users },
  ];

  const links = isAdminSidebar ? adminLinks : studentLinks;

  return (
    <aside
      className="sidebar no-print"
      style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-color)',
        minHeight: 'calc(100vh - 72px)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <div style={{ padding: '0 0.75rem 1.25rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
          {isAdminSidebar ? 'Admin Management' : 'Student Workspace'}
        </span>
        <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
          {user?.name}
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--highlight)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--highlight-subtle)' : 'transparent',
                transition: 'var(--transition)',
              })}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
