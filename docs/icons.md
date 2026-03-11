# SVGアイコン — 仕様書

プロジェクト全体で使用するSVGアイコンを一元管理するファイル。

**ファイル:** `src/app/components/Icons.tsx`

---

## 基本仕様

- すべてのアイコンは `stroke="currentColor"` または `fill="currentColor"` を使用し、親要素の `color` に追従する
- `aria-hidden="true"` を付与済み（スクリーンリーダーから非表示）
- `size` prop で幅・高さを統一して指定できる

### Props

| Prop | 型 | デフォルト | 説明 |
|---|---|---|---|
| `size` | `number` | アイコンによる | 幅・高さ（px） |

### 使用例

```tsx
import { DownloadIcon, InfoIcon } from "../../components/Icons";

// サイズ指定
<DownloadIcon size={16} />

// ボタン内（Button は inline-flex なので中央揃え済み）
<Button onClick={handleDownload}>
  <DownloadIcon size={14} /> ダウンロード
</Button>

// h2 など flex でない要素に入れる場合は display: flex を親に付ける
// .title { display: flex; align-items: center; gap: 0.4rem; }
<h2 className={styles.title}><InfoIcon size={16} /> 使い方</h2>
```

---

## アイコン一覧

### Blog

| コンポーネント | デフォルトサイズ | 用途 |
|---|---|---|
| `PenIcon` | 16 | 編集・記事作成 |
| `CalendarIcon` | 16 | 日付・スケジュール |
| `PlusIcon` | 16 | 追加・新規作成 |

### Contact

| コンポーネント | デフォルトサイズ | 用途 |
|---|---|---|
| `MailIcon` | 16 | メール・お問い合わせ |
| `XIcon` | 32 | X（旧Twitter）ロゴ |
| `ArrowUpRightIcon` | 16 | 外部リンク |

### QRコード生成ツール (webtool/7)

| コンポーネント | デフォルトサイズ | 用途 |
|---|---|---|
| `QrCodeIcon` | 16 | QRコード |
| `WarningIcon` | 16 | 警告・エラーメッセージ |
| `ClipboardIcon` | 16 | クリップボードコピー |

### 汎用

| コンポーネント | デフォルトサイズ | 用途 |
|---|---|---|
| `DownloadIcon` | 16 | ダウンロード |
| `CopyIcon` | 14 | コピー |
| `TrashIcon` | 16 | 削除 |
| `CloseIcon` | 14 | 閉じる・削除 |
| `LockIcon` | 18 | パスワード・ロック |
| `ErrorIcon` | 18 | エラー |
| `InfoIcon` | 16 | 情報・「使い方」見出し |
| `AlertIcon` | 16 | 注意・アラート |
| `LinkIcon` | 16 | リンク・URL |

### URL短縮ツール (webtool/6)

| コンポーネント | デフォルトサイズ | 用途 |
|---|---|---|
| `HistoryIcon` | 16 | 履歴 |

### コンバーター (webtool/4)

| コンポーネント | デフォルトサイズ | 用途 |
|---|---|---|
| `ConvertIcon` | 18 | 変換実行 |
| `ImageModeIcon` | 18 | 画像モード |
| `VideoModeIcon` | 18 | 動画モード |
| `FolderIcon` | 18 | ファイル選択 |
| `FilmIcon` | 18 | 動画ファイル |

### PDFツール (webtool/5)

| コンポーネント | デフォルトサイズ | 用途 |
|---|---|---|
| `MergeIcon` | 18 | PDF結合 |
| `SplitIcon` | 18 | PDF分割 |
| `ExtractIcon` | 18 | ページ抽出 |
| `CompressIcon` | 18 | 圧縮 |
| `ImgToPdfIcon` | 18 | 画像→PDF変換 |
| `PdfToImgIcon` | 18 | PDF→画像変換 |
| `DocumentIcon` | 24 | PDFドキュメント |
| `ImageFrameIcon` | 24 | 画像フレーム |
| `PdfTrashIcon` | 16 | PDF削除（strokeWidth 1.75） |
| `PdfDownloadIcon` | 16 | PDFダウンロード（strokeWidth 1.75） |
| `PdfLockIcon` | 28 | PDFパスワード（strokeWidth 1.5） |
| `ChevronUpIcon` | 12 | 上矢印 |
| `ChevronDownIcon` | 12 | 下矢印 |
| `GripIcon` | 14 | ドラッグハンドル |

---

## アイコンを追加する

`src/app/components/Icons.tsx` に追記するだけでよい。

```tsx
export function MyIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* SVGパス */}
    </svg>
  );
}
```

### 注意事項

- 既存のアイコンと重複しないか確認してから追加する
- `fill` で塗りつぶすアイコン（`XIcon`, `GripIcon` など）は `fill="currentColor"` を svg に付け、`stroke` 属性は省略する
- PDFツール用のアイコンは全体的に `strokeWidth` が細め（1.5〜1.75）なので合わせる
