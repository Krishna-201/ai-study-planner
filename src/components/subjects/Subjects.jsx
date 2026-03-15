import React, { useState } from 'react';
import {
  Plus, Trash2, Wand2, BookOpen, Calendar,
  Clock, ChevronRight, Loader, X, AlertCircle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useSubjects, useStudyPlans } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import { tasksApi } from '../../lib/api';
import { generateStudySchedule } from '../../lib/aiScheduler';
import './Subjects.css';

const COLORS = ['#4f8ef7','#22d3a0','#a78bfa','#fb923c','#f87171','#fbbf24','#34d399','#60a5fa'];

export default function SubjectsPage() {
  const { user } = useAuth();
  const { subjects, loading, create, update, remove } = useSubjects();
  const { create: createPlan } = useStudyPlans();
  const [showAdd, setShowAdd] = useState(false);
  const [genSubject, setGenSubject] = useState(null);
  const [error, setError] = useState('');

  if (loading) return <div className="page-content"><div className="loading-screen"><div className="spinner"/></div></div>;

  return (
    <div className="page-content subjects-page">
      <div className="page-header">
        <div>
          <h2>Subjects</h2>
          <p className="text-muted">Manage your subjects and generate AI study plans.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {error && <div className="alert-error"><AlertCircle size={16}/>{error}<button onClick={()=>setError('')}><X size={14}/></button></div>}

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><BookOpen size={28}/></div>
          <h3>No subjects yet</h3>
          <p>Add a subject to get started with AI-powered study planning.</p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16}/> Add Your First Subject
          </button>
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onDelete={() => remove(subject.id)}
              onGenerate={() => setGenSubject(subject)}
              onUpdate={update}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddSubjectModal
          onClose={() => setShowAdd(false)}
          onCreate={async (data) => { await create(data); setShowAdd(false); }}
        />
      )}

      {genSubject && (
        <GeneratePlanModal
          subject={genSubject}
          userId={user.id}
          onClose={() => setGenSubject(null)}
          onGenerated={async ({ plan, tasks, summary }) => {
            const newPlan = await createPlan({
              ...plan,
              user_id: user.id,
              subject_id: genSubject.id,
              ai_generated: true,
            });
            await tasksApi.bulkCreate(
              tasks.map((t) => ({
                ...t,
                user_id: user.id,
                subject_id: genSubject.id,
                study_plan_id: newPlan.id,
              }))
            );
            setGenSubject(null);
          }}
          onError={setError}
        />
      )}
    </div>
  );
}

// ── Subject Card ─────────────────────────────────────────
function SubjectCard({ subject, onDelete, onGenerate, onUpdate }) {
  const daysLeft = subject.exam_date
    ? differenceInDays(new Date(subject.exam_date), new Date())
    : null;
  const urgency = daysLeft !== null
    ? daysLeft <= 3 ? 'red' : daysLeft <= 7 ? 'yellow' : 'green'
    : 'blue';

  return (
    <div className="subject-card card">
      <div className="subject-card-top">
        <div className="subject-color-tag" style={{ background: subject.color }} />
        <div className="subject-card-actions">
          <button className="btn btn-ghost btn-sm" onClick={onDelete} title="Delete">
            <Trash2 size={14}/>
          </button>
        </div>
      </div>

      <div className="subject-name">{subject.name}</div>
      {subject.description && <div className="subject-desc">{subject.description}</div>}

      <div className="subject-meta">
        {subject.exam_date && (
          <div className="subject-meta-item">
            <Calendar size={13}/>
            <span>{format(new Date(subject.exam_date), 'MMM d, yyyy')}</span>
            {daysLeft !== null && (
              <span className={`badge badge-${urgency}`}>{daysLeft}d</span>
            )}
          </div>
        )}
        <div className="subject-meta-item">
          <Clock size={13}/>
          <span>{subject.total_hours_required}h required</span>
        </div>
        <div className="subject-meta-item">
          <span className={`badge badge-${subject.priority === 'high' ? 'red' : subject.priority === 'medium' ? 'yellow' : 'blue'}`}>
            {subject.priority} priority
          </span>
        </div>
      </div>

      <button className="btn btn-primary subject-gen-btn" onClick={onGenerate}>
        <Wand2 size={15}/> Generate AI Schedule
        <ChevronRight size={14}/>
      </button>
    </div>
  );
}

