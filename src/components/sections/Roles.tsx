import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import data from '../../content/resume.json';
import { Data } from '../../types/content';
import './roles.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const content = data as Data;

const Roles: React.FC = () => {
    const rootRef = useRef<HTMLElement>(null);
    const roles = content.roles;

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const q = gsap.utils.selector(root);
        gsap.set(q('.roles-kicker, .roles-title, .role-card, .role-badge'), { opacity: 0 });

        let cancelled = false;
        let ctx: gsap.Context | undefined;
        let titleSplit: SplitText | undefined;
        const teardown: Array<() => void> = [];

        const build = () => {
            ctx = gsap.context(() => {
                const cards = q('.role-card') as HTMLElement[];
                titleSplit = new SplitText(q('.roles-title'), { type: 'words,chars', mask: 'chars' });
                gsap.set(q('.roles-title'), { opacity: 1 });

                // --- pointer-driven hover state ---
                let activeCard: HTMLElement | null = null;
                const tiltX = new Map<HTMLElement, gsap.QuickToFunc>();
                const tiltY = new Map<HTMLElement, gsap.QuickToFunc>();
                cards.forEach((c) => {
                    tiltX.set(c, gsap.quickTo(c, 'rotationX', { duration: 0.5, ease: 'power3' }));
                    tiltY.set(c, gsap.quickTo(c, 'rotationY', { duration: 0.5, ease: 'power3' }));
                });
                const setHover = (card: HTMLElement | null) => {
                    if (card === activeCard) return;
                    activeCard = card;
                    cards.forEach((c) => {
                        if (c === card) {
                            gsap.to(c, { y: -16, scale: 1.04, duration: 0.4, ease: 'power3', overwrite: 'auto' });
                        } else {
                            gsap.to(c, {
                                y: 0, scale: card ? 0.97 : 1, opacity: card ? 0.5 : 1,
                                duration: 0.4, ease: 'power3', overwrite: 'auto',
                            });
                            tiltX.get(c)?.(0);
                            tiltY.get(c)?.(0);
                        }
                    });
                };

                // --- deal-in: heading + cards animate in as the section
                //     scrolls into view, and reverse on the way back up off
                //     the top. Triggered (not pinned) so it's never blank. ---
                const tl = gsap.timeline({
                    defaults: { ease: 'power3.out' },
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 78%',
                        toggleActions: 'play none none reverse',
                    },
                });
                tl.fromTo(q('.roles-kicker'),
                        { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
                    .from(titleSplit.chars,
                        { yPercent: 120, duration: 0.7, stagger: 0.03 }, 0.1)
                    .fromTo(cards,
                        { opacity: 0, yPercent: 55, scale: 0.82, rotation: (i) => [-11, 0, 11][i] ?? 0 },
                        { opacity: 1, yPercent: 0, scale: 1, rotation: 0, duration: 0.9, stagger: 0.13 },
                        0.45);
                cards.forEach((card, i) => {
                    tl.fromTo(card.querySelectorAll('.role-badge'),
                        { opacity: 0, scale: 0, y: 9 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'back.out(1.8)' },
                        0.95 + i * 0.16);
                });

                const dealtIn = () => tl.progress() > 0.9;

                // clear any hover on scroll so it can never strand
                ScrollTrigger.create({
                    start: 0,
                    end: 'max',
                    onUpdate: () => { if (activeCard) setHover(null); },
                });

                // --- hover follows the actual pointer, once the cards are in ---
                if (window.matchMedia('(hover: hover)').matches) {
                    const onPointerMove = (e: PointerEvent) => {
                        if (!dealtIn()) {
                            setHover(null);
                            return;
                        }
                        const target = e.target as HTMLElement | null;
                        const card = (target?.closest?.('.role-card') ?? null) as HTMLElement | null;
                        const valid = card && cards.includes(card) ? card : null;
                        setHover(valid);
                        if (valid) {
                            const r = valid.getBoundingClientRect();
                            tiltY.get(valid)?.(((e.clientX - r.left) / r.width - 0.5) * 13);
                            tiltX.get(valid)?.((0.5 - (e.clientY - r.top) / r.height) * 13);
                        }
                    };
                    window.addEventListener('pointermove', onPointerMove);
                    teardown.push(() => window.removeEventListener('pointermove', onPointerMove));
                }

                ScrollTrigger.refresh();
            }, root);
        };

        document.fonts.ready.then(() => {
            if (!cancelled) build();
        });

        return () => {
            cancelled = true;
            teardown.forEach((fn) => fn());
            ctx?.revert();
            titleSplit?.revert();
        };
    }, []);

    return (
        <section className="roles" id="Roles" ref={rootRef}>
            <div className="roles-head">
                <p className="roles-kicker">01 — Where I operate</p>
                <h2 className="roles-title">Three hats.</h2>
            </div>
            <div className="roles-deck">
                {roles.map((role, i) => (
                    <article className="role-card" key={role.title}>
                        <span className="role-index">{String(i + 1).padStart(2, '0')}</span>
                        <span className="role-level">{role.level}</span>
                        <h3 className="role-title">{role.title}</h3>
                        <p className="role-desc">{role.subTitle}</p>
                        <div className="role-badges">
                            {role.badges.map((badge) => (
                                <span className="role-badge" key={badge}>{badge}</span>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Roles;
