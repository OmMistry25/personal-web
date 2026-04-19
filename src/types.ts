export interface Project {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  featured: boolean;
  year: string;
  achievements?: string[];
}

export interface Note {
  id?: string;
  title: string;
  slug: string;
  date: string;
  reading_time: number;
  excerpt: string;
  tags: string[];
  content: string;
  sort_order: number;
}

export interface WorkExperience {
  id?: string;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface AboutItem {
  id?: string;
  title: string;
  sort_order: number;
}

export interface NowItem {
  id?: string;
  activity: string;
  sort_order: number;
}

export interface ContactMethod {
  id?: string;
  label: string;
  value: string;
  type: 'email' | 'social' | 'other';
  sort_order: number;
}