import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, CheckSquare, Clock, TrendingUp,
  CalendarDays, Flame, Target, ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useSubjects } from '../../hooks/useData';
import { useTasks } from '../../hooks/useData';
import { useProgress } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

function StatCard({ icon: Icon, label, value, sub, color = 'blue' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon"><Icon size={20} /></div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { subjects, loading: sLoad } = useSubjects();
  const { tasks, loading: tLoad } = useTasks(today);
  const { progress } = useProgress(30);

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  const stats = useMemo(() => {
    const completedToday = tasks.filter((t) => t.status === 'completed').length;
    const totalToday = tasks.length;

    const totalMinutes = progress.reduce((sum, p) => sum + (p.minutes_studied || 0), 0);

    // Streak calculation
    let streak = 0;
    const sorted = [...progress].sort((a, b) => b.date.localeCompare(a.date));
    for (const p of sorted) {
      if (p.tasks_completed > 0) streak++;
      else break;
    }

    const upcoming = subjects.filter(
      (s) => s.exam_date && new Date(s.exam_date) >= new Date()
    ).sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));

    return { completedToday, totalToday, totalMinutes, streak, upcoming };
  }, [tasks, progress, subjects]);

  if (sLoad || tLoad) {
    return (
      <div className="page-content">
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const daysMap = {};
  tasks.forEach((t) => {
    daysMap[t.scheduled_date] = (daysMap[t.scheduled_date] || 0) + 1;
  });

  return (
    <div className="page-content dashboard-page">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <div>
          <h2>Good {getTimeOfDay()}, {name} 👋</h2>
          <p className="text-muted">Here's your study overview for today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/subjects')}>
          <BookOpen size={16} /> Add Subject
        </button>
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard icon={BookOpen}    color="blue"   label="Subjects"         value={subjects.length}                                            sub="Active subjects" />
        <StatCard icon={CheckSquare} color="green"  label="Today's Tasks"    value={`${stats.completedToday}/${stats.totalToday}`}              sub="Completed today" />
        <StatCard icon={Clock}       color="purple" label="Hours Studied"    value={`${Math.round(stats.totalMinutes / 60)}h`}                  sub="Past 30 days" />
        <StatCard icon={Flame}       color="orange" label="Study Streak"     value={`${stats.streak}d`}                                         sub="Keep it up!" />
      </div>

      {/* Today's tasks + Upcoming exams */}
      <div className="dashboard-columns">
        {/* Today */}
        <div className="card">
          <div className="card-head">
            <div className="card-head-title">
              <CheckSquare size={18} />
              <span>Today's Tasks</span>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/tasks')}>
              View all <ArrowRight size={14} />
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><CalendarDays size={24} /></div>
              <p>No tasks for today.</p>
              <button className="btn btn-sm btn-secondary" onClick={() => navigate('/subjects')}>
                Generate a plan
              </button>
            </div>
          ) : (
            <div className="task-list-preview">
              {tasks.slice(0, 6).map((task) => (
                <div key={task.id} className={`task-preview-item ${task.status === 'completed' ? 'done' : ''}`}>
                  <div
                    className="task-subject-dot"
                    style={{ background: task.subjects?.color || '#6366f1' }}
                  />
                  <div className="task-preview-info">
                    <div className="task-preview-title">{task.title}</div>
                    <div className="task-preview-meta">
                      {task.subjects?.name} · {task.estimated_minutes}m
                    </div>
                  </div>
                  {task.status === 'completed' && (
                    <div className="task-done-badge">✓</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming exams */}
        <div className="card">
          <div className="card-head">
            <div className="card-head-title">
              <Target size={18} />
              <span>Upcoming Exams</span>
            </div>
            <button className="btn btn-sm btn-ghost" onClick={() => navigate('/subjects')}>
              Manage <ArrowRight size={14} />
            </button>
          </div>

          {stats.upcoming.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Target size={24} /></div>
              <p>No upcoming exams.</p>
            </div>
          ) : (
            <div className="exam-list">
              {stats.upcoming.slice(0, 5).map((s) => {
                const daysLeft = Math.ceil(
                  (new Date(s.exam_date) - new Date()) / (1000 * 60 * 60 * 24)
                );
                const urgency = daysLeft <= 3 ? 'red' : daysLeft <= 7 ? 'yellow' : 'green';
                return (
                  <div key={s.id} className="exam-item">
                    <div className="exam-dot" style={{ background: s.color }} />
                    <div className="exam-info">
                      <div className="exam-name">{s.name}</div>
                      <div className="exam-date">{format(new Date(s.exam_date), 'MMM d, yyyy')}</div>
                    </div>
                    <div className={`badge badge-${urgency}`}>
                      {daysLeft}d left
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress mini chart */}
      {progress.length > 0 && (
        <div className="card">
          <div className="card-head">
            <div className="card-head-title">
              <TrendingUp size={18} />
              <span>Study Activity — Last 30 Days</span>
            </div>
          </div>
          <MiniActivityChart progress={progress} />
        </div>
      )}
    </div>
  );
}

function MiniActivityChart({ progress }) {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const entry = progress.find((p) => p.date === d);
    days.push({ date: d, minutes: entry?.minutes_studied || 0 });
  }
  const max = Math.max(...days.map((d) => d.minutes), 1);

  return (
    <div className="mini-chart">
      {days.map(({ date, minutes }) => (
        <div key={date} className="mini-bar-wrap" title={`${date}: ${minutes}m`}>
          <div
            className="mini-bar"
            style={{ height: `${(minutes / max) * 100}%`, opacity: minutes > 0 ? 1 : 0.2 }}
          />
        </div>
      ))}
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
