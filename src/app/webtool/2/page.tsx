"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./PasswordGenerator.module.css";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

type Mode = "random" | "memorable" | "pin";
type CharItem = { char: string; type: "letter" | "number" | "symbol" };

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
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== "undefined" ? window.innerWidth <= 640 : false);

  useEffect(() => {
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
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.passwordGenerator}>
      <div className={styles.passwordContainer}>
        <Header />
        <h2 className={styles.heading}>パスワードの種類を選択</h2>

        <div className={styles.passwordTypeSelector}>
          <button
            type="button"
            className={`${styles.typeButton} ${passwordType === "random" ? styles.active : ""}`}
            onClick={() => handlePasswordTypeChange("random")}
          >
            <span className={styles.icon} role="img" aria-label="random">🔀</span> {isMobile ? "乱数" : "ランダム"}
          </button>

          <button
            type="button"
            className={`${styles.typeButton} ${passwordType === "memorable" ? styles.active : ""}`}
            onClick={() => handlePasswordTypeChange("memorable")}
          >
            <span className={styles.icon} role="img" aria-label="memorable">👁️</span> {isMobile ? "記憶" : "覚えやすい"}
          </button>

          <button
            type="button"
            className={`${styles.typeButton} ${passwordType === "pin" ? styles.active : ""}`}
            onClick={() => handlePasswordTypeChange("pin")}
          >
            <span className={styles.icon}>#</span> PIN
          </button>
        </div>

        <h2 className={styles.heading}>新しいパスワードをカスタマイズ</h2>

        {passwordType !== "pin" ? (
          <>
            <div className={styles.optionRow}>
              <label>文字数</label>
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
              <label>数字</label>
              <div
                role="button"
                tabIndex={0}
                className={`${styles.toggleSwitch} ${includeNumbers ? styles.active : ""}`}
                onClick={() => setIncludeNumbers(!includeNumbers)}
                onKeyDown={() => setIncludeNumbers(!includeNumbers)}
              >
                <div className={styles.toggleButton} />
              </div>
            </div>

            <div className={styles.optionRow}>
              <label>記号</label>
              <div
                role="button"
                tabIndex={0}
                className={`${styles.toggleSwitch} ${includeSymbols ? styles.active : ""}`}
                onClick={() => {
                  setIncludeSymbols(!includeSymbols);
                  if (!includeSymbols) setShowSymbolSettings(true);
                }}
                onKeyDown={() => {
                  setIncludeSymbols(!includeSymbols);
                  if (!includeSymbols) setShowSymbolSettings(true);
                }}
              >
                <div className={styles.toggleButton} />
              </div>
            </div>

            {showSymbolSettings && includeSymbols && (
              <div className={styles.symbolSettings}>
                <label>使用する記号を入力してください：</label>
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
          <div className={styles.pinInfo}><p>PINは6桁の数字で生成されます</p></div>
        )}

        <h2 className={styles.heading}>生成されたパスワード</h2>

        <div className={styles.generatedPassword}>
          <div className={styles.passwordDisplay}>
            {coloredPassword.map((item, idx) => (
              <span key={idx} className={`${styles.char} ${styles[item.type]}`}>{item.char}</span>
            ))}
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="button" className={styles.copyButton} onClick={copyToClipboard}>
            {copySuccess ? "コピー済" : "パスワードをコピー"}
          </button>
          <button type="button" className={styles.refreshButton} onClick={generatePassword}>
            {isMobile ? "更新" : "パスワードを更新"}
          </button>
        </div>
            <Footer />
      </div>
    </div>
  );
};

export default PasswordGenerator;
