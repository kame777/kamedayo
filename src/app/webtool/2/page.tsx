"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./PasswordGenerator.module.css";
import HeroBanner from '../../components/HeroBanner';
import Button from '../../components/ui/Button';
import TabSelector from '../../components/ui/TabSelector';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { LETTERS, DIGITS, DEFAULT_SYMBOLS, WORD_LIST, MOBILE_BREAKPOINT } from '../../data/constants';
import { LockIcon, ShuffleIcon, EyeIcon, RefreshCwIcon, ClipboardIcon, InfoIcon } from '../../components/Icons';
import type { ReactNode } from 'react';


type Mode = "random" | "memorable" | "pin";
type CharItem = { char: string; type: "letter" | "number" | "symbol" };

const modes: { key: Mode; icon: ReactNode; label: string; shortLabel: string }[] = [
  { key: "random", icon: <ShuffleIcon size={14} />, label: "ランダム", shortLabel: "乱数" },
  { key: "memorable", icon: <EyeIcon size={14} />, label: "覚えやすい", shortLabel: "記憶" },
  { key: "pin", icon: "#", label: "PIN", shortLabel: "PIN" },
];

/** crypto.getRandomValues を使った安全な乱数インデックス（rejection sampling で一様分布） */
function secureRandomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max; // 2^32 以下で max の最大の倍数
  let value: number;
  do {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return value % max;
}

