-- Step 9: Persist selected recommendation events for insights and cost monitoring

create table if not exists public.recommendation_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('provider_miss', 'ai_invoked', 'recommendation_resolved')),
  pot_base text not null,
  protein_id text not null,
  source text,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists idx_recommendation_events_created_at
  on public.recommendation_events (created_at desc);

create index if not exists idx_recommendation_events_type_created
  on public.recommendation_events (event_type, created_at desc);

create index if not exists idx_recommendation_events_combo_created
  on public.recommendation_events (pot_base, protein_id, created_at desc);

alter table public.recommendation_events enable row level security;

drop policy if exists "recommendation_events_insert_all" on public.recommendation_events;
create policy "recommendation_events_insert_all"
  on public.recommendation_events
  for insert
  to anon, authenticated
  with check (true);

-- Read access is intentionally omitted for client-side roles.
-- Analytics should use service role or SQL editor.

