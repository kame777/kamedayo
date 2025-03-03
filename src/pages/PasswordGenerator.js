import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
  const { theme } = useTheme();
  const [passwordType, setPasswordType] = useState('random');
  const [passwordLength, setPasswordLength] = useState(30);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [customSymbols, setCustomSymbols] = useState('!@#$%^&*()_-+=<>?');
  const [showSymbolSettings, setShowSymbolSettings] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [coloredPassword, setColoredPassword] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // モバイル表示の検出
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // パスワードタイプの設定
  const handlePasswordTypeChange = (type) => {
    setPasswordType(type);
    // PINが選択された場合は長さを6に固定
    if (type === 'pin') {
      setPasswordLength(6);
    }
  };

  // パスワード生成関数
  const generatePassword = useCallback(() => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = customSymbols;
    let allowedChars = chars;
    
    if (includeNumbers) allowedChars += numbers;
    if (includeSymbols) allowedChars += symbols;

    let password = '';
    let passwordArray = [];

    if (passwordType === 'random') {
      // ランダムパスワード生成
      for (let i = 0; i < passwordLength; i++) {
        const randomChar = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
        password += randomChar;
        
        // 文字の種類を判定して色分け用に配列に格納
        if (numbers.includes(randomChar)) {
          passwordArray.push({ char: randomChar, type: 'number' });
        } else if (symbols.includes(randomChar)) {
          passwordArray.push({ char: randomChar, type: 'symbol' });
        } else {
          passwordArray.push({ char: randomChar, type: 'letter' });
        }
      }
    } else if (passwordType === 'memorable') {
      // 覚えやすいパスワード生成（単語ベース）
      const words = ['apple', 'banana', 'orange', 'grape', 'melon', 'cherry', 'lemon', 'peach', 'kiwi', 'mango'];
      let remainingLength = passwordLength;
      
      while (remainingLength > 0) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (randomWord.length <= remainingLength) {
          // 単語の最初の文字を大文字に
          const capitalizedWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
          password += capitalizedWord;
          
          // 文字ごとに配列に追加
          for (const char of capitalizedWord) {
            passwordArray.push({ char, type: 'letter' });
          }
          
          remainingLength -= randomWord.length;
          
          // 数字と記号を追加（設定に応じて）
          if (remainingLength > 0 && includeNumbers) {
            const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
            password += randomNum;
            passwordArray.push({ char: randomNum, type: 'number' });
            remainingLength--;
          }
          
          if (remainingLength > 0 && includeSymbols) {
            const randomSym = symbols.charAt(Math.floor(Math.random() * symbols.length));
            password += randomSym;
            passwordArray.push({ char: randomSym, type: 'symbol' });
            remainingLength--;
          }
        } else {
          // 残りの長さが短い場合はランダム文字で埋める
          const randomChar = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
          password += randomChar;
          
          if (numbers.includes(randomChar)) {
            passwordArray.push({ char: randomChar, type: 'number' });
          } else if (symbols.includes(randomChar)) {
            passwordArray.push({ char: randomChar, type: 'symbol' });
          } else {
            passwordArray.push({ char: randomChar, type: 'letter' });
          }
          
          remainingLength--;
        }
      }
    } else if (passwordType === 'pin') {
      // PIN生成（6桁の数字）
      const pinLength = 6; // PINは常に6桁
      for (let i = 0; i < pinLength; i++) {
        const randomNum = numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += randomNum;
        passwordArray.push({ char: randomNum, type: 'number' });
      }
    }
    
    setGeneratedPassword(password);
    setColoredPassword(passwordArray);
  }, [passwordType, passwordLength, includeNumbers, includeSymbols, customSymbols]);

  // パスワードタイプが変更されたときに再生成
  useEffect(() => {
    generatePassword();
  }, [passwordType, generatePassword]);

  // 記号の切り替え時に設定表示を制御
  useEffect(() => {
    if (!includeSymbols) {
      setShowSymbolSettings(false);
    }
  }, [includeSymbols]);

  // 初回レンダリング時にパスワードを生成
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // クリップボードにコピー
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className={`password-generator ${theme}`}>
      <div className="password-container">
        <h2>パスワードの種類を選択</h2>
        
        <div className="password-type-selector">
          <button 
            className={passwordType === 'random' ? 'active' : ''} 
            onClick={() => handlePasswordTypeChange('random')}
          >
            <span className="icon" role="img" aria-label="ランダム">
              🔀
            </span> {isMobile ? '乱数' : 'ランダム'}
          </button>
          <button 
            className={passwordType === 'memorable' ? 'active' : ''} 
            onClick={() => handlePasswordTypeChange('memorable')}
          >
            <span className="icon" role="img" aria-label="覚えやすい">
              👁️
            </span> {isMobile ? '記憶' : '覚えやすい'}
          </button>
          <button 
            className={passwordType === 'pin' ? 'active' : ''} 
            onClick={() => handlePasswordTypeChange('pin')}
          >
            <span className="icon">#</span> PIN
          </button>
        </div>
        
        <h2>新しいパスワードをカスタマイズ</h2>
        
        {passwordType !== 'pin' ? (
          // ランダム・覚えやすいパスワード用の設定
          <>
            <div className="option-row">
              <label>
                文字数
              </label>
              <div className="length-control">
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                />
                <input
                  type="number"
                  min="4"
                  max="64"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="length-input"
                />
              </div>
            </div>
            
            <div className="option-row">
              <label>数字</label>
              <div className={`toggle-switch ${includeNumbers ? 'active' : ''}`} onClick={() => setIncludeNumbers(!includeNumbers)}>
                <div className="toggle-button"></div>
              </div>
            </div>
            
            <div className="option-row">
              <label>記号</label>
              <div className={`toggle-switch ${includeSymbols ? 'active' : ''}`} onClick={() => {
                setIncludeSymbols(!includeSymbols);
                if (!includeSymbols) setShowSymbolSettings(true);
              }}>
                <div className="toggle-button"></div>
              </div>
            </div>
            
            {showSymbolSettings && includeSymbols && (
              <div className="symbol-settings">
                <label>使用する記号を入力してください：</label>
                <input
                  type="text"
                  value={customSymbols}
                  onChange={(e) => setCustomSymbols(e.target.value)}
                  className="symbol-input"
                />
              </div>
            )}
          </>
        ) : (
          // PIN用のメッセージ
          <div className="pin-info">
            <p>PINは6桁の数字で生成されます</p>
          </div>
        )}
        
        <h2>生成されたパスワード</h2>
        
        <div className="generated-password">
          <div className="password-display">
            {coloredPassword.map((item, index) => (
              <span key={index} className={`char ${item.type}`}>{item.char}</span>
            ))}
          </div>
        </div>
        
        <div className="button-row">
          <button className="copy-button" onClick={copyToClipboard}>
            {copySuccess ? 'コピー済' : 'パスワードをコピー'}
          </button>
          <button className="refresh-button" onClick={generatePassword}>
            {isMobile ? '更新' : 'パスワードを更新'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;