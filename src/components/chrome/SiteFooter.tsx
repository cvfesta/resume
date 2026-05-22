import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import footerData from '../../content/links.json';
import { makeMagnetic } from '../../utils/magnetic';
import { trackEvent } from '../../utils/mixpanel';
import './sitefooter.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const SiteFooter: React.FC = () => {
    const rootRef = useRef<HTMLElement>(null);
    const links = footerData.Links.filter((link) => link.display);
    const year = new Date().getFullYear();

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const q = gsap.utils.selector(root);
        gsap.set(q('.sf-eyebrow, .sf-headline-text, .sf-headline-mark, .sf-col'), { opacity: 0 });

        let cancelled = false;
        let ctx: gsap.Context | undefined;
        let headlineSplit: SplitText | undefined;
        let cleanupMagnetic = () => {};

        const build = () => {
            ctx = gsap.context(() => {
                headlineSplit = new SplitText(q('.sf-headline-text'), { type: 'words,chars', mask: 'chars' });
                gsap.set(q('.sf-headline-text'), { opacity: 1 });

                gsap.timeline({
                    defaults: { ease: 'power3.out' },
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                })
                    .fromTo(q('.sf-eyebrow'),
                        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
                    .from(headlineSplit.chars,
                        { yPercent: 115, duration: 0.7, stagger: 0.03 }, 0.1)
                    .fromTo(q('.sf-headline-mark'),
                        { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5 }, 0.5)
                    .fromTo(q('.sf-col'),
                        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.4);
            }, root);

            const headline = q('.sf-headline')[0] as HTMLElement | undefined;
            if (headline) cleanupMagnetic = makeMagnetic(headline, 0.3);
        };

        document.fonts.ready.then(() => {
            if (!cancelled) build();
        });

        return () => {
            cancelled = true;
            cleanupMagnetic();
            ctx?.revert();
            headlineSplit?.revert();
        };
    }, []);

    return (
        <footer className="sitefooter" ref={rootRef}>
            <div className="sf-cta">
                <p className="sf-eyebrow">05 — Contact</p>
                <button
                    className="sf-headline"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#contactModal"
                    onClick={() => trackEvent('Contact Modal Opened', { source: 'footer' })}
                >
                    <span className="sf-headline-text">Let’s talk</span>
                    <span className="sf-headline-mark">↗</span>
                </button>
            </div>

            <div className="sf-grid">
                <div className="sf-col sf-col--links">
                    <span className="sf-col-label">Elsewhere</span>
                    {links.map((link) => (
                        <a
                            key={link.id}
                            className="sf-link"
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('Outbound Link Clicked', {
                                label: link.name, url: link.href, location: 'footer',
                            })}
                        >
                            {link.name}<span className="sf-link-arrow">↗</span>
                        </a>
                    ))}
                    <Link
                        className="sf-link"
                        to="/print"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('Printable Résumé Opened', { source: 'footer' })}
                    >
                        Printable résumé<span className="sf-link-arrow">↗</span>
                    </Link>
                </div>
                <div className="sf-col sf-col--meta">
                    <span className="sf-wordmark">
                        <span className="sf-dot" />Christian Festa
                    </span>
                    <span className="sf-fineprint">© {year} — Technology Executive</span>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
