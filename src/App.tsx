import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import PrintablePage from './pages/PrintablePage/PrintablePage';
import Slides from './pages/Slides/Slides';
import './App.css';
import { trackEvent } from './utils/mixpanel.ts'; // ← Only import safe helper
import content from './content/resume.json';

// Helper function to get a readable page name from pathname
const getPageName = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Home';
        case '/print':
            return 'Print';
        case '/print/full':
            return 'Print Full';
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
        // Per-route <title> — also becomes the PDF's default filename/metadata
        // title on "Save as PDF" from /print. Plain "Resume" (no accents) so
        // ATS parsers and filename fields never choke on the é.
        document.title = pageName.startsWith('Print')
            ? `${content.hero.title} — Resume`
            : `${content.hero.title} — ${content.hero.eyebrow}`;
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<Slides />} />
            <Route path="/print" element={<PrintablePage variant="condensed" />} />
            <Route path="/print/full" element={<PrintablePage variant="full" />} />
            <Route path="/slides" element={<Slides />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;