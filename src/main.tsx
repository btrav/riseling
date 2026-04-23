import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NuqsAdapter } from 'nuqs/adapters/react';
import './index.css';
import App from './App.tsx';
import { Viewer } from './components/Viewer.tsx';

const path = window.location.pathname;
const isViewer = /\/v\/?$/.test(path);

const root = createRoot(document.getElementById('root')!);

if (isViewer) {
  root.render(
    <StrictMode>
      <Viewer />
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </StrictMode>,
  );
}
