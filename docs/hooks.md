# カスタムフック — 仕様書

共通フック。`src/app/hooks/` に配置。

---

## useToast

→ [toast-notification.md](./toast-notification.md) を参照。

---

## useCountUp

数値を 0 からアニメーションしながらカウントアップする。

**ファイル:** `src/app/hooks/useCountUp.ts`

### シグネチャ

```ts
useCountUp(end: number, duration?: number, delay?: number)
  → { count: number, ref: RefObject<HTMLElement> }
```

### 引数

| 引数 | 型 | デフォルト | 説明 |
|---|---|---|---|
| `end` | `number` | 必須 | 最終値 |
| `duration` | `number` | `1500` | アニメーション時間（ms） |
| `delay` | `number` | `0` | 開始までの遅延（ms） |

### 返り値

| プロパティ | 型 | 説明 |
|---|---|---|
| `count` | `number` | 現在のカウント値 |
| `ref` | `RefObject<HTMLElement>` | 監視対象要素に付与する ref |

### 動作仕様

- `ref` を付与した要素が viewport に入った瞬間にカウントアップ開始（IntersectionObserver, threshold: 0.3）
- イージング: ease-out cubic（最初は速く、最後はゆっくり）
- 一度開始したら再スクロールしても再実行されない

### 使用例

```tsx
import { useCountUp } from "../../hooks/useCountUp";

const { count, ref } = useCountUp(1000, 1500, 200);
return <p ref={ref}>{count.toLocaleString()}</p>;
```

---

## useScrollReveal

スクロール時にクラスを付与してアニメーションをトリガーする。

**ファイル:** `src/app/hooks/useScrollReveal.ts`

### シグネチャ

```ts
useScrollReveal<T extends HTMLElement>(
  selector: string,
  visibleClass: string,
  options?: IntersectionObserverInit,
  resetKey?: unknown,
) → RefObject<T>
```

### 引数

| 引数 | 型 | デフォルト | 説明 |
|---|---|---|---|
| `selector` | `string` | 必須 | コンテナ内の監視対象要素のCSSセレクタ |
| `visibleClass` | `string` | 必須 | viewport内に入ったときに付与するクラス名 |
| `options` | `IntersectionObserverInit` | `{ threshold: 0.1 }` | IntersectionObserver オプション |
| `resetKey` | `unknown` | — | 変更時に監視を再セットアップするキー |

### 返り値

`RefObject<T>` — コンテナ要素に付与する ref。

### 動作仕様

- コンテナの `ref` 要素内の `selector` に一致する子要素を監視
- 各要素が viewport に入ったら `visibleClass` を付与し、以降の監視を解除
- `resetKey` が変わると監視を再セットアップ（動的リストのリセットに使う）

### 使用例

```tsx
import { useScrollReveal } from "../../hooks/useScrollReveal";

// CSSで .card { opacity: 0 } / .card.visible { opacity: 1; transition: ... }
const ref = useScrollReveal<HTMLDivElement>(".card", "visible");

return (
  <div ref={ref}>
    <div className="card">カード1</div>
    <div className="card">カード2</div>
  </div>
);
```

---

## useTabIndicator

タブセレクターのスライディングインジケーターの位置を計算する。

**ファイル:** `src/app/hooks/useTabIndicator.ts`

### シグネチャ

```ts
useTabIndicator<T>(activeKey: T, persistenceKey?: string)
  → { containerRef: RefObject<HTMLDivElement>, indicatorStyle: { transform: string, width: string } }
```

### 引数

| 引数 | 型 | デフォルト | 説明 |
|---|---|---|---|
| `activeKey` | `T` | 必須 | アクティブなタブのキー（`data-active="true"` のボタンを追跡） |
| `persistenceKey` | `string` | — | sessionStorage に状態を保存するキー |

### 返り値

| プロパティ | 型 | 説明 |
|---|---|---|
| `containerRef` | `RefObject<HTMLDivElement>` | タブコンテナに付与する ref |
| `indicatorStyle.transform` | `string` | `translateX(Xpx)` 形式 |
| `indicatorStyle.width` | `string` | `Xpx` 形式 |

### 動作仕様

- コンテナ内の `data-active="true"` を持つ `<button>` の `offsetLeft` と `offsetWidth` を取得してスタイルを計算
- `activeKey` が変わるたびに再計算
- `persistenceKey` を指定すると sessionStorage に位置を保存し、ページ遷移後も位置を維持

### 使用例

通常は `TabSelector` コンポーネント経由で間接的に使う。
直接使う場合:

```tsx
import { useTabIndicator } from "../../hooks/useTabIndicator";

const { containerRef, indicatorStyle } = useTabIndicator(activeTab, "myTabsKey");

return (
  <div ref={containerRef} style={{ position: "relative" }}>
    <div style={{ position: "absolute", bottom: 0, height: 2, background: "green", transition: "all 0.3s", ...indicatorStyle }} />
    <button data-active={activeTab === "a" ? "true" : undefined} onClick={() => setActiveTab("a")}>A</button>
    <button data-active={activeTab === "b" ? "true" : undefined} onClick={() => setActiveTab("b")}>B</button>
  </div>
);
```
