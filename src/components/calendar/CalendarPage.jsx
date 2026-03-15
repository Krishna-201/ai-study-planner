import React, { useState, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, isSameDay, addMonths, subMonths,
  getDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { tasksApi } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import './Calendar.css';

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [dayTasks, setDayTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);

  // Load month tasks once
  React.useEffect(() => {
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const end   = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
    setLoading(true);
    tasksApi.getByDateRange(user.id, start, end)
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [currentMonth, user.id]);

  // Load selected day tasks
  React.useEffect(() => {
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    setLoadingDay(true);
    tasksApi.getByDate(user.id, dateStr)
      .then(setDayTasks)
      .finally(() => setLoadingDay(false));
  }, [selectedDay, user.id]);

  // Map date → tasks
  const taskMap = useMemo(() => {
    const m = {};
    tasks.forEach((t) => {
      if (!m[t.scheduled_date]) m[t.scheduled_date] = [];
      m[t.scheduled_date].push(t);
    });
    return m;
  }, [tasks]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end:   endOfMonth(currentMonth),
  });

  const startPad = getDay(days[0]); // 0=Sun offset

  return (
    <div className="page-content calendar-page">
      <div className="calendar-layout">
        {/* Calendar grid */}
        <div className="calendar-main card">
          {/* Month navigation */}
          <div className="cal-nav">
            <button className="btn btn-ghost" onClick={() => setCurrentMonth(m => subMonths(m, 1))}>
              <ChevronLeft size={18} />
            </button>
            <h3 className="cal-month-title">{format(currentMonth, 'MMMM yyyy')}</h3>
            <button className="btn btn-ghost" onClick={() => setCurrentMonth(m => addMonths(m, 1))}>
              <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setCurrentMonth(new Date()); setSelectedDay(new Date()); }}>
              Today
            </button>
          </div>

          {/* Day headers */}
          <div className="cal-grid-header">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="cal-grid" style={{ opacity: loading ? 0.5 : 1 }}>
            {/* Offset padding */}
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} className="cal-cell empty" />
            ))}

            {days.map((day) => {
              const dateStr  = format(day, 'yyyy-MM-dd');
              const dayTasks = taskMap[dateStr] || [];
              const completed = dayTasks.filter(t => t.status === 'completed').length;
              const isSelected = isSameDay(day, selectedDay);
              const today = isToday(day);
              const pct = dayTasks.length > 0 ? completed / dayTasks.length : 0;

              // Unique subject colors for dots
              const colors = [...new Set(dayTasks.map(t => t.subjects?.color).filter(Boolean))].slice(0, 4);

              return (
                <div
                  key={dateStr}
                  className={`cal-cell ${today ? 'today' : ''} ${isSelected ? 'selected' : ''} ${!isSameMonth(day, currentMonth) ? 'other-month' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div className="cal-day-num">{format(day, 'd')}</div>
                  {dayTasks.length > 0 && (
                    <>
                      <div className="cal-task-dots">
                        {colors.map((c, i) => (
                          <span key={i} className="cal-dot" style={{ background: c }} />
                        ))}
                      </div>
                      <div className="cal-day-bar">
                        <div className="cal-day-bar-fill" style={{ width: `${pct * 100}%` }} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        <div className="calendar-sidebar card">
          <h4 className="cal-detail-date">
            {isToday(selectedDay) ? 'Today — ' : ''}{format(selectedDay, 'EEEE, MMM d')}
          </h4>

          {loadingDay ? (
            <div className="cal-loading"><div className="spinner" /></div>
          ) : dayTasks.length === 0 ? (
            <div className="cal-empty">
              <p>No tasks scheduled for this day.</p>
            </div>
          ) : (
            <div className="cal-task-list">
              {dayTasks.map((task) => (
                <div key={task.id} className={`cal-task-item ${task.status === 'completed' ? 'done' : ''}`}>
                  <div className="cal-task-dot" style={{ background: task.subjects?.color || '#4f8ef7' }} />
                  <div className="cal-task-body">
                    <div className="cal-task-title">{task.title}</div>
                    <div className="cal-task-meta">
                      {task.subjects?.name} · {task.estimated_minutes}m
                    </div>
                  </div>
                  {task.status === 'completed' && <span className="cal-done-badge">✓</span>}
                </div>
              ))}
              <div className="cal-day-summary">
                {dayTasks.filter(t => t.status === 'completed').length}/{dayTasks.length} completed ·{' '}
                {dayTasks.reduce((s, t) => s + (t.estimated_minutes || 0), 0)}m total
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
