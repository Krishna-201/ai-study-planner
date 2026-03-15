import React, { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Clock, CheckSquare, BookOpen } from 'lucide-react';
import { useProgress, useSubjects, useTasks } from '../../hooks/useData';
import './Progress.css';

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '13px',
};

export default function ProgressPage() {
  const { progress, loading } = useProgress(30);
  const { subjects } = useSubjects();
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const totalMinutes = progress.reduce((s, p) => s + (p.minutes_studied || 0), 0);
    const totalCompleted = progress.reduce((s, p) => s + (p.tasks_completed || 0), 0);
    const studyDays = new Set(progress.filter(p => p.minutes_studied > 0).map(p => p.date)).size;

    // Streak
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const entry = progress.find(p => p.date === d);
      if (entry?.tasks_completed > 0) streak++;
      else break;
    }

    // All tasks stats
    const allCompleted = tasks.filter(t => t.status === 'completed').length;
    const allTotal     = tasks.length;

    return { totalMinutes, totalCompleted, studyDays, streak, allCompleted, allTotal };
  }, [progress, tasks]);

  // Daily chart data (last 14 days)
  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 13), end: new Date() });
    return days.map(d => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const entries = progress.filter(p => p.date === dateStr);
      return {
        date: format(d, 'MMM d'),
        minutes: entries.reduce((s, p) => s + (p.minutes_studied || 0), 0),
        tasks: entries.reduce((s, p) => s + (p.tasks_completed || 0), 0),
      };
    });
  }, [progress]);

  // Per-subject progress
  const subjectStats = useMemo(() => {
    return subjects.map(s => {
      const subjectTasks = tasks.filter(t => t.subject_id === s.id);
      const completed    = subjectTasks.filter(t => t.status === 'completed').length;
      const total        = subjectTasks.length;
      const minutes      = progress.filter(p => p.subject_id === s.id).reduce((sum, p) => sum + (p.minutes_studied || 0), 0);
      const pct          = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...s, completed, total, minutes, pct };
    }).sort((a, b) => b.pct - a.pct);
  }, [subjects, tasks, progress]);

  if (loading) {
    return <div className="page-content"><div className="loading-screen"><div className="spinner"/></div></div>;
  }

  return (
    <div className="page-content progress-page">
      {/* Summary stats */}
      <div className="progress-stats">
        <StatTile icon={Clock}       label="Total Study Time"  value={`${Math.round(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`} color="blue" />
        <StatTile icon={CheckSquare} label="Tasks Completed"   value={`${stats.allCompleted}/${stats.allTotal}`} color="green" />
        <StatTile icon={TrendingUp}  label="Active Days (30d)" value={`${stats.studyDays} days`} color="purple" />
        <StatTile icon={BookOpen}    label="Current Streak"    value={`${stats.streak} days`} color="orange" />
      </div>

      {/* Charts row */}
      <div className="charts-row">
        {/* Study minutes area chart */}
        <div className="card chart-card">
          <h3 className="chart-title">Study Minutes — Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f8ef7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'var(--border-light)' }} />
              <Area type="monotone" dataKey="minutes" stroke="#4f8ef7" strokeWidth={2} fill="url(#blueGrad)" dot={false} name="Minutes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks bar chart */}
        <div className="card chart-card">
          <h3 className="chart-title">Tasks Completed — Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="tasks" fill="#22d3a0" radius={[3, 3, 0, 0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-subject progress */}
      <div className="card">
        <h3 className="chart-title" style={{ marginBottom: 20 }}>Subject Progress</h3>
        {subjectStats.length === 0 ? (
          <div className="empty-state"><p>Add subjects and complete tasks to see progress.</p></div>
        ) : (
          <div className="subject-progress-list">
            {subjectStats.map(s => (
              <div key={s.id} className="subject-progress-row">
                <div className="sp-info">
                  <div className="sp-dot" style={{ background: s.color }} />
                  <div className="sp-name">{s.name}</div>
                  <div className="sp-meta">{s.completed}/{s.total} tasks · {Math.round(s.minutes / 60)}h studied</div>
                </div>
                <div className="sp-bar-wrap">
                  <div className="progress-bar-wrap" style={{ flex: 1 }}>
                    <div className="progress-bar-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                  <span className="sp-pct">{s.pct}%</span>
                </div>
                {s.exam_date && (
                  <div className="sp-exam">
                    Exam: {format(new Date(s.exam_date), 'MMM d')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, color }) {
  return (
    <div className={`progress-stat-tile stat-${color}`}>
      <div className="stat-icon"><Icon size={18} /></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
