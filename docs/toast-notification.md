# Toast通知 — 仕様書

画面下部にポップアップ表示するトースト通知の共通実装。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `src/app/hooks/useToast.ts` | 表示状態とタイマー管理のカスタムフック |
| `src/app/components/ui/Toast.tsx` | 表示コンポーネント |
| `src/app/components/ui/Toast.module.css` | スタイル |

## 使い方

```tsx
import { Toast } from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";

export default function MyToolPage() {
  const { toast, showToast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText("some text");
    showToast("コピーしました！");
  };

  return (
    <>
      <main>
        <button onClick={handleCopy}>コピー</button>
      </main>
      <Toast message={toast} />  {/* <>直下・<main>の外に配置 */}
    </>
  );
}
```

## API

### `useToast(duration?: number)`

| 引数 | 型 | デフォルト | 説明 |
|---|---|---|---|
| `duration` | `number` | `2000` | トーストが消えるまでの時間（ms） |

**返り値**

| プロパティ | 型 | 説明 |
|---|---|---|
| `toast` | `string \| null` | 現在表示中のメッセージ（null = 非表示） |
| `showToast` | `(message: string) => void` | トーストを表示する関数 |

### `<Toast message={...} />`

| Props | 型 | 説明 |
|---|---|---|
| `message` | `string \| null` | 表示するメッセージ。null のとき何も描画しない |

## 動作仕様

- `showToast()` を呼ぶたびに既存のタイマーをリセットして再表示される
- 表示 → 1.75s後にフェードアウトアニメーション → 2s後に非表示
- `position: fixed` で画面下部中央に固定表示（スクロール位置に依存しない）
- `pointer-events: none` のためトーストはクリック操作を妨げない

## 導入済みツール

| ツール | ページ | トリガー |
|---|---|---|
| 短縮URLツール | `webtool/6` | URLコピー時 |
| 文字数カウンター | `webtool/1` | テキストコピー時 |
| パスワード生成ツール | `webtool/2` | パスワードコピー時 |
| QRコード生成ツール | `webtool/7` | 画像コピー時 |

## CSS変数依存

`.toast` はグローバルのCSS変数 `--primary` を背景色に使用。
プロジェクトのテーマ（ライト/ダークモード）に自動追従する。
