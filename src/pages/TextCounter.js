import React, { useState, useRef } from 'react';
import './TextCounter.css';
import { useTheme } from '../contexts/ThemeContext';

const TextCounter = () => {
    const [text, setText] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [copied, setCopied] = useState(false);
    const [textStats, setTextStats] = useState({
        totalCharCount: 0,
        nonSpaceCharCount: 0,
        fullWidthCharCount: 0,
        halfWidthCharCount: 0,
        lineCount: 0
    });
    const textareaRef = useRef(null);
    const { theme } = useTheme();

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        updateTextStats(newText);
    };

    const handleTextSelect = (e) => {
        const selected = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
        setSelectedText(selected);
    };

    const updateTextStats = (text) => {
        const totalCharCount = text.length;
        const nonSpaceCharCount = text.replace(/\s+/g, '').length;
        const fullWidthCharCount = (text.match(/[\u3000-\uFFEF]/g) || []).length;
        const halfWidthCharCount = totalCharCount - fullWidthCharCount;
        const lineCount = text ? text.split('\n').length : 0;

        setTextStats({
            totalCharCount,
            nonSpaceCharCount,
            fullWidthCharCount,
            halfWidthCharCount,
            lineCount
        });
    };

    const clearText = () => {
        setText('');
        setSelectedText('');
        updateTextStats('');
    };

    const copyText = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const pasteText = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(clipboardText);
            updateTextStats(clipboardText);
        } catch (err) {
            console.error('クリップボードからの読み込みに失敗しました:', err);
            alert('クリップボードの内容を読み込めませんでした。ブラウザの権限設定を確認してください。');
        }
    };

    const selectedCharCount = selectedText.length;
    const selectedLineCount = selectedText ? selectedText.split('\n').length : 0;

    return (
        <div className={`container ${theme}`}>
            <h1>文字数カウンター</h1>
            
            <div className="button-group">
                <button onClick={clearText}>クリア</button>
                <button onClick={copyText}>
                    {copied ? 'コピー済み！' : 'テキストをコピー'}
                </button>
                <button onClick={pasteText}>ペースト</button>
            </div>
            
            <textarea
                ref={textareaRef}
                value={text}
                onChange={handleTextChange}
                onSelect={handleTextSelect}
                placeholder="ここにテキストを入力してください..."
                rows="10"
                className={theme}
            />
            
            <div className="stats-container">
                <div className="stat-group">
                    <h2>基本統計</h2>
                    <div className="counter">
                        <p>全体文字数: <span>{textStats.totalCharCount}</span></p>
                        <p>スペースと改行を除く文字数: <span>{textStats.nonSpaceCharCount}</span></p>
                        <p>全角文字数: <span>{textStats.fullWidthCharCount}</span></p>
                        <p>半角文字数: <span>{textStats.halfWidthCharCount}</span></p>
                        <p>行数: <span>{textStats.lineCount}</span></p>
                    </div>
                </div>
                
                <div className="stat-group">
                    <h2>選択部分の統計</h2>
                    <div className="counter">
                        <p>選択された文字数: <span>{selectedText ? selectedCharCount : "-"}</span></p>
                        <p>選択された行数: <span>{selectedText ? selectedLineCount : "-"}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextCounter;