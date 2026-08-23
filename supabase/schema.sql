create extension if not exists pgcrypto;

create table if not exists public.feature_requests (
  id text primary key,
  title text not null,
  description text not null,
  product_id text not null,
  category text not null,
  status text not null check (status in ('Under Review', 'Planned', 'In Progress')),
  base_votes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.feature_votes (
  id uuid primary key default gen_random_uuid(),
  feature_id text not null references public.feature_requests(id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  unique (feature_id, visitor_id)
);

create table if not exists public.submitted_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  product_id text not null,
  category text not null,
  email text,
  status text not null default 'Under Review',
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

alter table public.feature_requests enable row level security;
alter table public.feature_votes enable row level security;
alter table public.submitted_requests enable row level security;
alter table public.newsletter_subscribers enable row level security;

insert into public.feature_requests (id, title, description, product_id, category, status, base_votes)
values
  ('feat_1', 'Add Dark Mode', 'Switch between light and dark themes, with your preference synced across every device.', 'prod_core', 'Experience', 'In Progress', 142),
  ('feat_2', 'Advanced Analytics Dashboard', 'Understand product engagement with customizable reports, trends, and exportable insights.', 'prod_insights', 'Analytics', 'Planned', 98),
  ('feat_3', 'Public API & Webhooks', 'Connect your favorite tools and automate workflows with a secure, developer-friendly API.', 'prod_automate', 'Integrations', 'Under Review', 76),
  ('feat_4', 'Collaborative Workspaces', 'Invite teammates, share boards, and make decisions together with granular permissions.', 'prod_inbox', 'Collaboration', 'Planned', 64)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  product_id = excluded.product_id,
  category = excluded.category,
  status = excluded.status,
  base_votes = excluded.base_votes;

create or replace function public.cast_vote(p_feature_id text, p_visitor_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare vote_total integer;
begin
  insert into public.feature_votes (feature_id, visitor_id)
  values (p_feature_id, p_visitor_id)
  on conflict (feature_id, visitor_id) do nothing;

  select f.base_votes + count(v.id)::integer into vote_total
  from public.feature_requests f
  left join public.feature_votes v on v.feature_id = f.id
  where f.id = p_feature_id
  group by f.base_votes;

  return vote_total;
end;
$$;

revoke all on function public.cast_vote(text, text) from public;
grant execute on function public.cast_vote(text, text) to service_role;
