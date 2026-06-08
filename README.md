# 肩幅モンスター — ポートフォリオサイト

AI × Fitness × Automation Engineer のプロフィールサイト（最終課題）。

## 構成

```
8-5 最終課題/
├── index.html          # メインページ（TOP / Profile / Skills / Works / Contact）
├── works-*.html        # 制作実績の詳細（6本）
├── css/style.css
├── js/site-config.js   # ★ URL設定はここ
├── js/main.js
├── images/
│   ├── profile.png     # プロフィール写真（加工なし）
│   ├── line-qr.png     # 公式LINE QR
│   └── works/          # 制作実績スクリーンショット（6枚・上書きで差し替え）
└── README.md
```

## 公開前の設定

`js/site-config.js` を編集してください。

```javascript
lineUrl: "https://line.me/R/ti/p/@あなたのID",  // 公式LINE
github: "https://github.com/...",               // 任意
demos: { bodymake: "https://...", ... },        // デモURL
githubRepos: { bodymake: "https://...", ... }, // 各リポジトリ
```

## ローカルで表示

```bash
cd "8-5 最終課題"
python -m http.server 8080
```

ブラウザで http://localhost:8080 を開く。

## デプロイ

### Vercel（おすすめ）

静的HTMLサイトのため、**ビルドコマンド不要**です。

#### 方法A: GitHub 連携（いちばん簡単）

1. [Vercel](https://vercel.com) にログイン（GitHub アカウント連携）
2. **Add New → Project**
3. リポジトリ `portfolio-shoulder-monster` を Import
4. 設定を確認（そのままでOK）:
   - **Framework Preset**: Other
   - **Build Command**: （空欄）
   - **Output Directory**: `.`（ルート）
   - **Install Command**: （空欄）
5. **Deploy** をクリック

数分後、`https://portfolio-shoulder-monster-xxxx.vercel.app` のようなURLが発行されます。

**更新の流れ**: ローカルで編集 → `git push` → Vercel が自動で再デプロイ

#### 方法B: CLI からデプロイ

```powershell
cd "c:\Users\User\AI課題\8-5 最終課題"
npx vercel login
npx vercel
npx vercel --prod
```

初回はプロジェクト名などを聞かれます。そのまま Enter で問題ありません。

#### 公開後にやること

デプロイURLが決まったら、次を Vercel のURLに合わせて更新してください。

- `sitemap.xml` の `<loc>` 一覧
- `robots.txt` の `Sitemap:` 行（あれば）

`vercel.json` により、HTML/CSS/JS は更新がすぐ反映され、画像は1日キャッシュされます。

### GitHub Pages

従来どおり `https://shoki0084-sys.github.io/portfolio-shoulder-monster/` でも公開可能です。Vercel と併用する場合、どちらかをメインURLに決めると分かりやすいです。

## 制作実績の画像（実画面スクリーンショット）

`images/works/` にスクリーンショットを置きます。

- **1枚目**: `bodymake.png` など（トップのカードにも使用）
- **2枚目以降**: `bodymake2.png`, `bodymake3.png` …（詳細ページで縦に表示）

手順・作品一覧は `images/works/README.md` を参照。枚数の定義は `js/work-page.js` の `WORK_SCREENSHOTS` です。
