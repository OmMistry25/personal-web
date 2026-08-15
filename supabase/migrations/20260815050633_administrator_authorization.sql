-- Restrict all content mutations to the explicitly authorized administrator.
-- Public reads remain unchanged.

drop policy if exists "Enable full access for authenticated users" on public.projects;
drop policy if exists "Enable full access for authenticated users" on public.notes;
drop policy if exists "Enable full access for authenticated users" on public.work_experience;
drop policy if exists "Enable full access for authenticated users" on public.about_items;
drop policy if exists "Enable full access for authenticated users" on public.about_video;
drop policy if exists "Enable full access for authenticated users" on public.now_items;
drop policy if exists "Enable full access for authenticated users" on public.contact_methods;

create policy "Administrators can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can update projects"
  on public.projects
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can delete projects"
  on public.projects
  for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can insert notes"
  on public.notes
  for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can update notes"
  on public.notes
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can delete notes"
  on public.notes
  for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can insert work experience"
  on public.work_experience
  for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can update work experience"
  on public.work_experience
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can delete work experience"
  on public.work_experience
  for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can insert about items"
  on public.about_items
  for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can update about items"
  on public.about_items
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can delete about items"
  on public.about_items
  for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can insert about video"
  on public.about_video
  for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can update about video"
  on public.about_video
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can delete about video"
  on public.about_video
  for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can insert now items"
  on public.now_items
  for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can update now items"
  on public.now_items
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can delete now items"
  on public.now_items
  for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can insert contact methods"
  on public.contact_methods
  for insert
  to authenticated
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can update contact methods"
  on public.contact_methods
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy "Administrators can delete contact methods"
  on public.contact_methods
  for delete
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

revoke all privileges on table public.projects from anon, authenticated;
revoke all privileges on table public.notes from anon, authenticated;
revoke all privileges on table public.work_experience from anon, authenticated;
revoke all privileges on table public.about_items from anon, authenticated;
revoke all privileges on table public.about_video from anon, authenticated;
revoke all privileges on table public.now_items from anon, authenticated;
revoke all privileges on table public.contact_methods from anon, authenticated;

grant select on table public.projects to anon, authenticated;
grant select on table public.notes to anon, authenticated;
grant select on table public.work_experience to anon, authenticated;
grant select on table public.about_items to anon, authenticated;
grant select on table public.about_video to anon, authenticated;
grant select on table public.now_items to anon, authenticated;
grant select on table public.contact_methods to anon, authenticated;

grant insert, update, delete on table public.projects to authenticated;
grant insert, update, delete on table public.notes to authenticated;
grant insert, update, delete on table public.work_experience to authenticated;
grant insert, update, delete on table public.about_items to authenticated;
grant insert, update, delete on table public.about_video to authenticated;
grant insert, update, delete on table public.now_items to authenticated;
grant insert, update, delete on table public.contact_methods to authenticated;

drop policy if exists "Allow authenticated uploads to videos bucket" on storage.objects;
drop policy if exists "Authenticated users can upload videos" on storage.objects;
drop policy if exists "Give public access to videos" on storage.objects;
drop policy if exists "Videos are publicly accessible" on storage.objects;

create policy "Videos are publicly accessible"
  on storage.objects
  for select
  to public
  using (bucket_id = 'videos');

create policy "Administrators can upload videos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'videos'
    and ((metadata ->> 'size')::bigint <= 419430400)
    and (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  ));
