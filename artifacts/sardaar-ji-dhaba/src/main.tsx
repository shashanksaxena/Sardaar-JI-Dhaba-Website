import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The application root element was not found.');
}

const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app, {
    // Keeps caught errors off reportError(), which would raise the dev overlay.
    onCaughtError: (error, errorInfo) => {
      console.error(error, errorInfo.componentStack);
    },
  });
} else {
  createRoot(rootElement).render(app);
}
