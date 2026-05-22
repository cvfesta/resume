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

    return (
        <section className="projects" id="Projects" ref={rootRef}>
            <div className="projects-head">
                <p className="projects-kicker">04 — Projects</p>
                <h2 className="projects-title">Built.</h2>
                <p className="projects-intro">
                    Most of what I’ve built over my career has been for clients and employers.
                    Walkout Intros is the first product that’s entirely my own — designed, built,
                    and shipped end-to-end, with more on the way.
                </p>
            </div>
            <div className="projects-grid">
                {projects.map((project) => (
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
                        <div className="project-icon" aria-hidden="true">
                            {project.icon && logoFor[project.icon] ? (
                                <img className="project-logo" src={logoFor[project.icon]} alt="" />
                            ) : (
                                <i className="bi bi-megaphone-fill" />
                            )}
                        </div>
                        <div className="project-body">
                            <span className="project-category">{project.category}</span>
                            <h3 className="project-name">{project.name}</h3>
                            <p className="project-tagline">{project.tagline}</p>
                            <p className="project-desc">{project.description}</p>
                            <div className="project-foot">
                                <span className="project-cta">
                                    View on the App Store
                                    <span className="project-arrow" aria-hidden="true">↗</span>
                                </span>
                                {project.meta && <span className="project-meta">{project.meta}</span>}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Projects;
