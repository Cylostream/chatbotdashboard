import React from 'react';
import ReactDOM from 'react-dom/client';

// Placeholder App component
const App: React.FC = () => {
  return (
    <div>
      <h1>Customizable Multi-Client Chat Widget Platform</h1>
      <p>Admin Dashboard - Coming Soon</p>
    </div>
  );
};

// Root element will be created in the HTML
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
} 