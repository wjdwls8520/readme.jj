-- Create comments table
create table public.comments (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  content text not null,
  nickname text not null,
  password text not null, -- Stores the password for guest deletion (encryption recommended in app logic)
  ip_address text,
  os text,
  browser text,
  project_slug text not null, -- To distinguish comments per project
  parent_id uuid references public.comments(id) on delete cascade,
  
  constraint comments_pkey primary key (id)
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies
-- 1. Everyone can view comments
create policy "Comments are viewable by everyone" 
on public.comments for select 
using (true);

-- 2. Everyone can insert comments
create policy "Comments are insertable by everyone" 
on public.comments for insert 
with check (true);

-- 3. Admin can delete (Logic will be handled via App or Auth UID)
-- For now, we allow delete if user is authenticated admin, or if handled via Server Action with Service Role.
-- Guest deletion via password will be handled via a Server Action (Bypass RLS or use strict policy).
