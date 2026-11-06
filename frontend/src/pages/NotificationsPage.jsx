import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const typeIcons = {
  job: Briefcase,
  internship: GraduationCap,
  application: CheckCircle2,
  event: Calendar,
  announcement: Bell,
  system: Info,
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--highlight)', letterSpacing: '0.05em' }}>
            Alerts & Broadcasts
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Notifications
          </h1>
        </div>

        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-outline btn-sm">
            <CheckCircle2 size={14} /> Mark all {unreadCount} as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Bell size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>All caught up!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You have no new notifications.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell;

            return (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  backgroundColor: notif.isRead ? '#ffffff' : 'var(--highlight-subtle)',
                  borderLeft: notif.isRead ? '4px solid var(--border-color)' : '4px solid var(--highlight)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: notif.isRead ? 'var(--bg-alt)' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color="var(--highlight)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: notif.isRead ? 600 : 800, color: 'var(--text-main)' }}>
                        {notif.title}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <span className="badge badge-blue">New</span>
                  )}
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginLeft: '3rem', marginBottom: notif.link ? '0.5rem' : 0 }}>
                  {notif.message}
                </p>

                {notif.link && (
                  <div style={{ marginLeft: '3rem' }}>
                    <Link
                      to={notif.link}
                      style={{
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: 'var(--highlight)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      Take Action <ExternalLink size={12} />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
