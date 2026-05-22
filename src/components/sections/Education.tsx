import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import data from '../../content/resume.json';
import { Data } from '../../types/content';
import { PsuLogo, PmiLogo, GoogleLogo } from '../icons/icons';
import './education.css';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const content = data as Data;

const logoFor: Record<string, React.ReactNode> = {
    psu: <PsuLogo size={66} />,
    pmi: <PmiLogo size={66} />,
    google: <GoogleLogo size={66} />,
};

const Education: React.FC = () => {
    const rootRef = useRef<HTMLElement>(null);
    const items = content.education;

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const q = gsap.utils.selector(root);
        const cards = q('.edu-card') as HTMLElement[];

        // Collect each logo's drawable paths (skip "none"-filled paths like the
        // Google bounding rect) and a viewBox-scaled stroke width.
        const logos = cards.map((card) => {
            const svg = card.querySelector('svg');
            if (!svg) return { paths: [] as SVGPathElement[], strokeW: 1 };
            const strokeW = (svg.viewBox.baseVal.width || 64) / 55;
            const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path')).filter((p) => {
                const fill = p.getAttribute('fill');
                return !!fill && fill !== 'none';
            });
            return { paths, strokeW };
        });

        // Pre-paint: hide heading, cards, and every logo's colour fill.
        gsap.set(q('.edu-kicker, .edu-title'), { opacity: 0 });
        gsap.set(cards, { opacity: 0 });
        logos.forEach(({ paths }) => gsap.set(paths, { fillOpacity: 0 }));

        let cancelled = false;
        let ctx: gsap.Context | undefined;
        let titleSplit: SplitText | undefined;

        const build = () => {
            ctx = gsap.context(() => {
                titleSplit = new SplitText(q('.edu-title'), { type: 'words,chars', mask: 'chars' });
                gsap.set(q('.edu-title'), { opacity: 1 });

                // dark sketch ink on the light logo plates — from the --bg token
                const ink = getComputedStyle(document.documentElement)
                    .getPropertyValue('--bg').trim();

                // --- triggered reveal: heading + cards animate in, then each
                //     logo sketches itself; reverses on the way back up off
                //     the top. Triggered (not pinned) so it's never blank. ---
                const tl = gsap.timeline({
                    defaults: { ease: 'power3.out' },
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 78%',
                        toggleActions: 'play none none reverse',
                    },
                });

                tl.fromTo(q('.edu-kicker'),
                        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
                    .from(titleSplit.chars,
                        { yPercent: 120, duration: 0.7, stagger: 0.03 }, 0.1)
                    .fromTo(cards,
                        { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.4);

                // Each logo sketches itself in dark ink on its light plate,
                // then the brand colours fill and the sketch stroke melts away.
                logos.forEach(({ paths, strokeW }, ci) => {
                    if (!paths.length) return;
                    const t = 0.7 + ci * 0.46;
                    gsap.set(paths, { stroke: ink, strokeWidth: strokeW });
                    tl.fromTo(paths,
                            { drawSVG: '0%' },
                            { drawSVG: '100%', duration: 0.85, stagger: 0.08, ease: 'power1.inOut' }, t)
                        .to(paths, { fillOpacity: 1, duration: 0.5, ease: 'power2.out' }, t + 0.78)
                        .to(paths, { strokeWidth: 0, duration: 0.45, ease: 'power2.out' }, t + 0.92);
                });

                ScrollTrigger.refresh();
            }, root);
        };

        document.fonts.ready.then(() => {
            if (!cancelled) build();
        });

        return () => {
            cancelled = true;
            ctx?.revert();
            titleSplit?.revert();
        };
    }, []);

    return (
        <section className="education" id="Education" ref={rootRef}>
            <div className="edu-head">
                <p className="edu-kicker">03 — Education</p>
                <h2 className="edu-title">Credentials.</h2>
            </div>
            <div className="edu-grid">
                {items.map((item) => (
                    <article className="edu-card" key={item.title}>
                        <div className="edu-logo">{logoFor[item.icon] ?? null}</div>
                        <div className="edu-date">{item.date}</div>
                        <h3 className="edu-card-title">{item.title}</h3>
                        <p className="edu-org">{item.institution}</p>
                        {item.location && <p className="edu-place">{item.location}</p>}
                        {item.description && <p className="edu-desc">{item.description}</p>}
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Education;
