-- Step 2: Synergy Matrix (DB-first recommendation)

create table if not exists public.synergy_matrix (
  id uuid primary key default gen_random_uuid(),
  pot_base text not null check (pot_base in ('yose', 'miso', 'kimchi')),
  protein_id text not null,
  veggie_ids text[] not null,
  mushroom_id text not null,
  synergy_reason text not null,
  nutrition_category text not null default 'balanced',
  evidence_level smallint not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint synergy_matrix_veggie_count check (array_length(veggie_ids, 1) = 2),
  constraint synergy_matrix_unique_combo unique (pot_base, protein_id)
);

create index if not exists idx_synergy_matrix_lookup
  on public.synergy_matrix (pot_base, protein_id, is_active);

create table if not exists public.synergy_alternatives (
  id uuid primary key default gen_random_uuid(),
  ingredient_id text not null,
  nutrition_category text not null,
  alternative_ids text[] not null,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint synergy_alternatives_unique unique (ingredient_id, nutrition_category)
);

create index if not exists idx_synergy_alternatives_lookup
  on public.synergy_alternatives (ingredient_id, nutrition_category, is_active);

alter table public.synergy_matrix enable row level security;
alter table public.synergy_alternatives enable row level security;

drop policy if exists "synergy_matrix_read_all" on public.synergy_matrix;
create policy "synergy_matrix_read_all"
  on public.synergy_matrix
  for select
  using (true);

drop policy if exists "synergy_alternatives_read_all" on public.synergy_alternatives;
create policy "synergy_alternatives_read_all"
  on public.synergy_alternatives
  for select
  using (true);

insert into public.synergy_matrix
  (pot_base, protein_id, veggie_ids, mushroom_id, synergy_reason, nutrition_category, evidence_level)
values
  ('miso', 'p1', array['v4', 'v8'], 'v9', 'ビタミンCと葉酸で代謝と回復をサポート', 'recovery', 2),
  ('miso', 'p2', array['v5', 'v4'], 'v10', 'アリシンによるビタミンB1活用を狙った組み合わせ', 'fatigue_support', 3),
  ('miso', 'p6', array['v8', 'v7'], 'v3', 'DHA/EPAと抗酸化食材でコンディション維持', 'anti_inflammatory', 2),
  ('miso', 'p4', array['v6', 'v7'], 'v10', '低脂質タンパクと食物繊維で満足感を確保', 'cut_support', 1),
  ('miso', 'p7', array['v8', 'v5'], 'v9', '卵の良質タンパクとミネラル補給を両立', 'balanced', 1),

  ('kimchi', 'p1', array['v1', 'v8'], 'v3', 'ビタミンCと発酵系スープで代謝効率を後押し', 'muscle_support', 2),
  ('kimchi', 'p8', array['v11', 'v1'], 'v10', '鉄・亜鉛と抗酸化野菜の組み合わせ', 'performance', 2),
  ('kimchi', 'p9', array['v8', 'v5'], 'v3', 'ビタミンA/B群を活かし回復を支援', 'recovery', 2),
  ('kimchi', 'p4', array['v7', 'v11'], 'v10', '消化負担を抑えつつボリューム確保', 'balanced', 1),
  ('kimchi', 'p7', array['v1', 'v5'], 'v3', '卵タンパクと辛味ベースの相性最適化', 'balanced', 1),

  ('yose', 'p1', array['v1', 'v11'], 'v9', '高タンパクとビタミンCで筋合成を支援', 'muscle_support', 3),
  ('yose', 'p10', array['v12', 'v11'], 'v3', '脂質の質を保ちながら抗酸化を補強', 'anti_inflammatory', 2),
  ('yose', 'p3', array['v4', 'v12'], 'v9', 'ビタミンDとカルシウム利用を意識した構成', 'bone_support', 3),
  ('yose', 'p2', array['v13', 'v8'], 'v3', 'B1代謝と抗酸化を同時に狙う', 'fatigue_support', 2),
  ('yose', 'p4', array['v1', 'v13'], 'v9', '低脂質・高食物繊維で調整しやすい構成', 'cut_support', 1)
on conflict (pot_base, protein_id)
do update set
  veggie_ids = excluded.veggie_ids,
  mushroom_id = excluded.mushroom_id,
  synergy_reason = excluded.synergy_reason,
  nutrition_category = excluded.nutrition_category,
  evidence_level = excluded.evidence_level,
  is_active = true,
  updated_at = now();

insert into public.synergy_alternatives
  (ingredient_id, nutrition_category, alternative_ids, note)
values
  ('v4', 'recovery', array['v8', 'v1'], '葉物カテゴリでの代替'),
  ('v8', 'recovery', array['v4', 'v11'], '葉物カテゴリでの代替'),
  ('v5', 'fatigue_support', array['v13', 'v7'], '香味/抗酸化カテゴリでの代替'),
  ('v1', 'muscle_support', array['v11', 'v13'], 'ビタミンC系カテゴリでの代替'),
  ('v11', 'muscle_support', array['v1', 'v8'], 'ビタミンC系カテゴリでの代替'),
  ('v9', 'bone_support', array['v3', 'v10'], 'きのこカテゴリでの代替'),
  ('v3', 'bone_support', array['v9', 'v10'], 'きのこカテゴリでの代替')
on conflict (ingredient_id, nutrition_category)
do update set
  alternative_ids = excluded.alternative_ids,
  note = excluded.note,
  is_active = true,
  updated_at = now();
