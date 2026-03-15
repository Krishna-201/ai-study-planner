import { supabase } from './supabase';

// ============================================================
// AUTH
// ============================================================
export const authApi = {
  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ============================================================
// SUBJECTS
// ============================================================
export const subjectsApi = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (subject) => {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// STUDY PLANS
// ============================================================
export const studyPlansApi = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('study_plans')
      .select(`*, subjects(name, color)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getBySubject: async (subjectId) => {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (plan) => {
    const { data, error } = await supabase
      .from('study_plans')
      .insert(plan)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('study_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('study_plans').delete().eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// TASKS
// ============================================================
export const tasksApi = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`*, subjects(name, color)`)
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true })
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data;
  },

  getByDate: async (userId, date) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`*, subjects(name, color)`)
      .eq('user_id', userId)
      .eq('scheduled_date', date)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data;
  },

  getByDateRange: async (userId, startDate, endDate) => {
    const { data, error } = await supabase
      .from('tasks')
      .select(`*, subjects(name, color)`)
      .eq('user_id', userId)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDate)
      .order('scheduled_date', { ascending: true });
    if (error) throw error;
    return data;
  },

  bulkCreate: async (tasks) => {
    const { data, error } = await supabase.from('tasks').insert(tasks).select();
    if (error) throw error;
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  markComplete: async (id) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  markPending: async (id) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'pending', completed_at: null })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },

  deleteByStudyPlan: async (studyPlanId) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('study_plan_id', studyPlanId);
    if (error) throw error;
  },
};

// ============================================================
// PROGRESS
// ============================================================
export const progressApi = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('progress')
      .select(`*, subjects(name, color)`)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },

  getByDateRange: async (userId, startDate, endDate) => {
    const { data, error } = await supabase
      .from('progress')
      .select(`*, subjects(name, color)`)
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    if (error) throw error;
    return data;
  },

  upsert: async (progressData) => {
    const { data, error } = await supabase
      .from('progress')
      .upsert(progressData, { onConflict: 'user_id,subject_id,date' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  getDashboardStats: async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .gte('date', thirtyDaysAgo)
      .lte('date', today);
    if (error) throw error;
    return data;
  },
};
