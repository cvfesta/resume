import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import PrintablePage from './pages/PrintablePage/PrintablePage';
import DesignedResume from './pages/PrintablePage/DesignedResume';
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
        case '/print/independent-contractor-gj3cva':
            return 'Print Contract';
        case '/print/full':
            return 'Print Full';
        case '/print/independent-contractor-gj3cva/full':
            return 'Print Contract Full';
        case '/print/plain':
            return 'Print Plain';
        case '/print/independent-contractor-gj3cva/plain':
            return 'Print Contract Plain';
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
        // title on "Save as PDF" from /print: hyphens, so the suggested filename
        // is ready to use and parsers and filename fields never choke on it.
        document.title = pageName.startsWith('Print')
            ? `${content.hero.title.replace(/\s+/g, '-')}-Resume`
            : `${content.hero.title} — ${content.hero.eyebrow}`;
        // The contract and plain resumes live at unlisted URLs; keep them out
        // of search results as well.
        let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
        if (pageName.startsWith('Print Contract') || pageName === 'Print Plain') {
            if (!robots) {
                robots = document.createElement('meta');
                robots.name = 'robots';
                document.head.appendChild(robots);
            }
            robots.content = 'noindex, nofollow';
        } else {
            robots?.remove();
        }
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<Slides />} />
            <Route path="/print" element={<DesignedResume audience="corporate" />} />
            <Route path="/print/independent-contractor-gj3cva" element={<DesignedResume audience="contract" />} />
            <Route path="/print/full" element={<DesignedResume audience="corporate" full />} />
            <Route path="/print/independent-contractor-gj3cva/full" element={<DesignedResume audience="contract" full />} />
            <Route path="/print/plain" element={<PrintablePage audience="corporate" />} />
            <Route path="/print/independent-contractor-gj3cva/plain" element={<PrintablePage audience="contract" />} />
            <Route path="/slides" element={<Slides />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;