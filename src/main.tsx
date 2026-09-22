import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Order matters: tokens first, then Tailwind's reset, then our base rules
// so the pixel contract wins over preflight, then the component skins.
import './styles/tokens.css'
import './styles/tailwind.css'
import './styles/base.css'
import './styles/dither.css'
import './styles/pixel.css'
import './styles/cursor.css'
import './styles/lotus.css'
import './styles/sections.css'
import './styles/airlock.css'
import './styles/scroll.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
