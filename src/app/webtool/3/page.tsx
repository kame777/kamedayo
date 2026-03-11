"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import styles from "./DiffTool.module.css";
import HeroBanner from "../../components/HeroBanner";
import Button from "../../components/ui/Button";
import { SearchIcon, TrashIcon, SwapIcon, DocumentIcon } from "../../components/Icons";
import TabSelector from "../../components/ui/TabSelector";


/* ───────── Types ───────── */
type DiffLineType = "added" | "removed" | "unchanged";

type DiffResult = {
  type: DiffLineType;
  leftLine?: string;
  rightLine?: string;
  leftNum?: number;
  rightNum?: number;
};

type PairedItem =
  | DiffResult
  | {
      type: "modified";
      leftLine: string;
      rightLine: string;
      leftNum: number;
      rightNum: number;
    };

type ViewMode = "side" | "unified";

/* ───────── LCS diff (line level) ───────── */
function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp;
}

function computeDiff(oldText: string, newText: string): DiffResult[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  const dp = computeLCS(oldLines, newLines);

  const stack: DiffResult[] = [];
  let i = oldLines.length;
  let j = newLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({
        type: "unchanged",
        leftLine: oldLines[i - 1],
        rightLine: newLines[j - 1],
        leftNum: i,
        rightNum: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", rightLine: newLines[j - 1], rightNum: j });
      j--;
    } else {
      stack.push({ type: "removed", leftLine: oldLines[i - 1], leftNum: i });
      i--;
    }
  }
  return stack.reverse();
}

/* ───────── Char-level LCS diff ───────── */
type CharItem = { ch: string; hl: boolean };

function charDiff(
  a: string,
  b: string,
): { aChars: CharItem[]; bChars: CharItem[] } {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const aStack: CharItem[] = [];
  const bStack: CharItem[] = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      aStack.push({ ch: a[i - 1], hl: false });
      bStack.push({ ch: b[j - 1], hl: false });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      bStack.push({ ch: b[j - 1], hl: true });
      j--;
    } else {
      aStack.push({ ch: a[i - 1], hl: true });
      i--;
    }
  }

  return { aChars: aStack.reverse(), bChars: bStack.reverse() };
}

/* ───────── Sample texts ───────── */
const SAMPLE_OLD = `あのイーハトーヴォのすきとおった風、
夏でも底に冷たさをもつ青いそら、
うつくしい森で飾られたモリーオ市、
郊外のぎらぎらひかる草の波。
また そのなかでいっしょになった
たくさんのひとたち、
ファゼーロとロザーロ、
羊飼のミーロや、顔の赤いこどもたち、
地主のテーモ、山猫博士の
ボーガント・デストゥパーゴなど、
いまこの暗い巨きな石の建物の
なかで考えていると、
みんなむかし風のなつかしい
青い幻燈のように思われます。`;

const SAMPLE_NEW = `あのイーハトーヴォのすきとおった風、
夏でも底に冷たさをもつ青い空、
うつくしい森で飾られたモリーオ市、
郊外のぎらぎらひかる草の波。
そのなかでいっしょになった
たくさんのひとたち、
ファゼーロとロザーロ、
羊飼のミーロや、顔の赤いこどもたち、
地主のテーモ、山猫博士の
ボーガント・デストゥパーゴなど。
いまこの暗い巨きな石の建物の
なかで考えていると、
みんな昔風のなつかしい
青い幻燈のように思われます。
`;

