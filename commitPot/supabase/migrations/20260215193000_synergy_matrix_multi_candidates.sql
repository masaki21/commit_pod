-- Step10-2: Support multiple synergy candidates per pot_base x protein_id
-- Keep existing rows and append higher-priority curated combinations.

alter table public.synergy_matrix
  add column if not exists priority smallint not null default 100;

alter table public.synergy_matrix
  drop constraint if exists synergy_matrix_unique_combo;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'synergy_matrix_unique_recipe'
      AND conrelid = 'public.synergy_matrix'::regclass
  ) THEN
    ALTER TABLE public.synergy_matrix
      ADD CONSTRAINT synergy_matrix_unique_recipe
      UNIQUE (pot_base, protein_id, veggie_ids, mushroom_id);
  END IF;
END
$$;

create index if not exists idx_synergy_matrix_lookup_priority
  on public.synergy_matrix (pot_base, protein_id, is_active, priority);

update public.synergy_matrix
set
  priority = case
    when nutrition_category = 'ai_generated' then 500
    else 100
  end,
  updated_at = now()
where priority is null
   or priority <> case when nutrition_category = 'ai_generated' then 500 else 100 end;

insert into public.synergy_matrix
  (pot_base, protein_id, veggie_ids, mushroom_id, synergy_reason, nutrition_category, evidence_level, priority, is_active)
values
  -- miso
  ('miso', 'p1', array['v8', 'v14'], 'v16', 'ビタミンCと含硫化合物でタンパク活用を補助', 'muscle_support', 2, 10, true),
  ('miso', 'p2', array['v5', 'v14'], 'v17', 'アリシンと食物繊維で疲労対策と巡りを支援', 'fatigue_support', 3, 10, true),
  ('miso', 'p6', array['v8', 'v15'], 'v16', 'EPA/DHAに抗酸化と食物繊維を重ねて回復を支援', 'anti_inflammatory', 2, 10, true),
  ('miso', 'p4', array['v6', 'v15'], 'v17', '低脂質タンパクと食物繊維で満足感を維持', 'cut_support', 1, 10, true),
  ('miso', 'p7', array['v4', 'v5'], 'v16', '卵の良質タンパクとミネラル補給を両立', 'balanced', 1, 10, true),

  -- kimchi
  ('kimchi', 'p1', array['v1', 'v14'], 'v16', 'ビタミンCと香味成分で筋合成と代謝を後押し', 'muscle_support', 2, 10, true),
  ('kimchi', 'p8', array['v11', 'v15'], 'v17', '鉄・亜鉛に食物繊維を重ねて持久力を補助', 'performance', 2, 10, true),
  ('kimchi', 'p9', array['v8', 'v5'], 'v16', 'ビタミンA/B群に抗酸化を重ね回復を支援', 'recovery', 2, 10, true),
  ('kimchi', 'p4', array['v7', 'v15'], 'v10', '消化負担を抑えながらボリュームを確保', 'balanced', 1, 10, true),
  ('kimchi', 'p7', array['v1', 'v14'], 'v17', '卵タンパクと辛味ベースの相性を最適化', 'balanced', 1, 10, true),

  -- yose
  ('yose', 'p1', array['v1', 'v11'], 'v16', '高タンパクとビタミンCで筋合成を支援', 'muscle_support', 3, 10, true),
  ('yose', 'p10', array['v12', 'v14'], 'v17', '良質脂質に抗酸化食材を重ね炎症ケアを補助', 'anti_inflammatory', 2, 10, true),
  ('yose', 'p3', array['v12', 'v11'], 'v9', 'ビタミンDとミネラルを組み合わせ骨サポート', 'bone_support', 3, 10, true),
  ('yose', 'p2', array['v13', 'v14'], 'v16', 'B1代謝と抗酸化を同時に狙う', 'fatigue_support', 2, 10, true),
  ('yose', 'p4', array['v1', 'v15'], 'v17', '低脂質タンパクと食物繊維で調整しやすい構成', 'cut_support', 1, 10, true)
on conflict (pot_base, protein_id, veggie_ids, mushroom_id)
do update set
  synergy_reason = excluded.synergy_reason,
  nutrition_category = excluded.nutrition_category,
  evidence_level = excluded.evidence_level,
  priority = excluded.priority,
  is_active = true,
  updated_at = now();
