"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./PasswordGenerator.module.css";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

type Mode = "random" | "memorable" | "pin";
type CharItem = { char: string; type: "letter" | "number" | "symbol" };

const modes: { key: Mode; icon: string; label: string; shortLabel: string }[] = [
  { key: "random", icon: "🔀", label: "ランダム", shortLabel: "乱数" },
  { key: "memorable", icon: "👁️", label: "覚えやすい", shortLabel: "記憶" },
  { key: "pin", icon: "#", label: "PIN", shortLabel: "PIN" },
];

const PasswordGenerator: React.FC = () => {
  const [passwordType, setPasswordType] = useState<Mode>("random");
  const [passwordLength, setPasswordLength] = useState<number>(30);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [customSymbols, setCustomSymbols] = useState<string>("!@#$%^&*()_-+=<>?");
  const [showSymbolSettings, setShowSymbolSettings] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [coloredPassword, setColoredPassword] = useState<CharItem[]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 640);
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePasswordTypeChange = (type: Mode) => {
    setPasswordType(type);
    if (type === "pin") setPasswordLength(6);
  };

  const generatePassword = useCallback(() => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = customSymbols || "";
    let allowedChars = letters;
    if (includeNumbers) allowedChars += numbers;
    if (includeSymbols) allowedChars += symbols;

    let password = "";
    const passwordArray: CharItem[] = [];

    if (passwordType === "random") {
      for (let i = 0; i < passwordLength; i++) {
        const randomChar = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
        password += randomChar;
        if (numbers.includes(randomChar)) passwordArray.push({ char: randomChar, type: "number" });
        else if (symbols.includes(randomChar)) passwordArray.push({ char: randomChar, type: "symbol" });
        else passwordArray.push({ char: randomChar, type: "letter" });
      }
    } else if (passwordType === "memorable") {
      const words = ["apple", "banana", "orange", "grape", "melon", "cherry", "lemon", "peach", "kiwi", "mango"];
      let remainingLength = passwordLength;
      while (remainingLength > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (randomWord.length <= remainingLength) {
          const capitalizedWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
          password += capitalizedWord;
          for (const c of capitalizedWord) passwordArray.push({ char: c, type: "letter" });
          remainingLength -= randomWord.length;
          if (remainingLength > 0 && includeNumbers) {
            const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
            password += randomNum;
            passwordArray.push({ char: randomNum, type: "number" });
            remainingLength--;
          }
          if (remainingLength > 0 && includeSymbols && symbols.length > 0) {
            const randomSym = symbols.charAt(Math.floor(Math.random() * symbols.length));
            password += randomSym;
            passwordArray.push({ char: randomSym, type: "symbol" });
            remainingLength--;
          }
        } else {
          const randomChar = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
          password += randomChar;
          if (numbers.includes(randomChar)) passwordArray.push({ char: randomChar, type: "number" });
          else if (symbols.includes(randomChar)) passwordArray.push({ char: randomChar, type: "symbol" });
          else passwordArray.push({ char: randomChar, type: "letter" });
          remainingLength--;
        }
      }
    } else if (passwordType === "pin") {
      for (let i = 0; i < 6; i++) {
        const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
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
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <>
      <Header />

      {/* Hero */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>🔐 Password Generator</span>
          <h1 className={styles.heroTitle}>パスワードジェネレーター</h1>
          <p className={styles.heroSubtitle}>
            安全なパスワードをワンクリックで生成
          </p>
        </div>
      </section>

      <main className={styles.container}>
        {/* Mode selector */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>パスワードの種類</h2>
          <div className={styles.modeSelector}>
            {modes.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`${styles.modeBtn} ${passwordType === m.key ? styles.modeBtnActive : ""}`}
                onClick={() => handlePasswordTypeChange(m.key)}
              >
                <span className={styles.modeIcon}>{m.icon}</span>
                {isMobile ? m.shortLabel : m.label}
              </button>
            ))}
          </div>
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
                    role="button"
                    tabIndex={0}
                    className={`${styles.toggle} ${includeNumbers ? styles.toggleOn : ""}`}
                    onClick={() => setIncludeNumbers(!includeNumbers)}
                    onKeyDown={() => setIncludeNumbers(!includeNumbers)}
                  >
                    <div className={styles.toggleThumb} />
                  </div>
                </div>

                <div className={styles.optionRow}>
                  <label className={styles.optionLabel}>記号を含む</label>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`${styles.toggle} ${includeSymbols ? styles.toggleOn : ""}`}
                    onClick={() => {
                      setIncludeSymbols(!includeSymbols);
                      if (!includeSymbols) setShowSymbolSettings(true);
                    }}
                    onKeyDown={() => {
                      setIncludeSymbols(!includeSymbols);
                      if (!includeSymbols) setShowSymbolSettings(true);
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
                <span className={styles.pinIcon}>📌</span>
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
              <button type="button" className={styles.copyBtn} onClick={copyToClipboard}>
                {copySuccess ? "✅ コピー済み" : "📋 コピー"}
              </button>
              <button type="button" className={styles.refreshBtn} onClick={generatePassword}>
                🔄 {isMobile ? "更新" : "再生成"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PasswordGenerator;
