import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

if (rootElement) {
  rootElement.className = 'bg-gray-900 min-h-screen';
}

if (document.documentElement) {
  document.documentElement.className = 'bg-gray-900';
}
if (document.body) {
  document.body.className = 'bg-gray-900';
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
