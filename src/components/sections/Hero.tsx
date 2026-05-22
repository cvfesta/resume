import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import data from '../../content/resume.json';
import { Data } from '../../types/content';
import { calculateYearsOfExperience } from '../../utils/calculateYearsOfExperience';
import { introGate } from '../../utils/introGate';
import { makeMagnetic } from '../../utils/magnetic';
import './hero.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const content = data as Data;

/** Split the executive summary into a punchy lead sentence + supporting body. */
const splitSummary = (text: string): { lead: string; body: string } => {
    const match = text.match(/^(.*?[.!?])\s+(.+)$/s);
    return match ? { lead: match[1], body: match[2] } : { lead: text, body: '' };
};

type Mover = { x: gsap.QuickToFunc; y: gsap.QuickToFunc; depth: number };

const Hero: React.FC = () => {
    const rootRef = useRef<HTMLElement>(null);

    const years = calculateYearsOfExperience();                       // e.g. "16+"
    const yearsNum = parseInt(years, 10) || 0;
    const summary = content.hero.subTitle.replace('{YEARS}', years);
    const { lead, body } = splitSummary(summary);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        // Reduced motion: keep a clean, fully-visible static hero (CSS handles it).
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const q = gsap.utils.selector(root);

        // Hide animated elements before first paint so nothing flashes in.
        root.classList.add('is-animated');
        gsap.set(q('.hero-eyebrow, .hero-name, .hero-lead, .hero-body, .hero-stat-in, .hero-cue-in'), {
            opacity: 0,
        });

        // The name drifts toward the cursor — same magnetic effect as the
        // footer CTA. Set up once; it's independent of the rebuildable timeline.
        const nameEl = q('.hero-name')[0] as HTMLElement | undefined;
        const cleanupMagnetic = nameEl ? makeMagnetic(nameEl, 0.16) : () => {};

        let cancelled = false;
        let ctx: gsap.Context | undefined;
        let splits: SplitText[] = [];
        let movers: Mover[] = [];
        let resizeTimer = 0;
        let lastWidth = window.innerWidth;

        const build = (firstRun: boolean) => {
            ctx?.revert();
            splits.forEach((s) => s.revert());
            splits = [];

            ctx = gsap.context(() => {
                // SplitText needs final, font-loaded layout to break lines correctly.
                const name = new SplitText(q('.hero-name'), { type: 'words,chars', mask: 'chars' });
                const leadLines = new SplitText(q('.hero-lead'), { type: 'lines', mask: 'lines' });
                const bodyLines = new SplitText(q('.hero-body'), { type: 'lines', mask: 'lines' });
                splits = [name, leadLines, bodyLines];

                // Containers are visible; their split children carry the reveal.
                gsap.set(q('.hero-name, .hero-lead, .hero-body'), { opacity: 1 });
                // Body lines stay hidden until the pinned scroll reveal, every build.
                gsap.set(bodyLines.lines, { yPercent: 105 });

                if (firstRun) {
                    // --- intro: the title card builds itself once the curtain lifts ---
                    const counter = { v: 0 };
                    const statNum = q('.hero-stat-num')[0] as HTMLElement | undefined;

                    gsap.timeline({ delay: 0.25, defaults: { ease: 'power4.out' } })
                        .from(q('.hero-blob'), {
                            scale: 0.3, opacity: 0, duration: 1.7, stagger: 0.16, ease: 'power2.out',
                        }, 0)
                        .fromTo(q('.hero-eyebrow'),
                            { opacity: 0, y: 24 },
                            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.3)
                        .from(name.chars, {
                            yPercent: 120, rotate: 5, duration: 1.1, stagger: 0.035,
                        }, 0.45)
                        .from(leadLines.lines, { yPercent: 115, duration: 0.95, stagger: 0.13 }, 0.95)
                        .to(counter, {
                            v: yearsNum, duration: 1.4, ease: 'power2.out',
                            onUpdate() {
                                if (statNum) statNum.textContent = String(Math.round(counter.v));
                            },
                            onComplete() {
                                if (statNum) statNum.textContent = years;
                            },
                        }, 1.0)
                        .fromTo(q('.hero-stat-in'),
                            { opacity: 0, y: 22 },
                            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.15)
                        .fromTo(q('.hero-cue-in'),
                            { opacity: 0, y: 22 },
                            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.3);
                } else {
                    // Rebuild after resize: jump straight to the resolved state.
                    gsap.set(q('.hero-eyebrow, .hero-stat-in, .hero-cue-in'), { opacity: 1, y: 0 });
                    gsap.set(name.chars, { yPercent: 0, rotate: 0 });
                    gsap.set(leadLines.lines, { yPercent: 0 });
                }

                // Ambient: the blobs breathe slowly so the hero never sits still.
                gsap.to(q('.hero-blob'), {
                    scale: 1.12, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut',
                    delay: 2.6, stagger: { each: 2, from: 'random' },
                });

                // Looping falling-dot scroll cue.
                gsap.to(q('.hero-cue-dot'), {
                    y: 30, opacity: 0, duration: 1.5, ease: 'sine.in',
                    repeat: -1, repeatDelay: 0.5,
                });

                // --- pinned scroll act ---
                // The title card lifts away while the executive statement
                // writes itself in, one line at a time.
                gsap.timeline({
                    scrollTrigger: {
                        trigger: root,
                        start: 'top top',
                        end: '+=120%',
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                    },
                })
                    .to(q('.hero-stat, .hero-cue'), {
                        opacity: 0, y: -24, duration: 0.15, ease: 'power1.in',
                    }, 0)
                    .to(q('.hero-title-pane'), {
                        yPercent: -55, scale: 0.92, opacity: 0, duration: 0.5, ease: 'power2.in',
                    }, 0)
                    .to(bodyLines.lines, {
                        yPercent: 0, duration: 0.6, stagger: 0.09, ease: 'power2.out',
                    }, 0.32)
                    .to(q('.hero-blob'), {
                        yPercent: -22, duration: 1, stagger: 0.15, ease: 'none',
                    }, 0);
            }, root);

            // Mouse parallax for the ambient blobs (re-bound on every build).
            movers = q('.hero-blob').map((blob, i) => ({
                x: gsap.quickTo(blob, 'x', { duration: 0.9, ease: 'power3' }),
                y: gsap.quickTo(blob, 'y', { duration: 0.9, ease: 'power3' }),
                depth: (i + 1) * 16,
            }));

            ScrollTrigger.refresh();
        };

        const onMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            movers.forEach((m) => {
                m.x(nx * m.depth);
                m.y(ny * m.depth);
            });
        };

        const onResize = () => {
            // Only a width change reflows the SplitText lines; ignore mobile
            // address-bar height jitter so it doesn't re-split text on scroll.
            if (window.innerWidth === lastWidth) {
                ScrollTrigger.refresh();
                return;
            }
            lastWidth = window.innerWidth;
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                if (!cancelled) build(false);
            }, 220);
        };

        // Hold the intro until fonts are ready AND the preloader has handed off
        // (with a safety timeout in case the preloader never releases).
        const ready = Promise.all([
            document.fonts.ready,
            Promise.race([introGate, new Promise<void>((res) => window.setTimeout(res, 4500))]),
        ]);
        ready.then(() => {
            if (cancelled) return;
            build(true);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('resize', onResize);
        });

        return () => {
            cancelled = true;
            window.clearTimeout(resizeTimer);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', onResize);
            cleanupMagnetic();
            ctx?.revert();
            splits.forEach((s) => s.revert());
            root.classList.remove('is-animated');
        };
    }, [years, yearsNum]);

    return (
        <section className="hero" ref={rootRef}>
            <div className="hero-blob hero-blob--a" />
            <div className="hero-blob hero-blob--b" />
            <div className="hero-blob hero-blob--c" />

            <div className="hero-stage">
                <div className="hero-pane hero-title-pane">
                    <p className="hero-eyebrow">Technology Executive</p>
                    <h1 className="hero-name">{content.hero.title}</h1>
                    <p className="hero-lead">{lead}</p>
                </div>
                <div className="hero-pane hero-statement-pane">
                    <p className="hero-body">{body}</p>
                </div>
            </div>

            <div className="hero-stat">
                <div className="hero-stat-in">
                    <div className="hero-stat-num">{years}</div>
                    <div className="hero-stat-label">years executing &amp; delivering</div>
                </div>
            </div>

            <div className="hero-cue">
                <div className="hero-cue-in">
                    <span>Scroll</span>
                    <span className="hero-cue-track"><span className="hero-cue-dot" /></span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
