# UIコンポーネント — 仕様書

共通UIコンポーネント。`src/app/components/ui/` に配置。

---

## Button

汎用ボタン。`href` を渡すと Next.js `<Link>` として動作。

**ファイル:** `src/app/components/ui/Button.tsx`

### Props

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | 見た目のスタイル |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'md'` | サイズ |
| `href` | `string` | — | 指定時は `<Link>` として描画 |
| `className` | `string` | — | 追加クラス |
| その他 | `button` / `Link` の標準属性 | — | そのまま渡される |

### バリアント

| variant | 見た目 |
|---|---|
| `primary` | グリーングラデーション背景、ホバーでシャイン |
| `secondary` | 透明背景＋ボーダー |
| `ghost` | 完全透明、ホバーで薄いグリーン背景 |
| `danger` | 赤色背景 |

### サイズ

| size | フォントサイズ | 用途 |
|---|---|---|
| `sm` | 0.8rem | 小さいアクションボタン |
| `md` | 0.93rem | 標準 |
| `lg` | 1rem | 目立たせたいCTA |
| `icon` | — | 32×32px 正方形（アイコン専用） |

### 使用例

```tsx
import Button from "../../components/ui/Button";

// 通常ボタン
<Button onClick={handleClick}>送信</Button>

// バリアント・サイズ指定
<Button variant="secondary" size="sm">キャンセル</Button>
<Button variant="danger">削除</Button>

// リンクボタン
<Button href="/webtool/1" variant="ghost">ツールへ</Button>

// アイコンボタン
<Button size="icon" aria-label="コピー">📋</Button>
```

---

## TabSelector

スライディングインジケーター付きのタブ切り替え UI。

**ファイル:** `src/app/components/ui/TabSelector.tsx`

### Props

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `activeKey` | `string` | 必須 | アクティブなタブのキー |
| `children` | `ReactNode` | 必須 | タブボタン要素 |
| `className` | `string` | `''` | 追加クラス |

### 動作仕様

- `data-active="true"` 属性を持つ `<button>` の位置にインジケーターバーが移動する
- インジケーターの位置・幅は `useTabIndicator` フックで計算（[hooks.md](./hooks.md) 参照）

### 使用例

```tsx
import TabSelector from "../../components/ui/TabSelector";

const [mode, setMode] = useState("a");

<TabSelector activeKey={mode}>
  {["a", "b", "c"].map((key) => (
    <button
      key={key}
      onClick={() => setMode(key)}
      data-active={mode === key ? "true" : undefined}
    >
      {key}
    </button>
  ))}
</TabSelector>
```

---

## HeroBanner

各ページ最上部のヒーローセクション。

**ファイル:** `src/app/components/HeroBanner.tsx`

### Props

| Prop | 型 | 説明 |
|---|---|---|
| `badge` | `ReactNode` | バッジ部分（アイコン＋ラベルなど） |
| `title` | `string` | メインタイトル |
| `subtitle` | `string` | サブタイトル |
| `children` | `ReactNode` | オプション。タイトル下に追加コンテンツを差し込む |

### 使用例

```tsx
import HeroBanner from "../../components/HeroBanner";

// 基本
<HeroBanner
  badge="📝 Text Counter"
  title="文字数カウンター"
  subtitle="文字数・行数・全角/半角をリアルタイムにカウント"
/>

// children あり
<HeroBanner badge="🔗" title="タイトル" subtitle="説明">
  <Button href="/docs">詳細を見る</Button>
</HeroBanner>
```

---

## Toast

→ [toast-notification.md](./toast-notification.md) を参照。