/* ───────── Pair removed+added into "modified" ───────── */
function pairDiff(diff: DiffResult[]): PairedItem[] {
  const result: PairedItem[] = [];
  let i = 0;
  while (i < diff.length) {
    if (diff[i].type === "removed") {
      // 連続する removed をまとめて収集
      const removed: DiffResult[] = [];
      while (i < diff.length && diff[i].type === "removed") {
        removed.push(diff[i++]);
      }
      // 続く連続する added をまとめて収集
      const added: DiffResult[] = [];
      while (i < diff.length && diff[i].type === "added") {
        added.push(diff[i++]);
      }
      // min(removed, added) 分を modified としてペアリング
      const count = Math.min(removed.length, added.length);
      for (let k = 0; k < count; k++) {
        result.push({
          type: "modified",
          leftLine: removed[k].leftLine!,
          rightLine: added[k].rightLine!,
          leftNum: removed[k].leftNum!,
          rightNum: added[k].rightNum!,
        });
      }
      // 余った removed / added はそのまま追加
      for (let k = count; k < removed.length; k++) result.push(removed[k]);
      for (let k = count; k < added.length; k++) result.push(added[k]);
    } else {
      result.push(diff[i++]);
    }
  }
  return result;
}

/* ───────── Render helpers ───────── */
function renderChars(chars: CharItem[], className: string) {
  const groups: { hl: boolean; text: string }[] = [];
  for (const c of chars) {
    if (groups.length > 0 && groups[groups.length - 1].hl === c.hl) {
      groups[groups.length - 1].text += c.ch;
    } else {
      groups.push({ hl: c.hl, text: c.ch });
    }
  }
  return groups.map((g, i) =>
    g.hl ? (
      <span key={i} className={className}>
        {g.text}
      </span>
    ) : (
      <React.Fragment key={i}>{g.text}</React.Fragment>
    ),
  );
}

