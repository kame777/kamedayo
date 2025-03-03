import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TextCounter from './pages/TextCounter';
import PasswordGenerator from './pages/PasswordGenerator';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ホームページ用のルート */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          
          {/* ツールページ用のルート */}
          <Route path="/pages/TextCounter" element={
            <Layout>
              <TextCounter />
            </Layout>
          } />
          <Route path="/pages/PasswordGenerator" element={
            <Layout>
              <PasswordGenerator />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;