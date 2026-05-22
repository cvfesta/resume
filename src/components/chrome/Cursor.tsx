import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './cursor.css';

/** A lime dot + trailing ring that replaces the pointer on fine-pointer devices. */
const Cursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        // Only on fine-pointer, motion-OK devices — touch keeps the native UX.
        const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!fine || reduced) return;

        document.body.classList.add('has-custom-cursor');

        const ctx = gsap.context(() => {
            gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

            const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
            const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
            const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3' });
            const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3' });

            let shown = false;
            const move = (e: MouseEvent) => {
                if (!shown) {
                    shown = true;
                    gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
                }
                dotX(e.clientX);
                dotY(e.clientY);
                ringX(e.clientX);
                ringY(e.clientY);
                const target = e.target as HTMLElement | null;
                const interactive = !!target?.closest?.('a, button, [data-cursor]');
                ring.classList.toggle('is-hover', interactive);
            };
            const leave = () => {
                shown = false;
                gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
            };

            window.addEventListener('mousemove', move);
            document.addEventListener('mouseleave', leave);

            return () => {
                window.removeEventListener('mousemove', move);
                document.removeEventListener('mouseleave', leave);
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
        </>
    );
};

export default Cursor;
