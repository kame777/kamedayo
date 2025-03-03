import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './Kamesuki.css';

const Kamesuki = () => {
  const { theme } = useTheme();
  
  const redirect = () => {
    window.location.href = "https://misskey.kamedayo.com";
  };

  return (
    <div className={`redirect-button ${theme === 'dark' ? 'redirect-button-dark' : ''}`}>
      <button 
        onClick={redirect}
        className={theme === 'dark' ? 'dark-button' : ''}
      >
        かめすきーをチェックする！
      </button>
    </div>
  );
};

export default Kamesuki;