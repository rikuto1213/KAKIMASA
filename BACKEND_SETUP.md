# Backend API セットアップガイド

Next.js + Prisma + Neon を使用したバックエンド構築ガイド

## 1. 環境変数設定

`.env.local` ファイルを作成して以下の情報を入力してください：

### Neon PostgreSQL 接続設定

1. **Neon プロジェクトの作成**
   - https://console.neon.tech にアクセス
   - 新しいプロジェクトを作成
   - PostgreSQL データベースの接続文字列をコピー

2. **環境変数に設定**
```bash
DATABASE_URL="postgresql://neon_username:password@ep-xxxx-region.neon.tech/database_name?sslmode=require"
```

### JWT 設定

本番環境では強力なシークレットキーを設定してください：

```bash
JWT_SECRET="your-super-secure-random-string-here"
```

### API URL

フロントエンド用 API URL（開発時はローカルホスト）：

```bash
EXPO_PUBLIC_API_URL="http://localhost:3000/api"
```

## 2. Prisma セットアップ

### スキーマ確認

`prisma/schema.prisma` が正しく設定されているか確認：

```bash
# Prisma ジェネレータ実行
npm run prisma:generate
```

### データベースマイグレーション

初期マイグレーションを実行：

```bash
# マイグレーション実行（データベース作成）
npm run prisma:migrate
```

プロンプトが表示されたら、マイグレーション名を入力（例：`init`）

### Prisma Studio で確認

データベースの内容を確認：

```bash
npm run prisma:studio
```

ブラウザで http://localhost:5555 が開きます

## 3. API サーバー起動

### 開発モード

```bash
npm run dev
```

API は http://localhost:3000 で起動します

### ビルド

```bash
npm run build
npm start
```

## 4. API エンドポイント

### 認証

- `POST /api/auth/login` - ログイン
- `POST /api/auth/signup` - サインアップ
- `POST /api/auth/logout` - ログアウト

### レストラン

- `GET /api/restaurants` - 全レストラン取得
- `GET /api/restaurants/[id]` - レストラン詳細
- `GET /api/restaurants/search?q=query` - レストラン検索
- `GET /api/restaurants/[id]/reviews` - レビュー取得
- `POST /api/restaurants/[id]/reviews` - レビュー作成

### 予約

- `GET /api/reservations` - ユーザーの予約一覧
- `POST /api/reservations` - 予約作成
- `PUT /api/reservations/[id]` - 予約キャンセル

### ポイント

- `GET /api/points` - ポイント残高
- `GET /api/points/transactions` - ポイント履歴

### ユーザー

- `GET /api/user/profile` - プロフィール取得
- `PUT /api/user/profile` - プロフィール更新

### お気に入り

- `GET /api/favorites` - お気に入り一覧
- `POST /api/favorites` - お気に入り追加
- `DELETE /api/favorites/[id]` - お気に入り削除

## 5. リクエスト例

### ログイン

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### レストラン取得

```bash
curl -X GET "http://localhost:3000/api/restaurants?latitude=35.6762&longitude=139.6503&radius=50"
```

### 認証が必要な API

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 6. サンプルデータ挿入

`pages/api/seed.ts` を作成してサンプルデータを挿入することができます：

```bash
curl -X POST http://localhost:3000/api/seed
```

## トラブルシューティング

### データベース接続エラー

```
Error: P1000: Authentication failed
```

→ `DATABASE_URL` が正しいか確認してください

### マイグレーション失敗

```
Error: P3008
```

→ `npm run prisma:generate` を実行して Prisma クライアントを再生成してください

### TypeScript エラー

```
npm run prisma:generate
npm run build
```

## デプロイ

### Vercel へのデプロイ

1. Vercel でプロジェクトを作成
2. 環境変数を設定
3. Git をプッシュ
4. 自動デプロイが実行

### マイグレーション実行

Vercel のビルド後に自動実行するよう `package.json` を設定：

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postbuild": "prisma migrate deploy"
  }
}
```
