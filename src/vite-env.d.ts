-- Supabase schema for TaskFlow
-- Run in SQL editor in Supabase

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  owner_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'member',
  created_at timestamptz default now(),
  unique(team_id, user_id)
);

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  team_id uuid references teams(id) on delete set null,
  owner_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  status text default 'todo',
  priority text default 'medium',
  assignee text default 'Sin asignado',
  due_date date,
  tags text[] default '{}',
  board_id uuid references boards(id) on delete set null,
  team_id uuid references teams(id) on delete set null,
  synced_to_calendar boolean default false,
  calendar_event_id text,
  created_at timestamptz default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table if not exists task_tags (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  unique(task_id, tag_id)
);

create index if not exists tasks_status_idx on tasks(status);
create index if not exists tasks_board_idx on tasks(board_id);
create index if not exists tasks_team_idx on tasks(team_id);
create index if not exists task_tags_task_idx on task_tags(task_id);

-- Optional helper to keep profiles in sync with auth users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
