"use client";

import React, { useState, useMemo, useCallback } from "react";
import styles from "./DiffTool.module.css";
import HeroBanner from "../../components/HeroBanner";

/* ───────── Types ───────── */
type DiffLineType = "added" | "removed" | "unchanged";

type DiffResult = {
  type: DiffLineType;
  leftLine?: string;
  rightLine?: string;
  leftNum?: number;
  rightNum?: number;
};

type ViewMode = "side" | "unified";

/* ───────── LCS diff algorithm ───────── */
function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
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

/* ───────── Inline char diff ───────── */
function charDiff(
  a: string,
  b: string,
): { aChars: { ch: string; hl: boolean }[]; bChars: { ch: string; hl: boolean }[] } {
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

  const aRes: { ch: string; hl: boolean }[] = [];
  const bRes: { ch: string; hl: boolean }[] = [];
  let i = m,
    j = n;

  const aStack: { ch: string; hl: boolean }[] = [];
  const bStack: { ch: string; hl: boolean }[] = [];

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

  aStack.reverse().forEach((c) => aRes.push(c));
  bStack.reverse().forEach((c) => bRes.push(c));

  return { aChars: aRes, bChars: bRes };
}

/* ───────── Sample texts ───────── */
const SAMPLE_OLD = `HTML（HyperText Markup Language）は、
Webページの構造を定義するための言語です。
見出し、段落、リンク、画像など、
さまざまな要素をタグで記述します。
ブラウザがHTMLを解釈して画面に表示します。`;

const SAMPLE_NEW = `HTML（HyperText Markup Language）は、
Webページの構造を定義するためのマークアップ言語です。
見出し、段落、リンク、画像、動画など、
さまざまな要素をタグで記述します。
CSSと組み合わせてスタイルを指定します。
ブラウザがHTMLを解釈してレンダリングします。`;

