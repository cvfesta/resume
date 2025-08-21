// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import data from "./data.json";
import Logo from '../../assets/logo.svg';
import ContactModal from '../../components/Contact/Contact'; // Import the ContactModal component
import ThemeToggle from '../../components/ThemeSwitcher.tsx'; // Import the ThemeToggle component

const Header: React.FC = () => {
    const [links, setLinks] = useState<string[]>([]);
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(
        (document.documentElement.getAttribute('data-bs-theme') as 'light' | 'dark' | 'auto') || 'light'
    );

    useEffect(() => {
        setLinks(data.Links);
    }, []);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
            setTheme(currentTheme as 'light' | 'dark' | 'auto');
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-bs-theme'],
        });

        return () => observer.disconnect();
    }, []);

    const buttonClass = theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark';

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg px-lg-5">
                    <a className="navbar-brand" href="#">
                        <img className="img-fluid justify-content-center" src={Logo} alt="Interlaced c and f letters logo" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse justify-content-end navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            {links.map((link) => {
                                if (link === "Contact") {
                                    return (
                                        <button
                                            type="button"
                                            className={`btn ${buttonClass} text-decoration-none border-0`}
                                            key={link}
                                            data-bs-toggle="modal"
                                            data-bs-target="#contactModal"
                                        >
                                            {link}
                                        </button>
                                    );
                                }
                                return (
                                    <button
                                        type="button"
                                        className={`btn ${buttonClass} text-decoration-none border-0`}
                                        key={link}
                                        onClick={() => window.location.href = `#${link}`}
                                    >
                                        {link}
                                    </button>
                                );
                            })}
                            <ThemeToggle />
                        </div>
                    </div>
                </nav>
            </header>
            <ContactModal />
        </>
    );
}

export default Header;