/* ───────── Component ───────── */
export default function DiffTool() {
  useEffect(() => { document.title = 'kamedayo | 文章比較ツール'; }, []);
  const [oldText, setOldText] = useState(SAMPLE_OLD);
  const [newText, setNewText] = useState(SAMPLE_NEW);
  const [isSampleOld, setIsSampleOld] = useState(true);
  const [isSampleNew, setIsSampleNew] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("side");

  const diff = useMemo(() => computeDiff(oldText, newText), [oldText, newText]);

  const stats = useMemo(() => {
    let added = 0,
      removed = 0,
      unchanged = 0;
    diff.forEach((d) => {
      if (d.type === "added") added++;
      else if (d.type === "removed") removed++;
      else unchanged++;
    });
    return { added, removed, unchanged };
  }, [diff]);

  const paired = useMemo(() => pairDiff(diff), [diff]);

  const hasDiff = oldText.length > 0 || newText.length > 0;

  const handleClear = useCallback(() => {
    setOldText("");
    setNewText("");
    setIsSampleOld(false);
    setIsSampleNew(false);
  }, []);

  const handleSwap = useCallback(() => {
    setOldText(newText);
    setNewText(oldText);
  }, [oldText, newText]);

  const handleSample = useCallback(() => {
    setOldText(SAMPLE_OLD);
    setNewText(SAMPLE_NEW);
    setIsSampleOld(true);
    setIsSampleNew(true);
  }, []);

  const handleOldFocus = useCallback(() => {
    if (isSampleOld) {
      setOldText("");
      setIsSampleOld(false);
    }
  }, [isSampleOld]);

  const handleNewFocus = useCallback(() => {
    if (isSampleNew) {
      setNewText("");
      setIsSampleNew(false);
    }
  }, [isSampleNew]);

  /* ── Side-by-side render ── */
  const renderSideBySide = () => (
    <div className={styles.sideBySide}>
      {/* Left pane */}
      <div className={styles.diffPane}>
        <div className={styles.diffPaneHeader}>変更前</div>
        <div className={styles.diffLines}>
          {paired.map((d, idx) => {
            if (d.type === "unchanged") {
              return (
                <div key={idx} className={styles.diffLine}>
                  <span className={styles.lineNum}>{d.leftNum}</span>
                  <span className={styles.lineText}>{d.leftLine}</span>
                </div>
              );
            }
            if (d.type === "removed") {
              return (
                <div key={idx} className={styles.diffLine}>
                  <span className={styles.lineNum}>{d.leftNum}</span>
                  <span className={styles.lineText}>
                    <span className={styles.hlRemoved}>{d.leftLine}</span>
                  </span>
                </div>
              );
            }
            if (d.type === "modified") {
              const md = d as {
                leftLine: string;
                rightLine: string;
                leftNum: number;
              };
              const { aChars } = charDiff(md.leftLine, md.rightLine);
              return (
                <div key={idx} className={styles.diffLine}>
                  <span className={styles.lineNum}>{md.leftNum}</span>
                  <span className={styles.lineText}>
                    {renderChars(aChars, styles.hlRemoved)}
                  </span>
                </div>
              );
            }
            /* added → blank on left */
            return (
              <div key={idx} className={`${styles.diffLine} ${styles.lineBlank}`}>
                <span className={styles.lineNum} />
                <span className={styles.lineText} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right pane */}
      <div className={styles.diffPane}>
        <div className={styles.diffPaneHeader}>変更後</div>
        <div className={styles.diffLines}>
          {paired.map((d, idx) => {
            if (d.type === "unchanged") {
              return (
                <div key={idx} className={styles.diffLine}>
                  <span className={styles.lineNum}>{d.rightNum}</span>
                  <span className={styles.lineText}>{d.rightLine}</span>
                </div>
              );
            }
            if (d.type === "added") {
              return (
                <div key={idx} className={styles.diffLine}>
                  <span className={styles.lineNum}>{d.rightNum}</span>
                  <span className={styles.lineText}>
                    <span className={styles.hlAdded}>{d.rightLine}</span>
                  </span>
                </div>
              );
            }
            if (d.type === "modified") {
              const md = d as {
                leftLine: string;
                rightLine: string;
                rightNum: number;
              };
              const { bChars } = charDiff(md.leftLine, md.rightLine);
              return (
                <div key={idx} className={styles.diffLine}>
                  <span className={styles.lineNum}>{md.rightNum}</span>
                  <span className={styles.lineText}>
                    {renderChars(bChars, styles.hlAdded)}
                  </span>
                </div>
              );
            }
            /* removed → blank on right */
            return (
              <div key={idx} className={`${styles.diffLine} ${styles.lineBlank}`}>
                <span className={styles.lineNum} />
                <span className={styles.lineText} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ── Unified inline render ── */
  const renderUnified = () => {
    type Seg = { kind: "text" | "removed" | "added"; text: string };
    type ULine = { leftNum?: number; rightNum?: number; type: DiffLineType | "modified"; segs: Seg[] };

    const lines: ULine[] = [];

    const buildInlineSegs = (aChars: CharItem[], bChars: CharItem[]): Seg[] => {
      const segs: Seg[] = [];
      let ai = 0, bi = 0;
      while (ai < aChars.length || bi < bChars.length) {
        let buf = "";
        while (ai < aChars.length && aChars[ai].hl) { buf += aChars[ai++].ch; }
        if (buf) segs.push({ kind: "removed", text: buf });
        buf = "";
        while (bi < bChars.length && bChars[bi].hl) { buf += bChars[bi++].ch; }
        if (buf) segs.push({ kind: "added", text: buf });
        buf = "";
        while (ai < aChars.length && !aChars[ai].hl && bi < bChars.length && !bChars[bi].hl) {
          buf += aChars[ai++].ch; bi++;
        }
        if (buf) segs.push({ kind: "text", text: buf });
        if (!buf && ai >= aChars.length && bi >= bChars.length) break;
      }
      return segs;
    };

    for (const d of paired) {
      if (d.type === "unchanged") {
        lines.push({ leftNum: d.leftNum, rightNum: d.rightNum, type: "unchanged", segs: [{ kind: "text", text: d.leftLine! }] });
      } else if (d.type === "removed") {
        lines.push({ leftNum: d.leftNum, type: "removed", segs: [{ kind: "removed", text: d.leftLine! }] });
      } else if (d.type === "added") {
        lines.push({ rightNum: d.rightNum, type: "added", segs: [{ kind: "added", text: d.rightLine! }] });
      } else if (d.type === "modified") {
        const md = d as { leftLine: string; rightLine: string; leftNum: number; rightNum: number };
        const { aChars, bChars } = charDiff(md.leftLine, md.rightLine);
        lines.push({ leftNum: md.leftNum, rightNum: md.rightNum, type: "modified", segs: buildInlineSegs(aChars, bChars) });
      }
    }

    return (
      <div className={styles.unifiedPane}>
        {lines.map((line, i) => (
          <div key={i} className={`${styles.diffLine} ${line.type === "removed" ? styles.unifiedLineRemoved : line.type === "added" ? styles.unifiedLineAdded : ""}`}>
            <span className={styles.lineNum}>{line.leftNum ?? ""}</span>
            <span className={styles.lineNum}>{line.rightNum ?? ""}</span>
            <span className={styles.lineText}>
              {line.segs.map((s, j) => {
                if (s.kind === "removed") return <span key={j} className={styles.inlineRemoved}>{s.text}</span>;
                if (s.kind === "added") return <span key={j} className={styles.inlineAdded}>{s.text}</span>;
                return <React.Fragment key={j}>{s.text}</React.Fragment>;
              })}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <HeroBanner
        badge={<><SearchIcon size={15} /> Diff Tool</>}
        title="文章比較ツール"
        subtitle="2つの文章を比較して差分をハイライト表示"
      />

      <main className={styles.container}>
        {/* Action buttons */}
        <div className={styles.buttonGroup}>
          <Button variant="secondary" onClick={handleClear}><TrashIcon size={14} /> クリア</Button>
          <Button variant="secondary" onClick={handleSwap}><SwapIcon size={14} /> テキストを入れ替え</Button>
          <Button onClick={handleSample}><DocumentIcon size={14} /> サンプルテキスト</Button>
        </div>

        {/* Input areas */}
        <div className={styles.inputGrid}>
          <div className={styles.inputPane}>
            <label className={styles.inputLabel}>変更前（元のテキスト）</label>
            <textarea
              className={`${styles.textarea} ${isSampleOld ? styles.textareaSample : ''}`}
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              onFocus={handleOldFocus}
              placeholder="ここに元のテキストを入力..."
              rows={10}
            />
          </div>
          <div className={styles.inputPane}>
            <label className={styles.inputLabel}>変更後（新しいテキスト）</label>
            <textarea
              className={`${styles.textarea} ${isSampleNew ? styles.textareaSample : ''}`}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onFocus={handleNewFocus}
              placeholder="ここに新しいテキストを入力..."
              rows={10}
            />
          </div>
        </div>

        {/* Stats & view toggle */}
        {hasDiff && (
          <>
            <div className={styles.statsBar}>
              <div className={styles.statsGroup}>
                <span className={`${styles.statChip} ${styles.statAdded}`}>
                  +{stats.added} 追加
                </span>
                <span className={`${styles.statChip} ${styles.statRemoved}`}>
                  −{stats.removed} 削除
                </span>
                <span className={`${styles.statChip} ${styles.statUnchanged}`}>
                  {stats.unchanged} 変更なし
                </span>
              </div>

              <TabSelector activeKey={viewMode} className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === "side" ? styles.viewBtnActive : ""}`}
                  onClick={() => setViewMode("side")}
                  data-active={viewMode === "side" ? "true" : undefined}
                >
                  並列表示
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === "unified" ? styles.viewBtnActive : ""}`}
                  onClick={() => setViewMode("unified")}
                  data-active={viewMode === "unified" ? "true" : undefined}
                >
                  統合表示
                </button>
              </TabSelector>
            </div>

            {/* Diff result */}
            <div className={styles.diffContainer}>
              {viewMode === "side" ? renderSideBySide() : renderUnified()}
            </div>
          </>
        )}

        {!hasDiff && (
          <div className={styles.emptyState}>
            <SearchIcon size={32} />
            <p>テキストを入力すると差分が表示されます</p>
          </div>
        )}
      </main>
    </>
  );
}
