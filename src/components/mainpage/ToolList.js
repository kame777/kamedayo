import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './ToolList.css';

const tools = [
    {
        path: '/pages/TextCounter',
        img: 'img/TextCounter.png',
        alt: '文字数カウンターの画像',
        title: '文字数カウンター',
        description: 'シンプルで多機能な文字数カウンター',
    },
    {
        path: '/pages/PasswordGenerator',
        img: 'img/PasswordGenerator.png',
        alt: 'パスワード生成ツールの画像',
        title: 'パスワード生成ツール',
        description: '小文字や大文字・記号の有無など詳細な設定が可能',
    },
];

const ToolList = () => {
    const { theme } = useTheme();
    
    return (
        <section className={`tool-list ${theme === 'dark' ? 'tool-list-dark' : ''}`}>
            <h2>Webツール</h2>
            <h3>既存のツールで「あったら良いな」という機能を盛りこんで作っちゃった！ってやつを置いてます</h3>
            <ul>
                {tools.map((tool, index) => (
                    <li key={index} className={`tool-item ${theme === 'dark' ? 'tool-item-dark' : ''}`}>
                        <Link to={tool.path}>
                            <div>
                                <img src={tool.img} alt={tool.alt} />
                                <h3>{tool.title}</h3>
                                <p>{tool.description}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ToolList;