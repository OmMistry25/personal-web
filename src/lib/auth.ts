import { User } from '@supabase/supabase-js';

export const isAdministrator = (user: User | null): boolean =>
  user?.app_metadata?.role === 'admin';
