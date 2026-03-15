import React, { useState, useMemo } from 'react';
import { format, addDays, subDays, isToday } from 'date-fns';
import {
  ChevronLeft, ChevronRight, CheckCircle2,
  Circle, Clock, Trash2, CalendarDays, Filter
} from 'lucide-react';
import { useTasks } from '../../hooks/useData';
import { progressApi } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import './Tasks.css';

export default function TasksPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterSubject, setFilterSubject] = useState('all');
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { tasks, loading, markComplete, markPending, remove, refetch } = useTasks(dateStr);

  const subjects = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (t.subjects) map[t.subject_id] = t.subjects;
    });
    return Object.entries(map).map(([id, info]) => ({ id, ...info }));
  }, [tasks]);

  const filtered = filterSubject === 'all'
    ? tasks
    : tasks.filter((t) => t.subject_id === filterSubject);

  const completed = filtered.filter((t) => t.status === 'completed').length;
  const pct = filtered.length > 0 ? Math.round((completed / filtered.length) * 100) : 0;

  const handleToggle = async (task) => {
    if (task.status === 'completed') {
      await markPending(task.id);
    } else {
      await markComplete(task.id);
      // Update progress record
      const totalCompleted = tasks.filter((t) => t.status === 'completed').length + 1;
      await progressApi.upsert({
        user_id: user.id,
        subject_id: task.subject_id,
        date: dateStr,
        tasks_completed: totalCompleted,
        tasks_total: tasks.length,
        minutes_studied: tasks
          .filter((t) => t.status === 'completed')
          .reduce((sum, t) => sum + (t.estimated_minutes || 0), 0) + (task.estimated_minutes || 0),
      }).catch(() => {});
    }
  };

  const navDate = (dir) => {
    setSelectedDate((d) => dir === 1 ? addDays(d, 1) : subDays(d, 1));
  };

  return (
    <div className="page-content tasks-page">
      {/* Date navigator */}
      <div className="date-nav">
        <button className="btn btn-ghost" onClick={() => navDate(-1)}>
          <ChevronLeft size={18} />
        </button>
        <div className="date-nav-center">
          <div className="date-nav-main">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
          </div>
          <div className="date-nav-sub">{format(selectedDate, 'MMMM d, yyyy')}</div>
        </div>
        <button className="btn btn-ghost" onClick={() => navDate(1)}>
          <ChevronRight size={18} />
        </button>
        {!isToday(selectedDate) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </button>
        )}
      </div>

      {/* Progress bar */}
      {filtered.length > 0 && (
        <div className="card task-progress-card">
          <div className="task-progress-header">
            <span className="task-progress-label">
              {completed} of {filtered.length} tasks completed
            </span>
            <span className="task-progress-pct">{pct}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {/* Filter */}
      {subjects.length > 1 && (
        <div className="task-filter">
          <Filter size={14} />
          <button
            className={`filter-chip ${filterSubject === 'all' ? 'active' : ''}`}
            onClick={() => setFilterSubject('all')}
          >
            All
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              className={`filter-chip ${filterSubject === s.id ? 'active' : ''}`}
              onClick={() => setFilterSubject(s.id)}
            >
              <span className="filter-dot" style={{ background: s.color }} />
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><CalendarDays size={28} /></div>
          <h3>No tasks for this day</h3>
          <p>Generate a study plan from the Subjects page to populate your schedule.</p>
        </div>
      ) : (
        <div className="task-list">
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggle(task)}
              onDelete={() => remove(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  const done = task.status === 'completed';

  return (
    <div className={`task-item card card-sm ${done ? 'task-done' : ''}`}>
      <button className="task-check-btn" onClick={onToggle} title={done ? 'Mark pending' : 'Mark complete'}>
        {done
          ? <CheckCircle2 size={22} className="check-done" />
          : <Circle size={22} className="check-pending" />
        }
      </button>

      <div className="task-item-body">
        <div className="task-item-title">{task.title}</div>
        {task.description && (
          <div className="task-item-desc">{task.description}</div>
        )}
        <div className="task-item-meta">
          <span
            className="task-subject-badge"
            style={{
              background: `${task.subjects?.color}22`,
              color: task.subjects?.color,
              borderColor: `${task.subjects?.color}44`,
            }}
          >
            {task.subjects?.name}
          </span>
          <span className="task-meta-pill">
            <Clock size={11} /> {task.estimated_minutes}m
          </span>
          {done && task.completed_at && (
            <span className="task-meta-pill done-time">
              ✓ {format(new Date(task.completed_at), 'h:mm a')}
            </span>
          )}
        </div>
      </div>

      <button className="btn btn-ghost btn-sm task-delete" onClick={onDelete} title="Delete task">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
