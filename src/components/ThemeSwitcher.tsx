// src/components/ThemeToggle.tsx
import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
    const [storedTheme, setStoredTheme] = useState<string | null>(() => localStorage.getItem('theme'));
    const [activeTheme, setActiveTheme] = useState<string>('');
    const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const [isDarkPreferred, setIsDarkPreferred] = useState(prefersDarkQuery.matches);

    const getPreferredTheme = () => {
        if (storedTheme) {
            return storedTheme;
        }
        return isDarkPreferred ? 'dark' : 'light';
    };

    const setTheme = (theme: string) => {
        if (theme === 'auto') {
            document.documentElement.setAttribute('data-bs-theme', isDarkPreferred ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    };

    useEffect(() => {
        const preferred = getPreferredTheme();
        setTheme(preferred);
        setActiveTheme(storedTheme || (isDarkPreferred ? 'dark' : 'light'));
    }, [storedTheme, isDarkPreferred]);

    useEffect(() => {
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkPreferred(e.matches);
        };
        prefersDarkQuery.addEventListener('change', handleChange);
        return () => prefersDarkQuery.removeEventListener('change', handleChange);
    }, [prefersDarkQuery]);

    const handleToggle = (theme: string) => {
        localStorage.setItem('theme', theme);
        setStoredTheme(theme);
        setActiveTheme(theme);
    };

    const iconMap = {
        light: 'bi-sun-fill',
        dark: 'bi-moon-stars-fill',
        auto: 'bi-circle-half'
    };

    return (
        <div className="nav-item dropdown">
            <button
                className="btn btn-link nav-link px-0 px-lg-2 py-2 dropdown-toggle d-flex align-items-center"
                id="bd-theme"
                type="button"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-label={`Toggle theme (${activeTheme})`}
            >
                <i className={`bi ${iconMap[activeTheme as keyof typeof iconMap]} my-1 theme-icon-active`}></i>
                <span className="d-lg-none ms-2" id="bd-theme-text">Toggle theme</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <li key={theme}>
                        <button
                            type="button"
                            className={`dropdown-item d-flex align-items-center ${activeTheme === theme ? 'active' : ''}`}
                            data-bs-theme-value={theme}
                            aria-pressed={activeTheme === theme ? 'true' : 'false'}
                            onClick={() => handleToggle(theme)}
                        >
                            <i className={`bi ${iconMap[theme]} me-2 opacity-50`}></i>
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                            <i className={`bi bi-check2 ms-auto ${activeTheme === theme ? '' : 'd-none'}`}></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThemeToggle;