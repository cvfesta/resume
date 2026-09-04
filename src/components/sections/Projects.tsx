import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import data from '../../content/resume.json';
import { Data } from '../../types/content';
import walkoutDark from '../../assets/walkout-dark.svg';
import ghostyIcon from '../../assets/ghosty.svg';
import shotWalkout from '../../assets/shots/walkout-game-mode.jpg';
import shotGhosty from '../../assets/shots/ghosty-home.jpg';
import { trackEvent } from '../../utils/mixpanel';
import './projects.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const content = data as Data;

/** App logos, keyed by a project's `icon` slug. */
const logoFor: Record<string, string> = {
    'walkout-intros': walkoutDark,
    'ghosty': ghostyIcon,
};

/** Product screenshots, keyed by a project's `shot` slug. The same captures
 * sit on the studio site's ledger, so the two stay in step. */
const shotFor: Record<string, string> = {
    'walkout-game-mode': shotWalkout,
    'ghosty-home': shotGhosty,
};

const Projects: React.FC = () => {
    const rootRef = useRef<HTMLElement>(null);
    // Status order, as on the studio site: live first, then products with a
    // page of their own (in submission), then everything still in the lab.
    // Stable sort, so each group keeps its data order.
    const rank = (p: (typeof content.projects)[number]) =>
        p.available ? 0 : p.link ? 1 : 2;
    const projects = [...content.projects].sort((a, b) => rank(a) - rank(b));

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const q = gsap.utils.selector(root);
        gsap.set(q('.projects-kicker, .projects-title, .projects-intro, .project-card'), { opacity: 0 });

        let cancelled = false;
        let ctx: gsap.Context | undefined;
        let titleSplit: SplitText | undefined;

        const build = () => {
            ctx = gsap.context(() => {
                titleSplit = new SplitText(q('.projects-title'), { type: 'words,chars', mask: 'chars' });
                gsap.set(q('.projects-title'), { opacity: 1 });

                // Triggered reveal — plays as the section scrolls into view,
                // reverses on the way back up. (Same model as Roles/Education.)
                gsap.timeline({
                    defaults: { ease: 'power3.out' },
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 78%',
                        toggleActions: 'play none none reverse',
                    },
                })
                    .fromTo(q('.projects-kicker'),
                        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
                    .from(titleSplit.chars,
                        { yPercent: 120, duration: 0.7, stagger: 0.03 }, 0.1)
                    .fromTo(q('.projects-intro'),
                        { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 }, 0.3)
                    .fromTo(q('.project-card'),
                        { opacity: 0, y: 48 },
                        { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.5);
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

    const { kicker, title, intro, cta } = content.sections.projects;

    return (
        <section className="projects" id="Projects" ref={rootRef}>
            <div className="projects-head">
                <div className="projects-head-copy">
                    <p className="projects-kicker">{kicker}</p>
                    <h2 className="projects-title">{title}</h2>
                    {intro && <p className="projects-intro">{intro}</p>}
                </div>
                {cta && (
                    <a
                        className="projects-cta"
                        href={cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('Studio Link Clicked', { url: cta.href })}
                    >
                        {cta.label}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M4 12L12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                )}
            </div>
            <div className="projects-grid">
                {projects.map((project) => {
                    const logo = project.icon ? logoFor[project.icon] : undefined;
                    const shot = project.shot ? shotFor[project.shot] : undefined;
                    // Live apps link out to the App Store; unreleased ones with
                    // a studio page link there instead; the rest are static.
                    const href = project.available ? project.link : (project.link || undefined);
                    const ctaLabel = project.available ? 'View on the App Store' : 'Studio page';
                    const style = project.brandColor
                        ? ({ '--brand': project.brandColor } as React.CSSProperties)
                        : undefined;
                    const body = (
                        <>
                            <div className="project-head">
                                <div className="project-icon" aria-hidden="true">
                                    {logo ? (
                                        <img className="project-logo" src={logo} alt="" />
                                    ) : (
                                        <i className={`bi ${project.glyph ?? 'bi-app'}`} />
                                    )}
                                </div>
                                {project.meta && (
                                    <span className="project-status">{project.meta}</span>
                                )}
                            </div>
                            <div className="project-body">
                                <span className="project-category">{project.category}</span>
                                <h3 className="project-name">{project.name}</h3>
                                <p className="project-tagline">{project.tagline}</p>
                                <div className={shot ? 'project-stage' : 'project-stage project-stage--empty'}>
                                    {shot ? (
                                        <img className="project-shot" src={shot} alt={`${project.name} screenshot`} loading="lazy" />
                                    ) : (
                                        <span>Screenshots when the build is ready</span>
                                    )}
                                </div>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-foot">
                                    {href ? (
                                        <span className="project-cta">
                                            {ctaLabel}
                                            <span className="project-arrow" aria-hidden="true">↗</span>
                                        </span>
                                    ) : (
                                        <span className="project-cta project-cta--muted">Coming soon</span>
                                    )}
                                    {project.note && (
                                        <span className="project-meta">{project.note}</span>
                                    )}
                                </div>
                            </div>
                        </>
                    );

                    return href ? (
                        <a
                            className="project-card"
                            key={project.name}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={style}
                            onClick={() => trackEvent('Project Clicked', {
                                project: project.name, url: href,
                            })}
                        >
                            {body}
                        </a>
                    ) : (
                        <article className="project-card project-card--soon" key={project.name} style={style}>
                            {body}
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default Projects;
