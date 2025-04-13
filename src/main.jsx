import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import { LoaderProvider } from './hooks/useLoader.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </Router>
  </StrictMode>,
)
