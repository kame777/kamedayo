import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`header ${theme === 'dark' ? 'header-dark' : ''}`}>
            <div className="header-left">
                <Link to="/" className="site-title">
                    <h1>kameテスト用サイト</h1>
                </Link>
            </div>
            
            <div className="header-controls">
                <nav className="header-nav">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        HOME
                    </Link>
                    <Link to="/pages/TextCounter" className={location.pathname === '/pages/TextCounter' ? 'active' : ''}>
                        文字数カウンター
                    </Link>
                    <Link to="/pages/PasswordGenerator" className={location.pathname === '/tools/password' ? 'active' : ''}>
                        パスワード生成
                    </Link>
                </nav>
                
                <button onClick={toggleTheme} className="theme-button">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                
                <div className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            
            {/* モバイルメニュー */}
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    HOME
                </Link>
                <Link to="/pages/TextCounter" className={location.pathname === '/pages/TextCounter' ? 'active' : ''}>
                    文字数カウンター
                </Link>
                <Link to="/tools/password" className={location.pathname === '/tools/password' ? 'active' : ''}>
                    パスワード生成
                </Link>
                <button onClick={toggleTheme} className="theme-button mobile">
                    {theme === 'dark' ? 'ライトモード ☀️' : 'ダークモード 🌙'}
                </button>
            </div>
        </header>
    );
};

export default Header;