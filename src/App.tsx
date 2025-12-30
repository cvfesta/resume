import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PrintablePage from './pages/PrintablePage/PrintablePage';
import './App.css';
import { trackEvent } from './utils/mixpanel.ts'; // ← Only import safe helper

// Helper function to get a readable page name from pathname
const getPageName = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Home';
        case '/print':
            return 'Print';
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
            <Route path="/" element={<HomePage />} />
            <Route path="/print" element={<PrintablePage />} />
        </Routes>
    );
};

export default App;