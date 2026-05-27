import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Add this import
// Framework CSS first so the app's stylesheets (loaded transitively by App)
// can override Bootstrap's defaults — otherwise Bootstrap's body bg wins.
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.tsx'
import { initMixpanel } from './utils/mixpanel.ts';

// Initialize Mixpanel before rendering
initMixpanel();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename="/resume">
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
