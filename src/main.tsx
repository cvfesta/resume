import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Add this import
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
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
