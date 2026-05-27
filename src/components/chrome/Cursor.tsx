import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './cursor.css';

const INTERACTIVE_SELECTOR = 'a, button, [data-cursor]';
const RING_DEFAULT_SIZE = 34;
const DOCK_PADDING = 14;
// Cap how big the docked ring is allowed to grow. Elements larger than this
// (cards, full-section CTAs) feel weird if the ring tries to outline the whole
// thing — instead the ring stays at the cap and resumes following the cursor.
const MAX_DOCK_WIDTH = 320;
const MAX_DOCK_HEIGHT = 100;

/** Resolve the label that should appear inside the cursor pill. */
const labelFor = (el: HTMLElement): string | null => {
    const explicit = el.dataset.cursor;
    if (explicit !== undefined) return explicit || null;
    if (el instanceof HTMLAnchorElement) {
        if (el.target === '_blank') return 'Open';
        if (el.getAttribute('href')?.startsWith('#')) return 'Jump';
        return 'View';
    }
    return null;
};

/**
 * A lime dot + magnetic ring that docks around interactive elements and
 * surfaces a contextual label. Fine-pointer / motion-OK devices only.
 */
const Cursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        const label = labelRef.current;
        if (!dot || !ring || !label) return;

        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!fine || reduced) return;

        document.body.classList.add('has-custom-cursor');

        const ctx = gsap.context(() => {
            gsap.set([dot, ring, label], { xPercent: -50, yPercent: -50 });

            const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
            const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
            const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3' });
            const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3' });
            const labelX = gsap.quickTo(label, 'x', { duration: 0.22, ease: 'power3' });
            const labelY = gsap.quickTo(label, 'y', { duration: 0.22, ease: 'power3' });

            let shown = false;
            let dockedEl: HTMLElement | null = null;
            let oversized = false;

            const dock = (el: HTMLElement) => {
                dockedEl = el;
                const rect = el.getBoundingClientRect();
                const targetW = rect.width + DOCK_PADDING * 2;
                const targetH = rect.height + DOCK_PADDING * 2;
                const w = Math.min(targetW, MAX_DOCK_WIDTH);
                const h = Math.min(targetH, MAX_DOCK_HEIGHT);
                oversized = w < targetW || h < targetH;

                const text = labelFor(el);
                if (text) {
                    label.textContent = text;
                    gsap.to(label, { autoAlpha: 1, duration: 0.2 });
                } else {
                    gsap.to(label, { autoAlpha: 0, duration: 0.15 });
                }
                ring.classList.add('is-docked');
                gsap.to(ring, {
                    width: w,
                    height: h,
                    duration: 0.38,
                    ease: 'power3.out',
                    overwrite: 'auto',
                });
            };

            const undock = () => {
                dockedEl = null;
                oversized = false;
                ring.classList.remove('is-docked');
                gsap.to(label, { autoAlpha: 0, duration: 0.15 });
                gsap.to(ring, {
                    width: RING_DEFAULT_SIZE,
                    height: RING_DEFAULT_SIZE,
                    duration: 0.3,
                    ease: 'power3.out',
                    overwrite: 'auto',
                });
            };

            const move = (e: MouseEvent) => {
                if (!shown) {
                    shown = true;
                    gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
                }

                dotX(e.clientX);
                dotY(e.clientY);
                // Label trails the pointer down-right so it doesn't sit under the dot.
                labelX(e.clientX + 22);
                labelY(e.clientY + 28);

                const target = e.target as HTMLElement | null;
                const interactive = target?.closest?.(INTERACTIVE_SELECTOR) as HTMLElement | null;
                if (interactive !== dockedEl) {
                    if (interactive) dock(interactive);
                    else undock();
                }

                if (!dockedEl || oversized) {
                    ringX(e.clientX);
                    ringY(e.clientY);
                }
            };

            // Keep the docked ring glued to its element across scroll / layout shifts.
            // Skipped for oversized docks — those follow the cursor via move() instead.
            const tick = () => {
                if (!dockedEl || oversized) return;
                const rect = dockedEl.getBoundingClientRect();
                ringX(rect.left + rect.width / 2);
                ringY(rect.top + rect.height / 2);
            };

            const leave = () => {
                shown = false;
                gsap.to([dot, ring, label], { autoAlpha: 0, duration: 0.2 });
            };

            window.addEventListener('mousemove', move);
            document.addEventListener('mouseleave', leave);
            gsap.ticker.add(tick);

            return () => {
                window.removeEventListener('mousemove', move);
                document.removeEventListener('mouseleave', leave);
                gsap.ticker.remove(tick);
            };
        });

        return () => {
            ctx.revert();
            document.body.classList.remove('has-custom-cursor');
        };
    }, []);

    return (
        <>
            <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
            <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
            <div className="cursor-label" ref={labelRef} aria-hidden="true" />
        </>
    );
};

export default Cursor;
