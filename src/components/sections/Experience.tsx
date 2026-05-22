import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import data from '../../content/resume.json';
import { Data } from '../../types/content';
import { LinkArrow } from '../icons/icons';
import './experience.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const content = data as Data;

/** Pretty hostname for a job's external link, e.g. "https://ca-path.com/" → "ca-path.com". */
const hostnameOf = (url: string): string => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return 'site';
    }
};

const Experience: React.FC = () => {
    const rootRef = useRef<HTMLElement>(null);
    const jobs = content.experience;

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const q = gsap.utils.selector(root);

        // Pre-paint: hide everything the timeline animates in.
        gsap.set(q('.timeline-kicker, .timeline-title'), { opacity: 0 });
        gsap.set(q('.exp-node'), { scale: 0 });
        gsap.set(q('.exp-card'), { opacity: 0, y: 56 });
        gsap.set(q('.exp-year'), { yPercent: 100 });
        gsap.set(q('.exp-range'), { opacity: 0, y: 10 });
        gsap.set(q('.exp-badge'), { opacity: 0, scale: 0 });
        gsap.set(q('.timeline-progress'), { scaleY: 0 });

        let cancelled = false;
        let ctx: gsap.Context | undefined;
        let titleSplit: SplitText | undefined;
        let lastWidth = window.innerWidth;
        let resizeTimer = 0;

        const build = () => {
            ctx?.revert();
            titleSplit?.revert();
            ctx = gsap.context(() => {
                const spine = q('.timeline-spine')[0] as HTMLElement;
                const progressEl = q('.timeline-progress')[0] as HTMLElement;
                const cometEl = q('.timeline-comet')[0] as HTMLElement;
                const entries = q('.exp-entry') as HTMLElement[];
                const nodes = q('.exp-node') as HTMLElement[];

                // --- measure: align each node to its year, then size the spine ---
                const centers = entries.map((entry, i) => {
                    const mask = entry.querySelector('.exp-year-mask') as HTMLElement;
                    const nodeTop = mask.offsetTop + mask.offsetHeight / 2;
                    gsap.set(nodes[i], { top: nodeTop });
                    return entry.offsetTop + nodeTop;
                });
                const firstC = centers[0];
                const spineH = centers[centers.length - 1] - firstC;
                gsap.set(spine, { top: firstC, height: spineH });
                const fracs = centers.map(
                    (c) => Math.min(0.999, Math.max(0.001, (c - firstC) / spineH)),
                );

                // --- heading reveal ---
                titleSplit = new SplitText(q('.timeline-title'), { type: 'words,chars', mask: 'chars' });
                gsap.set(q('.timeline-title'), { opacity: 1 });
                gsap.timeline({
                    defaults: { ease: 'power3.out' },
                    scrollTrigger: {
                        trigger: q('.timeline-head')[0],
                        start: 'top 82%',
                        toggleActions: 'play none none reverse',
                    },
                })
                    .fromTo(q('.timeline-kicker'),
                        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0)
                    .from(titleSplit.chars,
                        { yPercent: 120, duration: 0.7, stagger: 0.022 }, 0.12);

                // --- per-entry intro timelines, played when the line arrives ---
                const entryTls = entries.map((entry) => {
                    const eq = gsap.utils.selector(entry);
                    return gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
                        .to(eq('.exp-node'), { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0)
                        .fromTo(eq('.exp-node-ring'),
                            { scale: 0.5, opacity: 0.75 },
                            { scale: 2.8, opacity: 0, duration: 0.9, ease: 'power2.out', immediateRender: false },
                            0.05)
                        .to(eq('.exp-year'), { yPercent: 0, duration: 0.7 }, 0.05)
                        .to(eq('.exp-range'), { opacity: 1, y: 0, duration: 0.5 }, 0.28)
                        .to(eq('.exp-card'), { opacity: 1, y: 0, duration: 0.85 }, 0.12)
                        .to(eq('.exp-badge'),
                            { opacity: 1, scale: 1, duration: 0.42, stagger: 0.04, ease: 'back.out(1.8)' },
                            0.55);
                });

                // gentle life in the drawing head
                gsap.to(cometEl, {
                    scale: 1.25, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
                });

                // --- the spine: draws to a fixed viewport line as you scroll ---
                let last = 0;
                const st = ScrollTrigger.create({
                    trigger: spine,
                    start: 'top 60%',
                    end: 'bottom 60%',
                    scrub: true,
                    onUpdate: (self) => {
                        const p = self.progress;
                        gsap.set(progressEl, { scaleY: p });
                        gsap.set(cometEl, { y: p * spineH, opacity: p > 0.001 && p < 0.999 ? 1 : 0 });
                        // The line crossing a node forward reveals that entry;
                        // crossing back reverses it, so scroll-up un-animates.
                        fracs.forEach((f, i) => {
                            if (last < f && p >= f) entryTls[i].play();
                            else if (last >= f && p < f) entryTls[i].reverse();
                        });
                        last = p;
                    },
                });

                ScrollTrigger.refresh();

                // Sync to current scroll (covers load-scrolled + resize rebuilds):
                // entries the line has already passed jump straight to their end.
                const p0 = st.progress;
                last = p0;
                gsap.set(progressEl, { scaleY: p0 });
                gsap.set(cometEl, { y: p0 * spineH, opacity: p0 > 0.001 && p0 < 0.999 ? 1 : 0 });
                fracs.forEach((f, i) => {
                    entryTls[i].progress(p0 >= f ? 1 : 0);
                });
            }, root);
        };

        document.fonts.ready.then(() => {
            if (!cancelled) build();
        });

        // Rebuild only on width change — entry heights reflow with width, not
        // with mobile-chrome height jitter (which would cause rebuild storms).
        const onResize = () => {
            if (window.innerWidth === lastWidth) {
                ScrollTrigger.refresh();
                return;
            }
            lastWidth = window.innerWidth;
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                if (!cancelled) build();
            }, 240);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelled = true;
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            ctx?.revert();
            titleSplit?.revert();
        };
    }, []);

    return (
        <section className="timeline" id="Experience" ref={rootRef}>
            <div className="timeline-head">
                <p className="timeline-kicker">02 — Experience</p>
                <h2 className="timeline-title">The track record.</h2>
            </div>

            <div className="timeline-body">
                <div className="timeline-spine">
                    <div className="timeline-track" />
                    <div className="timeline-progress" />
                    <div className="timeline-comet" />
                </div>

                {jobs.map((job) => (
                    <article className="exp-entry" key={job.title + job.organization}>
                        <div className="exp-node"><div className="exp-node-ring" /></div>

                        <div className="exp-year-block">
                            <div className="exp-year-mask">
                                <div className="exp-year">{job.date.split(/[-–]/)[0].trim()}</div>
                            </div>
                            <div className="exp-range">{job.date}</div>
                        </div>

                        <div className="exp-card">
                            <h3 className="exp-title">{job.title}</h3>
                            <div className="exp-org-row">
                                <span className="exp-org">{job.organization}</span>
                                {job.engagementType && (
                                    <span className="exp-type">{job.engagementType}</span>
                                )}
                            </div>
                            <p className="exp-desc">{job.description}</p>

                            {job.bullets && job.bullets.length > 0 && (
                                <ul className="exp-bullets">
                                    {job.bullets.map((bullet, bi) => (
                                        <li key={bi}>{bullet}</li>
                                    ))}
                                </ul>
                            )}

                            {job.badges && job.badges.length > 0 && (
                                <div className="exp-badges">
                                    {job.badges.map((badge) => (
                                        <span className="exp-badge" key={badge}>{badge}</span>
                                    ))}
                                </div>
                            )}

                            {job.link && (
                                <a className="exp-link" href={job.link}
                                   target="_blank" rel="noopener noreferrer">
                                    Visit {hostnameOf(job.link)} <LinkArrow size={13} />
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Experience;
