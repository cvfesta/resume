import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import ContactModal from './Contact';
import { introGate } from '../../utils/introGate';
import { makeMagnetic } from '../../utils/magnetic';
import { trackEvent } from '../../utils/mixpanel';
import './sitenav.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SECTIONS = [
    { label: 'Roles', target: '#Roles' },
    { label: 'Experience', target: '#Experience' },
    { label: 'Education', target: '#Education' },
    { label: 'Projects', target: '#Projects' },
];

const SiteNav: React.FC = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLButtonElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useLayoutEffect(() => {
        const nav = navRef.current;
        if (!nav) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let cancelled = false;

        const ctx = gsap.context(() => {
            // Condense the pill once the page is scrolled off the top.
            ScrollTrigger.create({
                start: 70,
                end: 'max',
                onToggle: (self) => nav.classList.toggle('is-condensed', self.isActive),
                onRefresh: (self) => nav.classList.toggle('is-condensed', self.isActive),
            });
            // Reveal the scroll-to-top button once past the first screen.
            const top = topRef.current;
            if (top) {
                ScrollTrigger.create({
                    start: () => window.innerHeight,
                    end: 'max',
                    onToggle: (self) => top.classList.toggle('is-visible', self.isActive),
                    onRefresh: (self) => top.classList.toggle('is-visible', self.isActive),
                });
            }
        });

        // Slide the pill in as the preloader curtain lifts.
        let cleanupMagnetic = () => {};
        if (!reduced) {
            gsap.set(nav, { y: -90, autoAlpha: 0 });
            Promise.race([
                introGate,
                new Promise<void>((res) => window.setTimeout(res, 4500)),
            ]).then(() => {
                if (cancelled) return;
                gsap.to(nav, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' });
            });
        }

        const cta = nav.querySelector<HTMLElement>('.sitenav-cta');
        if (cta) cleanupMagnetic = makeMagnetic(cta, 0.4);

        // Close the mobile menu on a tap outside the nav.
        const onPointerDown = (e: PointerEvent) => {
            if (!nav.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);

        return () => {
            cancelled = true;
            cleanupMagnetic();
            document.removeEventListener('pointerdown', onPointerDown);
            gsap.killTweensOf(nav);
            ctx.revert();
        };
    }, []);

    const goTo = (target: string) => {
        setMenuOpen(false);
        const smoother = ScrollSmoother.get();
        if (smoother) {
            smoother.scrollTo(target, true, 'top 84px');
        } else {
            document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const goTop = () => {
        setMenuOpen(false);
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTo(0, true);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSection = (
        section: { label: string; target: string },
        menu: 'desktop' | 'mobile',
    ) => {
        trackEvent('Nav Item Clicked', { section: section.label, menu });
        goTo(section.target);
    };

    return (
        <>
            <div className={`sitenav${menuOpen ? ' is-menu-open' : ''}`} ref={navRef}>
                <div className="sitenav-pill">
                    <button className="sitenav-mark" type="button" onClick={goTop} aria-label="Back to top">
                        <span className="sitenav-dot" />
                        <span className="sitenav-mark-full">Christian Festa</span>
                        <span className="sitenav-mark-short">CF</span>
                    </button>
                    <nav className="sitenav-links">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.target}
                                className="sitenav-link"
                                type="button"
                                onClick={() => handleSection(section, 'desktop')}
                            >
                                {section.label}
                            </button>
                        ))}
                    </nav>
                    <button
                        className="sitenav-toggle"
                        type="button"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true" />
                    </button>
                    <Link
                        className="sitenav-print"
                        to="/print"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Printable résumé"
                        title="Printable résumé"
                        onClick={() => trackEvent('Printable Résumé Opened', { source: 'nav' })}
                    >
                        <i className="bi bi-printer-fill" aria-hidden="true" />
                    </Link>
                    <button
                        className="sitenav-cta"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#contactModal"
                        onClick={() => trackEvent('Contact Modal Opened', { source: 'nav' })}
                    >
                        Let’s talk
                    </button>
                </div>

                <div className="sitenav-menu">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.target}
                            className="sitenav-menu-link"
                            type="button"
                            onClick={() => handleSection(section, 'mobile')}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="scroll-top"
                type="button"
                ref={topRef}
                onClick={goTop}
                aria-label="Back to top"
            >
                <i className="bi bi-arrow-up" aria-hidden="true" />
            </button>

            <ContactModal />
        </>
    );
};

export default SiteNav;
