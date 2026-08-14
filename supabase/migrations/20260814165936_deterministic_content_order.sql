alter table public.projects
  add column sort_order integer;

alter table public.work_experience
  add column sort_order integer;

with ranked_projects as (
  select
    id,
    (row_number() over (order by created_at desc, id asc) - 1)::integer as sort_order
  from public.projects
)
update public.projects as projects
set sort_order = ranked_projects.sort_order
from ranked_projects
where projects.id = ranked_projects.id;

with ranked_work_experience as (
  select
    id,
    (row_number() over (order by created_at desc, id asc) - 1)::integer as sort_order
  from public.work_experience
)
update public.work_experience as work_experience
set sort_order = ranked_work_experience.sort_order
from ranked_work_experience
where work_experience.id = ranked_work_experience.id;

alter table public.projects
  alter column sort_order set default 0,
  alter column sort_order set not null;

alter table public.work_experience
  alter column sort_order set default 0,
  alter column sort_order set not null;

create index projects_sort_order_id_idx
  on public.projects (sort_order, id);

create index work_experience_sort_order_id_idx
  on public.work_experience (sort_order, id);

create index notes_sort_order_id_idx
  on public.notes (sort_order, id);

create index about_items_sort_order_id_idx
  on public.about_items (sort_order, id);

create index now_items_sort_order_id_idx
  on public.now_items (sort_order, id);

create index contact_methods_sort_order_id_idx
  on public.contact_methods (sort_order, id);

create unique index about_video_singleton_idx
  on public.about_video ((true));
