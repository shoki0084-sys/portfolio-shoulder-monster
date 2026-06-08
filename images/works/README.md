# 制作実績のスクリーンショット

トップのカードは **1枚目だけ** 表示します。詳細ページでは **2枚目以降も含めて縦に並べて** 表示します。

## ファイル名のルール

| 枚目 | ファイル名の例（作品IDが `bodymake` の場合） |
|------|---------------------------------------------|
| 1枚目 | `bodymake.png` |
| 2枚目 | `bodymake2.png` |
| 3枚目 | `bodymake3.png` |
| 4枚目 | `bodymake4.png` |

ハイフン付きの作品はそのまま続けます（例: `meet-minutes.png` → `meet-minutes2.png`）。

## 作品ごとの一覧

| 1枚目 | 追加（あれば） | 作品 |
|-------|----------------|------|
| `bodymake.png` | `bodymake2`〜`4` | AIボディメイク管理 |
| `quiz.png` | `quiz2`〜`4` | フィットネスクイズ AI |
| `dify-line.png` | （1枚のみ） | Dify × LINE |
| `meal.png` | `meal2`, `meal3` | 今夜のご飯何にしよう？ |
| `meet-minutes.png` | `meet-minutes2` | Meet議事録自動生成 |
| `touring.png` | `touring2`〜`5` | ツーリングプランナー |

枚数を増やしたときは `js/work-page.js` の `WORK_SCREENSHOTS` にファイル名（拡張子なし）を追加してください。

## 保存のコツ

- 形式: **PNG** 推奨
- 縦長の画面もそのまま保存してOK（詳細ページでは高さを切らず表示）
- 個人情報・APIキーは写る前にモザイク

## 撮影後

1. このフォルダに保存
2. ブラウザで詳細ページを開き **Ctrl + F5**
3. GitHub Pages へ push
