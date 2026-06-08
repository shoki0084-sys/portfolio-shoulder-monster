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

- GitHub Pages / Netlify / Vercel などにフォルダごとアップロード
- `index.html` がルートにある構成

## 制作実績の画像（実画面スクリーンショット）

`images/works/` にスクリーンショットを置きます。

- **1枚目**: `bodymake.png` など（トップのカードにも使用）
- **2枚目以降**: `bodymake2.png`, `bodymake3.png` …（詳細ページで縦に表示）

手順・作品一覧は `images/works/README.md` を参照。枚数の定義は `js/work-page.js` の `WORK_SCREENSHOTS` です。
