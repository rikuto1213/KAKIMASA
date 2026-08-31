# Restaurant Points & Reservation App

レストランのポイント管理と予約システムのモバイルアプリです。React Native/Expo で構築されています。

## プロジェクト概要

このアプリは以下の機能を提供します：

- **ユーザー認証**: メールアドレスとパスワードでサインイン/サインアップ
- **レストラン検索**: 位置情報ベースでレストランを検索
- **予約管理**: レストランの予約を作成・管理
- **ポイントシステム**: レストラン利用時にポイントを獲得
- **割引機能**: ポイントを使用して割引を利用
- **お気に入り管理**: レストランをお気に入りに追加

## 技術スタック

### フロントエンド
- **React Native** - モバイルアプリフレームワーク
- **Expo** - React Native 開発プラットフォーム（SDK 57）
- **Expo Router** - ファイルベースのルーティング
- **TypeScript** - 型安全な開発
- **Zustand** - 状態管理
- **Tailwind CSS** - スタイリング（ネイティブ）
- **Axios** - HTTP クライアント

### API・連携サービス
- **Google Maps API** - 地図と位置情報
- **Firebase** - プッシュ通知（オプション）
- **REST API** - バックエンド連携

### ビルド・デプロイ
- **EAS Build** - iOS/Android ビルド
- **Expo Go** - 開発用エミュレーター

## プロジェクト構造

```
src/
├── app/                    # Expo Router ページ
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # ホーム画面
│   │   ├── search.tsx     # 検索画面
│   │   ├── reservations.tsx # 予約画面
│   │   └── profile.tsx    # プロフィール画面
│   ├── login.tsx          # ログイン画面
│   └── _layout.tsx        # ルートレイアウト
├── screens/               # スクリーンコンポーネント
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── ProfileScreen.tsx
│   └── SplashScreen.tsx
├── components/            # 再利用可能コンポーネント
│   ├── common/           # 汎用コンポーネント
│   │   ├── Button.tsx
│   │   └── LoadingSpinner.tsx
│   └── RestaurantCard.tsx
├── services/             # API通信
│   └── api.ts
├── store/               # 状態管理（Zustand）
│   ├── useAuthStore.ts
│   └── useRestaurantStore.ts
├── types/               # TypeScript型定義
│   └── index.ts
├── utils/               # ユーティリティ関数
│   ├── formatting.ts    # 日付・通貨フォーマット
│   └── location.ts      # 位置情報関連
└── constants/           # 定数
    └── index.ts
```

## セットアップ手順

### 前提条件
- Node.js 18.x 以上
- npm または yarn
- Expo CLI: `npm install -g expo-cli`

### インストール

1. **プロジェクトクローン**
```bash
cd restaurant_app
```

2. **依存関係をインストール**
```bash
npm install
```

3. **環境変数を設定**
```bash
cp .env.example .env.local
# .env.local を編集して API URL などを設定
```

## 開発

### 開発サーバーの起動

```bash
# Expo Go での開発
npm start

# または
expo start
```

実行後、表示されるQRコードをスキャンして Expo Go アプリで確認できます。

### Web での開発
```bash
npm run web
```

### デバイスでの実行

#### iOS (Mac が必要)
```bash
npm run ios
```

#### Android
```bash
npm run android
```

## ビルド

### EAS Build を使用した本番ビルド

```bash
# ビルド設定
eas build --platform ios --build-profile preview
eas build --platform android --build-profile preview

# 本番環境へのビルド
eas build --platform ios --build-profile production
eas build --platform android --build-profile production
```

## API エンドポイント

アプリは以下のエンドポイントと通信します：

### 認証
- `POST /auth/login` - ログイン
- `POST /auth/signup` - サインアップ
- `POST /auth/logout` - ログアウト

### レストラン
- `GET /restaurants` - レストラン一覧取得（位置情報ベース）
- `GET /restaurants/:id` - レストラン詳細取得
- `GET /restaurants/search` - レストラン検索

### 予約
- `GET /reservations` - ユーザーの予約一覧
- `POST /reservations` - 予約作成
- `PUT /reservations/:id/cancel` - 予約キャンセル

### ポイント
- `GET /points` - 現在のポイント取得
- `GET /points/transactions` - ポイント取引履歴

### ユーザー
- `GET /user/profile` - プロフィール取得
- `PUT /user/profile` - プロフィール更新

### お気に入り
- `GET /favorites` - お気に入り一覧
- `POST /favorites` - お気に入り追加
- `DELETE /favorites/:id` - お気に入り削除

## 状態管理

### Zustand Store

#### useAuthStore
ユーザーの認証状態を管理します：
- `user` - 現在のユーザー情報
- `token` - アクセストークン
- `isAuthenticated` - ログイン状態
- `setAuth()` - 認証情報を設定
- `logout()` - ログアウト

#### useRestaurantStore
レストランと予約の情報を管理します：
- `restaurants` - レストラン一覧
- `userReservations` - ユーザーの予約
- `favorites` - お気に入りレストランID
- `isFavorited()` - お気に入り確認

## パーミッション

このアプリは以下のパーミッションが必要です：

- **位置情報** - レストラン検索で使用
- **カメラ** - プロフィール画像アップロード（オプション）
- **マイク** - 音声通知（オプション）

## トラブルシューティング

### Expo Go に接続できない
```bash
# キャッシュをクリア
npm cache clean --force
npm install

# 再度起動
npm start
```

### TypeScript エラー
```bash
# 型定義を再生成
npm install
```

### API 接続エラー
- `.env.local` の `EXPO_PUBLIC_API_URL` を確認
- バックエンド API がオンラインか確認

## テスト

```bash
npm test
```

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## サポート

問題が発生した場合は、GitHub Issues でお知らせください。

## 今後の拡張機能

- [ ] Google Maps 統合
- [ ] Stripe による支払い処理
- [ ] SendGrid によるメール通知
- [ ] プッシュ通知（FCM）
- [ ] ソーシャルシェア機能
- [ ] レビュー・評価システム
- [ ] 管理者ダッシュボード
