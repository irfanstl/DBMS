import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global Fetch Interceptor to automatically attach the logged-in User ID to all backend API calls
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  if (typeof resource === 'string' && resource.startsWith('/api/')) {
    const userStr = localStorage.getItem('user_data');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          config = config || {};
          config.headers = { ...config.headers, 'X-User-Id': user.id.toString() };
        }
      } catch (e) {
        console.error("Error parsing user_data for fetch interceptor");
      }
    }
  }
  return originalFetch(resource, config);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
