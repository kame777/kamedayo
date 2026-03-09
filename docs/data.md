# データ・定数 — 仕様書

`src/app/data/` に配置。

---

## tools.ts

ツール一覧・ニュース・タイトルユーティリティ。

**ファイル:** `src/app/data/tools.ts`

### 型定義

```ts
type Tool = {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  status: 'live' | 'soon';
  url: string;
};
```

### エクスポート

#### `tools: Tool[]`

現在登録されているツール一覧。

| id | title | url | status |
|---|---|---|---|
| 1 | 文字数カウンター | `/webtool/1` | live |
| 2 | パスワード生成ツール | `/webtool/2` | live |
| 3 | 文章比較ツール（diff） | `/webtool/3` | live |
| 4 | 拡張子変換ツール | `/webtool/4` | live |
| 5 | PDFツール | `/webtool/5` | live |
| 6 | 短縮URL作成ツール | `/webtool/6` | live |
| 7 | QRコード生成ツール | `/webtool/7` | live |
| 8 | ポモドーロタイマー | `/webtool/8` | live |

#### `newsItems: { date: string, text: string }[]`

トップページに表示するニュース。

#### `buildTitle(name: string): string`

`"kamedayo | {name}"` 形式の文字列を返す。

```ts
buildTitle("文字数カウンター") // → "kamedayo | 文字数カウンター"
```

#### `getTitleById(id: number): string`

ツール ID からタイトル文字列を返す（`buildTitle` 適用済み）。

```ts
getTitleById(1) // → "kamedayo | 文字数カウンター"
```

### 新しいツールを追加するとき

`tools` 配列に1エントリ追加するだけでトップページのカード一覧に自動反映される。

```ts
{
  id: 9,
  icon: "🧮",
  title: "計算ツール",
  description: "四則演算を行います",
  category: "ユーティリティ",
  status: "live",
  url: "/webtool/9",
}
```

---

## constants.ts

パスワード生成ツールで使う文字セットなど。

**ファイル:** `src/app/data/constants.ts`

### エクスポート

| 定数 | 値 | 説明 |
|---|---|---|
| `LETTERS` | `'abcdefghij...XYZ'` | 英字52文字 |
| `DIGITS` | `'0123456789'` | 数字10文字 |
| `DEFAULT_SYMBOLS` | `'!@#$%^&*()_-+=<>?'` | デフォルト記号セット |
| `WORD_LIST` | `['apple', 'banana', ...]` | 覚えやすいパスワード用単語リスト |
| `MOBILE_BREAKPOINT` | `640` | モバイル判定のブレークポイント（px） |
