import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import PrintablePage from './pages/PrintablePage/PrintablePage';
import Slides from './pages/Slides/Slides';
import './App.css';
import { trackEvent } from './utils/mixpanel.ts'; // ← Only import safe helper

// Helper function to get a readable page name from pathname
const getPageName = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Home';
        case '/print':
            return 'Print';
        case '/slides':
            return 'Slides';
        default:
            return 'Unknown';
    }
};

const App: React.FC = () => {
    const location = useLocation();

    // Track page views on route change
    useEffect(() => {
        const pageName = getPageName(location.pathname);
        trackEvent(`${pageName} Page Viewed`, {
            path: location.pathname,
            search: location.search,
            full_url: window.location.href,
        });
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<Slides />} />
            <Route path="/print" element={<PrintablePage />} />
            <Route path="/slides" element={<Slides />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;