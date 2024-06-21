// src/utils/theme.ts

import { useState, useEffect } from 'react';

const getStoredTheme = (): string | null => {
    return localStorage.getItem('theme');
};

const setStoredTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
};

const getPreferredTheme = (): string => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

interface Theme {
    theme: string;
    setTheme: (theme: string) => void;
}

export const useTheme = (): Theme => {
    const [theme, setTheme] = useState<string>(getPreferredTheme());

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const storedTheme = getStoredTheme();
            if (storedTheme !== 'light' && storedTheme !== 'dark') {
                setTheme(getPreferredTheme());
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const handleThemeChange = (newTheme: string) => {
        setStoredTheme(newTheme);
        setTheme(newTheme);
    };

    return { theme, setTheme: handleThemeChange };
};