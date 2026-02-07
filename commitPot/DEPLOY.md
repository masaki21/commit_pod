# Vercel デプロイ手順（Expo Web / PWA）

## 前提
- ローカルで `npx expo start --web` が起動できること
- `.env` を使っている場合は `EXPO_PUBLIC_...` を Vercel の Environment Variables に登録すること

## ビルド設定
- Build Command: `npx expo export --platform web`
- Output Directory: `dist`
- Framework Preset: `Other`

## リダイレクト設定
SPA で直接URLアクセスができるように、`vercel.json` を配置済みです。

## デプロイ方法
1. GitHub リポジトリを Vercel に連携
2. 上記ビルド設定を入力
3. 環境変数を登録してデプロイ

## PWA 確認
- `dist/manifest.webmanifest` が出力されることを確認
- `favicon` が配信されることを確認

