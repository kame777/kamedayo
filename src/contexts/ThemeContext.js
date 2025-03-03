import React, { createContext, useState, useEffect, useContext } from 'react';

// テーマコンテキストを作成
const ThemeContext = createContext();

// テーマプロバイダーコンポーネント
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // 初期化時にローカルストレージからテーマを取得
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      applyThemeToBody(storedTheme);
    }
  }, []);

  // テーマが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyThemeToBody(theme);
  }, [theme]);

  // bodyクラスにテーマを適用
  const applyThemeToBody = (currentTheme) => {
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // テーマ切り替え関数
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// テーマを使用するためのカスタムフック
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};