const PasswordGenerator: React.FC = () => {
  useEffect(() => { document.title = 'kamedayo | パスワード生成ツール'; }, []);
  const [passwordType, setPasswordType] = useState<Mode>("random");
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [prevLength, setPrevLength] = useState<number>(16);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [customSymbols, setCustomSymbols] = useState<string>(DEFAULT_SYMBOLS);
  const [showSymbolSettings, setShowSymbolSettings] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [coloredPassword, setColoredPassword] = useState<CharItem[]>([]);
  const { toast, showToast } = useToast();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handlePasswordTypeChange = (type: Mode) => {
    if (type === "pin") {
      setPrevLength(passwordLength);
      setPasswordLength(6);
    } else if (passwordType === "pin") {
      setPasswordLength(prevLength);
    }
    setPasswordType(type);
  };

  const generatePassword = useCallback(() => {
    const symbols = customSymbols || "";
    let allowedChars = LETTERS;
    if (includeNumbers) allowedChars += DIGITS;
    if (includeSymbols) allowedChars += symbols;

    let password = "";
    const passwordArray: CharItem[] = [];

    if (passwordType === "random") {
      for (let i = 0; i < passwordLength; i++) {
        const randomChar = allowedChars.charAt(secureRandomIndex(allowedChars.length));
        password += randomChar;
        if (DIGITS.includes(randomChar)) passwordArray.push({ char: randomChar, type: "number" });
        else if (symbols.includes(randomChar)) passwordArray.push({ char: randomChar, type: "symbol" });
        else passwordArray.push({ char: randomChar, type: "letter" });
      }
    } else if (passwordType === "memorable") {
      let remainingLength = passwordLength;
      while (remainingLength > 0) {
        const randomWord = WORD_LIST[secureRandomIndex(WORD_LIST.length)];
        if (randomWord.length <= remainingLength) {
          const capitalizedWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
          password += capitalizedWord;
          for (const c of capitalizedWord) passwordArray.push({ char: c, type: "letter" });
          remainingLength -= randomWord.length;
          if (remainingLength > 0 && includeNumbers) {
            const randomNum = DIGITS.charAt(secureRandomIndex(DIGITS.length));
            password += randomNum;
            passwordArray.push({ char: randomNum, type: "number" });
            remainingLength--;
          }
          if (remainingLength > 0 && includeSymbols && symbols.length > 0) {
            const randomSym = symbols.charAt(secureRandomIndex(symbols.length));
            password += randomSym;
            passwordArray.push({ char: randomSym, type: "symbol" });
            remainingLength--;
          }
        } else {
          const randomChar = allowedChars.charAt(secureRandomIndex(allowedChars.length));
          password += randomChar;
          if (DIGITS.includes(randomChar)) passwordArray.push({ char: randomChar, type: "number" });
          else if (symbols.includes(randomChar)) passwordArray.push({ char: randomChar, type: "symbol" });
          else passwordArray.push({ char: randomChar, type: "letter" });
          remainingLength--;
        }
      }
    } else if (passwordType === "pin") {
      for (let i = 0; i < 6; i++) {
        const randomNum = DIGITS.charAt(secureRandomIndex(DIGITS.length));
        password += randomNum;
        passwordArray.push({ char: randomNum, type: "number" });
      }
    }

    setGeneratedPassword(password);
    setColoredPassword(passwordArray);
  }, [passwordType, passwordLength, includeNumbers, includeSymbols, customSymbols]);

  useEffect(() => { generatePassword(); }, [generatePassword]);

  useEffect(() => {
    if (!includeSymbols) setShowSymbolSettings(false);
  }, [includeSymbols]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      showToast("コピーしました！");
    } catch { /* ignore */ }
  };

  return (
    <>
      <HeroBanner
        badge={<><LockIcon size={15} /> Password Generator</>}
        title="パスワード生成ツール"
        subtitle="安全なパスワードをワンクリックで生成"
      />

      <main className={styles.container}>
        {/* Mode selector */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>パスワードの種類</h2>
          <TabSelector activeKey={passwordType} className={styles.modeSelector}>
            {modes.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`${styles.modeBtn} ${passwordType === m.key ? styles.modeBtnActive : ""}`}
                onClick={() => handlePasswordTypeChange(m.key)}
                data-active={passwordType === m.key ? "true" : undefined}
              >
                <span className={styles.modeIcon}>{m.icon}</span>
                {isMobile ? m.shortLabel : m.label}
              </button>
            ))}
          </TabSelector>
        </div>

        {/* Options */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>カスタマイズ</h2>
          <div className={styles.optionsCard}>
            {passwordType !== "pin" ? (
              <>
                <div className={styles.optionRow}>
                  <label className={styles.optionLabel}>文字数</label>
                  <div className={styles.lengthControl}>
                    <input
                      type="range"
                      min={4}
                      max={64}
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(Number(e.target.value))}
                      className={styles.range}
                    />
                    <input
                      type="number"
                      min={4}
                      max={64}
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(Number(e.target.value))}
                      className={styles.lengthInput}
                    />
                  </div>
                </div>

                <div className={styles.optionRow}>
                  <label className={styles.optionLabel}>数字を含む</label>
                  <div
                    role="switch"
                    aria-checked={includeNumbers}
                    tabIndex={0}
                    className={`${styles.toggle} ${includeNumbers ? styles.toggleOn : ""}`}
                    onClick={() => setIncludeNumbers(!includeNumbers)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIncludeNumbers(!includeNumbers); } }}
                  >
                    <div className={styles.toggleThumb} />
                  </div>
                </div>

                <div className={styles.optionRow}>
                  <label className={styles.optionLabel}>記号を含む</label>
                  <div
                    role="switch"
                    aria-checked={includeSymbols}
                    tabIndex={0}
                    className={`${styles.toggle} ${includeSymbols ? styles.toggleOn : ""}`}
                    onClick={() => {
                      setIncludeSymbols(!includeSymbols);
                      if (!includeSymbols) setShowSymbolSettings(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIncludeSymbols(!includeSymbols);
                        if (!includeSymbols) setShowSymbolSettings(true);
                      }
                    }}
                  >
                    <div className={styles.toggleThumb} />
                  </div>
                </div>

                {showSymbolSettings && includeSymbols && (
                  <div className={styles.symbolRow}>
                    <label className={styles.optionLabel}>使用する記号</label>
                    <input
                      type="text"
                      value={customSymbols}
                      onChange={(e) => setCustomSymbols(e.target.value)}
                      className={styles.symbolInput}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className={styles.pinNotice}>
                <InfoIcon size={14} />
                PINは6桁の数字で生成されます
              </div>
            )}
          </div>
        </div>

        {/* Generated password */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>生成されたパスワード</h2>
          <div className={styles.resultCard}>
            <div className={styles.passwordDisplay}>
              {coloredPassword.map((item, idx) => (
                <span key={idx} className={`${styles.char} ${styles[item.type]}`}>{item.char}</span>
              ))}
            </div>
            <div className={styles.resultActions}>
              <Button size="sm" onClick={copyToClipboard}><ClipboardIcon size={14} /> コピー</Button>
              <Button variant="secondary" size="sm" onClick={generatePassword}>
                <><RefreshCwIcon size={14} /> {isMobile ? "更新" : "再生成"}</>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Toast message={toast} />
    </>
  );
};

export default PasswordGenerator;
