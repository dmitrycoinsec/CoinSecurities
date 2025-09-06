import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import App from './App';
import { Buffer } from 'buffer';
import Preloader from './components/Preloader';

// Fix: Augment the global Window type to include the 'Buffer' property for the polyfill.
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// Polyfill Buffer for the browser
window.Buffer = Buffer;

// Dynamically generate the manifest URL
const manifestUrl = new URL('tonconnect-manifest.json', window.location.href).toString();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);

// Hide preloader after app is mounted
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});
