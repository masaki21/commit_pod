# Step10-1 Synergy Matrix Blueprint

## 1. 現在の実装状況（事実）
- `pot_base` は `miso / kimchi / yose`
- 各 `pot_base` ごとに `protein` は5種類、合計15組み合わせ
- `登録済み（件数上はフルカバー）
- ただし以下2件は、鍋ベースで選択可能な食材集合と不一致のため実運用で `provider_miss` になり得る
  - `miso × p6`: `mushroom_id = v3`（misoの候補にv3がない）
  - `yose × p3`: `veggie_ids` に `v4`（yoseの候補にv4がない）

## 2. Step10での方針
- 新規キー追加ではなく、まず既存15件を「有効な候補IDだけ」で再設計する
- 追加した新食材（`v14:ニラ`, `v15:ごぼう`, `v16:椎茸`, `v17:エリンギ`）を優先的に反映
- フォーマットは既存と同じ: `veggie_ids(非きのこ2件) + mushroom_id(きのこ1件)`

## 3. 更新候補（v2ドラフト）

### miso
1. `miso × p1` -> veggies: `[v8, v14]`, mushroom: `v16`, category: `muscle_support`
2. `miso × p2` -> veggies: `[v5, v14]`, mushroom: `v17`, category: `fatigue_support`
3. `miso × p6` -> veggies: `[v8, v15]`, mushroom: `v16`, category: `anti_inflammatory`  
   - ※現行 `mushroom_id=v3` の不一致を修正
4. `miso × p4` -> veggies: `[v6, v7]`, mushroom: `v17`, category: `cut_support`
5. `miso × p7` -> veggies: `[v4, v5]`, mushroom: `v9`, category: `balanced`

### kimchi
1. `kimchi × p1` -> veggies: `[v1, v14]`, mushroom: `v16`, category: `muscle_support`
2. `kimchi × p8` -> veggies: `[v11, v1]`, mushroom: `v17`, category: `performance`
3. `kimchi × p9` -> veggies: `[v8, v5]`, mushroom: `v3`, category: `recovery`
4. `kimchi × p4` -> veggies: `[v7, v15]`, mushroom: `v16`, category: `balanced`
5. `kimchi × p7` -> veggies: `[v1, v5]`, mushroom: `v10`, category: `balanced`

### yose
1. `yose × p1` -> veggies: `[v1, v11]`, mushroom: `v16`, category: `muscle_support`
2. `yose × p10` -> veggies: `[v12, v14]`, mushroom: `v17`, category: `anti_inflammatory`
3. `yose × p3` -> veggies: `[v12, v11]`, mushroom: `v9`, category: `bone_support`  
   - ※現行 `veggie_ids` の `v4` 不一致を修正
4. `yose × p2` -> veggies: `[v13, v14]`, mushroom: `v16`, category: `fatigue_support`
5. `yose × p4` -> veggies: `[v1, v15]`, mushroom: `v17`, category: `cut_support`

## 4. この後（Step10-2で実装）
- migrationで上記15件を `on conflict (pot_base, protein_id)` で一括upsert
- `synergy_reason` は各行に合わせて最終文言を確定
- 更新後、次を確認
  - `provider_miss` が対象組み合わせで発生しない
  - 同一 `pot_base + protein_id` 2回目で `ai_invoked` が増えない
