import { useState, useEffect, useCallback } from 'react';
import { subjectsApi, tasksApi, progressApi, studyPlansApi } from '../lib/api';
import { useAuth } from './useAuth';

// ── Subjects ──────────────────────────────────────────────
export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await subjectsApi.getAll(user.id);
      setSubjects(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (subject) => {
    const newSubject = await subjectsApi.create({ ...subject, user_id: user.id });
    setSubjects((prev) => [newSubject, ...prev]);
    return newSubject;
  };

  const update = async (id, updates) => {
    const updated = await subjectsApi.update(id, updates);
    setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const remove = async (id) => {
    await subjectsApi.delete(id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  return { subjects, loading, error, refetch: fetch, create, update, remove };
}

// ── Tasks ─────────────────────────────────────────────────
export function useTasks(date = null) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = date
        ? await tasksApi.getByDate(user.id, date)
        : await tasksApi.getAll(user.id);
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => { fetch(); }, [fetch]);

  const markComplete = async (id) => {
    const updated = await tasksApi.markComplete(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const markPending = async (id) => {
    const updated = await tasksApi.markPending(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const remove = async (id) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, refetch: fetch, markComplete, markPending, remove };
}

// ── Progress ──────────────────────────────────────────────
export function useProgress(days = 30) {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const data = await progressApi.getByDateRange(user.id, startDate, endDate);
      setProgress(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user, days]);

  useEffect(() => { fetch(); }, [fetch]);

  return { progress, loading, error, refetch: fetch };
}

// ── Study Plans ───────────────────────────────────────────
export function useStudyPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await studyPlansApi.getAll(user.id);
      setPlans(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (plan) => {
    const newPlan = await studyPlansApi.create({ ...plan, user_id: user.id });
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const remove = async (id) => {
    await tasksApi.deleteByStudyPlan(id);
    await studyPlansApi.delete(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return { plans, loading, error, refetch: fetch, create, remove };
}
