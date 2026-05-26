import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Interceptor global para agregar el URL base a todas las peticiones fetch
const originalFetch = window.fetch;
window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = import.meta.env.VITE_API_URL || (isLocal ? "http://localhost:8080" : "https://marimonbackend.onrender.com");
  
  if (typeof input === 'string') {
    if (input.startsWith('/api/')) {
      input = `${API_URL}${input}`;
    } else if (input.startsWith('http://localhost:8080/api/')) {
      input = input.replace('http://localhost:8080', API_URL);
    }
  }
  
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
