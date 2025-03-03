import React from 'react'
import Introduction from '../components/mainpage/Introduction'
import ToolList from '../components/mainpage/ToolList'
import { useTheme } from '../contexts/ThemeContext'
import './HomePage.css'

const HomePage = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`home-page ${theme === 'dark' ? 'home-page-dark' : ''}`}>
      <Introduction />
      <ToolList />
    </div>
  )
}

export default HomePage