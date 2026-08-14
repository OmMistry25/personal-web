import { supabase } from './supabase';
import type { Project, Note, WorkExperience, AboutItem, NowItem, ContactMethod } from '../types';

// Projects
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createProject = async (project: Omit<Project, 'id'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Notes
export const getNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createNote = async (note: Omit<Note, 'id'>) => {
  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Work Experience
export const getWorkExperience = async () => {
  const { data, error } = await supabase
    .from('work_experience')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createWorkExperience = async (experience: Omit<WorkExperience, 'id'>) => {
  const { data, error } = await supabase
    .from('work_experience')
    .insert(experience)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// About Items
export const getAboutItems = async () => {
  const { data, error } = await supabase
    .from('about_items')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createAboutItem = async (item: Omit<AboutItem, 'id'>) => {
  const { data, error } = await supabase
    .from('about_items')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Now Items
export const getNowItems = async () => {
  const { data, error } = await supabase
    .from('now_items')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createNowItem = async (item: Omit<NowItem, 'id'>) => {
  const { data, error } = await supabase
    .from('now_items')
    .insert(item)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Contact Methods
export const getContactMethods = async () => {
  const { data, error } = await supabase
    .from('contact_methods')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createContactMethod = async (method: Omit<ContactMethod, 'id'>) => {
  const { data, error } = await supabase
    .from('contact_methods')
    .insert(method)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};