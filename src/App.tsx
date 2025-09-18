// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PrintablePage from './pages/PrintablePage/PrintablePage';
import './App.css';
import mixpanel from 'mixpanel-browser';

// Helper function to get a readable page name from pathname
const getPageName = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Home';
        case '/print':
            return 'Print';
        default:
            return 'Unknown'; // Fallback for any new routes
    }
};

const App: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const pageName = getPageName(location.pathname);
        mixpanel.track(`${pageName} Page Viewed`, {
            path: location.pathname,
            search: location.search,
            full_url: window.location.href, // Optional: for more context
        });
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/print" element={<PrintablePage />} />
        </Routes>
    );
};

export default App;