// ── Add Subject Modal ────────────────────────────────────
function AddSubjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', description: '', exam_date: '', priority: 'medium',
    total_hours_required: 20, color: COLORS[0],
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onCreate(form); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Add Subject</h3>
          <button className="btn btn-ghost" onClick={onClose}><X size={18}/></button>
        </div>
        <form onSubmit={submit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Subject Name *</label>
            <input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Data Structures" required/>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Brief description or topics to cover"/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Exam Date</label>
              <input type="date" className="form-control" value={form.exam_date} onChange={e=>set('exam_date',e.target.value)} min={new Date().toISOString().split('T')[0]}/>
            </div>
            <div className="form-group">
              <label className="form-label">Hours Required</label>
              <input type="number" className="form-control" value={form.total_hours_required} onChange={e=>set('total_hours_required',+e.target.value)} min={1} max={500}/>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control" value={form.priority} onChange={e=>set('priority',e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {COLORS.map((c) => (
                  <button key={c} type="button"
                    className={`color-dot ${form.color === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => set('color', c)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader size={16} className="spin"/> : <Plus size={16}/>}
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Generate Plan Modal ──────────────────────────────────
function GeneratePlanModal({ subject, onClose, onGenerated, onError }) {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    daily_hours: 2,
    topics: subject.description || '',
    exam_date: subject.exam_date || '',
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummary('');
    try {
      const topicsList = form.topics.split('\n').filter(Boolean);
      const result = await generateStudySchedule({
        subjectName: subject.name,
        examDate: form.exam_date,
        dailyHours: form.daily_hours,
        totalHoursRequired: subject.total_hours_required,
        priority: subject.priority,
        topics: topicsList,
      });
      setSummary(result.summary);
      await onGenerated({
        plan: {
          title: `${subject.name} Study Plan`,
          start_date: today,
          end_date: form.exam_date,
          daily_hours: form.daily_hours,
          status: 'active',
          ai_prompt: `${subject.name} – ${form.daily_hours}h/day until ${form.exam_date}`,
        },
        tasks: result.tasks,
        summary: result.summary,
      });
    } catch (err) {
      onError(err.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <Wand2 size={18} style={{ color: 'var(--accent)' }}/> Generate AI Schedule
          </h3>
          <button className="btn btn-ghost" onClick={onClose}><X size={18}/></button>
        </div>
        <p className="text-muted" style={{marginBottom:20, fontSize:14}}>
          AI will create a personalized daily study plan for <strong>{subject.name}</strong>.
        </p>
        <form onSubmit={generate} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Exam Date *</label>
              <input type="date" className="form-control" value={form.exam_date}
                onChange={e=>set('exam_date',e.target.value)} min={today} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Daily Study Hours</label>
              <input type="number" className="form-control" value={form.daily_hours}
                onChange={e=>set('daily_hours',+e.target.value)} min={0.5} max={12} step={0.5}/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Topics (one per line)</label>
            <textarea className="form-control" rows={5} value={form.topics}
              onChange={e=>set('topics',e.target.value)}
              placeholder={"Chapter 1: Arrays\nChapter 2: Linked Lists\nBig-O Notation\n..."}/>
          </div>
          {loading && (
            <div className="ai-generating">
              <Loader size={18} className="spin"/>
              <span>AI is crafting your personalized schedule…</span>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader size={16} className="spin"/> : <Wand2 size={16}/>}
              {loading ? 'Generating…' : 'Generate Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
