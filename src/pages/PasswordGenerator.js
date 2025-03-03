import React from 'react'
import './PasswordGenerator.css'
import { useTheme } from '../contexts/ThemeContext';

const PasswordGenerator = () => {
  const { theme } = useTheme();

  return (
    <>
      <h1 className={`coming-soon ${theme}`}>工事中です<br />ご迷惑をおかけします。</h1>
    </>
  )
}

export default PasswordGenerator