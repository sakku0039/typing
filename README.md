# ローマ字スタータイピング

小学生がローマ字入力を楽しく練習できる、静的HTML/CSS/JavaScript製のWebアプリです。GitHub Pagesなどに置くだけで動作し、`questions.json` を更新することでクラス全員に同じ問題を配信できます。

## 公開URL

https://sakku0039.github.io/typing/

## ファイル構成

- `index.html`: 生徒用ゲーム画面
- `admin.html`: 管理者用ページ
- `questions.json`: クラス共有用の出題データ。ゲーム起動時に最優先で読み込みます。
- `sample-import.json`: インポート例
- `shared.js`, `app.js`, `admin.js`, `styles.css`: アプリ本体

## 使い方

### 生徒側

`index.html` を開きます。GitHub PagesなどのWeb公開環境では、ゲーム起動時に同じフォルダの `questions.json` を読み込みます。

### 管理者側

1. `admin.html` を開きます。
2. 初期管理者パスワード `romaji-admin` でログインします。
3. JSONを直接編集するか、外部AIで作ったJSONを貼り付けます。
4. 「チェック」で形式を確認します。
5. 「共有用 questions.json をダウンロード」を押します。
6. GitHub Pagesで公開しているリポジトリの `questions.json` を、ダウンロードした同名ファイルで置き換えます。

これで生徒が通常の `index.html` を開いたとき、更新後の問題を読み込めます。

## GitHub Pagesでの運用例

1. GitHubに新しいリポジトリを作成します。
2. このフォルダ内のファイルをすべてアップロードします。
3. GitHub Pagesを有効にします。
4. 生徒には Pages の `index.html` のURLを共有します。
5. 問題を更新するときは、管理者ページから `questions.json` をダウンロードし、リポジトリ上の `questions.json` を置き換えます。

ブラウザキャッシュ対策として、アプリは `questions.json` にキャッシュ回避用のクエリを付けて読み込みます。更新後すぐに反映されない端末では、ブラウザの再読み込みをしてください。

## ローカルで確認する場合

`file://` で直接 `index.html` を開くと、ブラウザ制限により `questions.json` の自動読み込みができない場合があります。確認時はローカルサーバーで開くのがおすすめです。

```bash
python3 -m http.server 8000
# ブラウザで http://localhost:8000/index.html を開く
```

管理者ページで「このブラウザに保存」を押した内容は、その端末の `localStorage` にだけ保存されます。共有版では通常 `questions.json` が優先されます。ローカル保存内容を確認したい場合は、管理者ページの「保存内容を確認」または次のURLを使ってください。

```text
index.html?source=local
```

## 実装済み機能

- 小学生向けのリッチなネオン/スター演出UI
- 60秒ミッションと、時間制限なしの「じっくり練習」
- ローマ字入力練習モード
- `shi/si`, `chi/ti`, `tsu/tu`, `sha/sya` などの入力ゆれ対応
- 小さい「っ」、拗音「ゃ/ゅ/ょ」、「ん」の基本対応
- コンボ、正確さ、召喚レベル、スコア、結果ランク
- キーボード表示と次に押すキーのハイライト
- 管理者ページのパスワード保護
- JSONインポート、直接編集、整形、チェック、エクスポート、初期化
- 外部AIに渡す「インポート用JSON生成プロンプト」のコピー機能
- クラス共有用 `questions.json` の読み込みとダウンロード

## インポートJSON形式

```json
{
  "schema": "romaji-star-typing.v1",
  "appTitle": "ローマ字スタータイピング",
  "appSubtitle": "小学生向けのローマ字入力練習",
  "lessons": [
    {
      "id": "festival-words",
      "title": "お祭りことば",
      "description": "夏祭りのことばを練習します。",
      "difficulty": "★★☆",
      "timeLimit": 60,
      "words": [
        { "text": "おまつり", "kana": "おまつり", "hint": "tsu / tu どちらでもOK" }
      ]
    }
  ]
}
```

- `text`: 画面に表示する語句です。漢字を含めても構いません。
- `kana`: ローマ字入力に変換する読みです。ひらがな中心で入れてください。
- `hint`: 任意のヒントです。
- `romaji`: 任意です。特殊な読みを許可したい場合だけ、文字列または文字列配列で指定できます。

## 注意

このアプリは静的フロントエンドのみで構成されています。管理者パスワードは通常利用での誤操作を防ぐための簡易保護です。GitHub上の `questions.json` をブラウザから直接書き換えることはできないため、共有更新時はファイルの置き換えが必要です。本格的なログイン管理やリアルタイム共有が必要な場合は、Firebase、Supabase、自前APIなどのサーバー側保存を追加してください。
