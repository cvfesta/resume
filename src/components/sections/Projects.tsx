import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import data from '../../content/resume.json';
import { Data } from '../../types/content';
import walkoutDark from '../../assets/walkout-dark.svg';
import { trackEvent } from '../../utils/mixpanel';
import './projects.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const content = data as Data;

/** App logos, keyed by a project's `icon` slug. */
const logoFor: Record<string, string> = {
    'walkout-intros': walkoutDark,
};

const Projects: React.FC = () => {
    const rootRef = useRef<HTMLElement>(null);
    const projects = content.projects;

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

    const { kicker, title, intro } = content.sections.projects;

    return (
        <section className="projects" id="Projects" ref={rootRef}>
            <div className="projects-head">
                <p className="projects-kicker">{kicker}</p>
                <h2 className="projects-title">{title}</h2>
                {intro && <p className="projects-intro">{intro}</p>}
            </div>
            <div className="projects-grid">
                {projects.map((project) => {
                    const logo = project.icon ? logoFor[project.icon] : undefined;
                    const body = (
                        <>
                            <div className="project-icon" aria-hidden="true">
                                {logo ? (
                                    <img className="project-logo" src={logo} alt="" />
                                ) : (
                                    <i className={`bi ${project.glyph ?? 'bi-app'}`} />
                                )}
                            </div>
                            <div className="project-body">
                                <span className="project-category">{project.category}</span>
                                <h3 className="project-name">{project.name}</h3>
                                <p className="project-tagline">{project.tagline}</p>
                                <p className="project-desc">{project.description}</p>
                                <div className="project-foot">
                                    {project.available ? (
                                        <>
                                            <span className="project-cta">
                                                View on the App Store
                                                <span className="project-arrow" aria-hidden="true">↗</span>
                                            </span>
                                            {project.meta && (
                                                <span className="project-meta">{project.meta}</span>
                                            )}
                                        </>
                                    ) : (
                                        project.meta && (
                                            <span className="project-status">{project.meta}</span>
                                        )
                                    )}
                                </div>
                            </div>
                        </>
                    );

                    // Live apps link to the App Store; unreleased apps render as a
                    // non-interactive card showing their "Coming soon" status.
                    return project.available ? (
                        <a
                            className="project-card"
                            key={project.name}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('Project Clicked', {
                                project: project.name, url: project.link,
                            })}
                        >
                            {body}
                        </a>
                    ) : (
                        <article className="project-card project-card--soon" key={project.name}>
                            {body}
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default Projects;
