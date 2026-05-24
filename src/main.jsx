import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
    <SpeedInsights scriptSrc={import.meta.env.PROD ? 'https://va.vercel-scripts.com/v1/speed-insights/script.js' : undefined} />
  </StrictMode>,
)