/* ───────── Component ───────── */
export default function DiffTool() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
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

  /* Pair consecutive removed + added for inline char diff */
  const pairedDiff = useMemo(() => {
    const result: (
      | DiffResult
      | { type: "modified"; leftLine: string; rightLine: string; leftNum: number; rightNum: number }
    )[] = [];
    let i = 0;
    while (i < diff.length) {
      if (
        diff[i].type === "removed" &&
        i + 1 < diff.length &&
        diff[i + 1].type === "added"
      ) {
        result.push({
          type: "modified",
          leftLine: diff[i].leftLine!,
          rightLine: diff[i + 1].rightLine!,
          leftNum: diff[i].leftNum!,
          rightNum: diff[i + 1].rightNum!,
        });
        i += 2;
      } else {
        result.push(diff[i]);
        i++;
      }
    }
    return result;
  }, [diff]);

  const hasDiff = oldText.length > 0 || newText.length > 0;

  const handleClear = useCallback(() => {
    setOldText("");
    setNewText("");
  }, []);

  const handleSwap = useCallback(() => {
    setOldText(newText);
    setNewText(oldText);
  }, [oldText, newText]);

  const handleSample = useCallback(() => {
    setOldText(SAMPLE_OLD);
    setNewText(SAMPLE_NEW);
  }, []);

  return (
    <>
      <HeroBanner
        badge="🔍 Diff Tool"
        title="文章比較ツール"
        subtitle="2つの文章を比較して差分をハイライト表示"
      />

      <main className={styles.container}>
        {/* Action buttons */}
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleClear}>
            🗑️ クリア
          </button>
          <button className={styles.button} onClick={handleSwap}>
            🔄 テキストを入れ替え
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleSample}
          >
            📄 サンプルテキスト
          </button>
        </div>

        {/* Input areas */}
        <div className={styles.inputGrid}>
          <div className={styles.inputPane}>
            <label className={styles.inputLabel}>変更前（元のテキスト）</label>
            <textarea
              className={styles.textarea}
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="ここに元のテキストを入力..."
              rows={10}
            />
          </div>
          <div className={styles.inputPane}>
            <label className={styles.inputLabel}>変更後（新しいテキスト）</label>
            <textarea
              className={styles.textarea}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
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

              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${viewMode === "side" ? styles.viewBtnActive : ""}`}
                  onClick={() => setViewMode("side")}
                >
                  並列表示
                </button>
                <button
                  className={`${styles.viewBtn} ${viewMode === "unified" ? styles.viewBtnActive : ""}`}
                  onClick={() => setViewMode("unified")}
                >
                  統合表示
                </button>
              </div>
            </div>

            {/* Diff result */}
            <div className={styles.diffContainer}>
              {viewMode === "side" ? (
                <div className={styles.sideBySide}>
                  {/* Left pane */}
                  <div className={styles.diffPane}>
                    <div className={styles.diffPaneHeader}>変更前</div>
                    <div className={styles.diffLines}>
                      {pairedDiff.map((d, idx) => {
                        if (d.type === "unchanged") {
                          return (
                            <div
                              key={idx}
                              className={`${styles.diffLine} ${styles.lineUnchanged}`}
                            >
                              <span className={styles.lineNum}>{d.leftNum}</span>
                              <span className={styles.lineText}>{d.leftLine}</span>
                            </div>
                          );
                        }
                        if (d.type === "removed") {
                          return (
                            <div
                              key={idx}
                              className={`${styles.diffLine} ${styles.lineRemoved}`}
                            >
                              <span className={styles.lineNum}>{d.leftNum}</span>
                              <span className={styles.lineText}>
                                <span className={styles.linePrefix}>−</span>
                                {d.leftLine}
                              </span>
                            </div>
                          );
                        }
                        if (d.type === "modified") {
                          const { aChars } = charDiff(
                            (d as { leftLine: string }).leftLine,
                            (d as { rightLine: string }).rightLine,
                          );
                          return (
                            <div
                              key={idx}
                              className={`${styles.diffLine} ${styles.lineRemoved}`}
                            >
                              <span className={styles.lineNum}>
                                {(d as { leftNum: number }).leftNum}
                              </span>
                              <span className={styles.lineText}>
                                <span className={styles.linePrefix}>−</span>
                                {aChars.map((c, ci) => (
                                  <span
                                    key={ci}
                                    className={c.hl ? styles.charHighlightRemoved : ""}
                                  >
                                    {c.ch}
                                  </span>
                                ))}
                              </span>
                            </div>
                          );
                        }
                        /* added → blank on left */
                        return (
                          <div
                            key={idx}
                            className={`${styles.diffLine} ${styles.lineBlank}`}
                          >
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
                      {pairedDiff.map((d, idx) => {
                        if (d.type === "unchanged") {
                          return (
                            <div
                              key={idx}
                              className={`${styles.diffLine} ${styles.lineUnchanged}`}
                            >
                              <span className={styles.lineNum}>{d.rightNum}</span>
                              <span className={styles.lineText}>{d.rightLine}</span>
                            </div>
                          );
                        }
                        if (d.type === "added") {
                          return (
                            <div
                              key={idx}
                              className={`${styles.diffLine} ${styles.lineAdded}`}
                            >
                              <span className={styles.lineNum}>{d.rightNum}</span>
                              <span className={styles.lineText}>
                                <span className={styles.linePrefix}>+</span>
                                {d.rightLine}
                              </span>
                            </div>
                          );
                        }
                        if (d.type === "modified") {
                          const { bChars } = charDiff(
                            (d as { leftLine: string }).leftLine,
                            (d as { rightLine: string }).rightLine,
                          );
                          return (
                            <div
                              key={idx}
                              className={`${styles.diffLine} ${styles.lineAdded}`}
                            >
                              <span className={styles.lineNum}>
                                {(d as { rightNum: number }).rightNum}
                              </span>
                              <span className={styles.lineText}>
                                <span className={styles.linePrefix}>+</span>
                                {bChars.map((c, ci) => (
                                  <span
                                    key={ci}
                                    className={c.hl ? styles.charHighlightAdded : ""}
                                  >
                                    {c.ch}
                                  </span>
                                ))}
                              </span>
                            </div>
                          );
                        }
                        /* removed → blank on right */
                        return (
                          <div
                            key={idx}
                            className={`${styles.diffLine} ${styles.lineBlank}`}
                          >
                            <span className={styles.lineNum} />
                            <span className={styles.lineText} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Unified view */
                <div className={styles.unifiedPane}>
                  <div className={styles.diffLines}>
                    {pairedDiff.map((d, idx) => {
                      if (d.type === "unchanged") {
                        return (
                          <div
                            key={idx}
                            className={`${styles.diffLine} ${styles.lineUnchanged}`}
                          >
                            <span className={styles.lineNum}>{d.leftNum}</span>
                            <span className={styles.lineNum}>{d.rightNum}</span>
                            <span className={styles.lineText}> {d.leftLine}</span>
                          </div>
                        );
                      }
                      if (d.type === "removed") {
                        return (
                          <div
                            key={idx}
                            className={`${styles.diffLine} ${styles.lineRemoved}`}
                          >
                            <span className={styles.lineNum}>{d.leftNum}</span>
                            <span className={styles.lineNum} />
                            <span className={styles.lineText}>
                              <span className={styles.linePrefix}>−</span>
                              {d.leftLine}
                            </span>
                          </div>
                        );
                      }
                      if (d.type === "added") {
                        return (
                          <div
                            key={idx}
                            className={`${styles.diffLine} ${styles.lineAdded}`}
                          >
                            <span className={styles.lineNum} />
                            <span className={styles.lineNum}>{d.rightNum}</span>
                            <span className={styles.lineText}>
                              <span className={styles.linePrefix}>+</span>
                              {d.rightLine}
                            </span>
                          </div>
                        );
                      }
                      /* modified → show both lines */
                      const md = d as {
                        leftLine: string;
                        rightLine: string;
                        leftNum: number;
                        rightNum: number;
                      };
                      const { aChars, bChars } = charDiff(md.leftLine, md.rightLine);
                      return (
                        <React.Fragment key={idx}>
                          <div
                            className={`${styles.diffLine} ${styles.lineRemoved}`}
                          >
                            <span className={styles.lineNum}>{md.leftNum}</span>
                            <span className={styles.lineNum} />
                            <span className={styles.lineText}>
                              <span className={styles.linePrefix}>−</span>
                              {aChars.map((c, ci) => (
                                <span
                                  key={ci}
                                  className={
                                    c.hl ? styles.charHighlightRemoved : ""
                                  }
                                >
                                  {c.ch}
                                </span>
                              ))}
                            </span>
                          </div>
                          <div
                            className={`${styles.diffLine} ${styles.lineAdded}`}
                          >
                            <span className={styles.lineNum} />
                            <span className={styles.lineNum}>{md.rightNum}</span>
                            <span className={styles.lineText}>
                              <span className={styles.linePrefix}>+</span>
                              {bChars.map((c, ci) => (
                                <span
                                  key={ci}
                                  className={
                                    c.hl ? styles.charHighlightAdded : ""
                                  }
                                >
                                  {c.ch}
                                </span>
                              ))}
                            </span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!hasDiff && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>テキストを入力すると差分が表示されます</p>
          </div>
        )}
      </main>
    </>
  );
}
