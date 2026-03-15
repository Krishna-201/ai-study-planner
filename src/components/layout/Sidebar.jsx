import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, CalendarDays,
  CheckSquare, TrendingUp, LogOut, BrainCircuit
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/subjects',  icon: BookOpen,         label: 'Subjects'  },
  { to: '/tasks',     icon: CheckSquare,       label: 'Tasks'     },
  { to: '/calendar',  icon: CalendarDays,      label: 'Calendar'  },
  { to: '/progress',  icon: TrendingUp,        label: 'Progress'  },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <BrainCircuit size={20} />
        </div>
        <span className="logo-text">StudyAI</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">
              {user?.user_metadata?.full_name || 'Student'}
            </div>
            <div className="user-email truncate">{user?.email}</div>
          </div>
        </div>
        <button className="btn btn-ghost sign-out-btn" onClick={handleSignOut} title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
