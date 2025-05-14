import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './assets/styles/main.scss'

// Initialize the document with system theme preference on load
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme') || 'system';
document.documentElement.setAttribute('data-theme', savedTheme !== 'system' ? savedTheme : (prefersDarkMode ? 'dark' : 'light'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
