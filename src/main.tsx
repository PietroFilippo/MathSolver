import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'

// Detecta o esquema de cores preferido do usuário
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkScheme && !localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'dark');
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
