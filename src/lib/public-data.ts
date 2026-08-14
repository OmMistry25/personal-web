import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Database, Tables } from '../types/database.generated';

const publicSupabase: SupabaseClient<Database> = supabase;

export type AboutItem = Tables<'about_items'>;
export type AboutVideo = Pick<Tables<'about_video'>, 'video_id'>;
export type ContactMethod = Tables<'contact_methods'>;
export type Note = Tables<'notes'>;
export type NowItem = Tables<'now_items'>;
export type Project = Tables<'projects'>;
export type WorkExperience = Tables<'work_experience'>;

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await publicSupabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getNotes = async (): Promise<Note[]> => {
  const { data, error } = await publicSupabase
    .from('notes')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getNoteBySlug = async (slug: string): Promise<Note | null> => {
  const { data, error } = await publicSupabase
    .from('notes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getWorkExperience = async (): Promise<WorkExperience[]> => {
  const { data, error } = await publicSupabase
    .from('work_experience')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getWorkExperienceById = async (id: string): Promise<WorkExperience | null> => {
  const { data, error } = await publicSupabase
    .from('work_experience')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getAboutItems = async (): Promise<AboutItem[]> => {
  const { data, error } = await publicSupabase
    .from('about_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getAboutVideo = async (): Promise<AboutVideo[]> => {
  const { data, error } = await publicSupabase
    .from('about_video')
    .select('video_id')
    .limit(1);

  if (error) throw error;
  return data || [];
};

export const getNowItems = async (): Promise<NowItem[]> => {
  const { data, error } = await publicSupabase
    .from('now_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getContactMethods = async (): Promise<ContactMethod[]> => {
  const { data, error } = await publicSupabase
    .from('contact_methods')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
};
