import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { releaseIntro } from '../../utils/introGate';
import './preloader.css';

/** A brief branded boot sequence; lifts away and hands off to the hero intro. */
const Preloader: React.FC = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [done, setDone] = useState(false);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        // Reduced motion: skip the curtain entirely, hand straight off.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            releaseIntro();
            setDone(true);
            return;
        }

        const q = gsap.utils.selector(root);
        const ctx = gsap.context(() => {
            const counter = { v: 0 };
            const numEl = q('.pre-count')[0] as HTMLElement | undefined;

            gsap.timeline({ onComplete: () => setDone(true) })
                .to(q('.pre-mark'), { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }, 0.1)
                .to(counter, {
                    v: 100,
                    duration: 1.3,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        if (numEl) numEl.textContent = String(Math.round(counter.v));
                    },
                }, 0.2)
                .to(q('.pre-bar-fill'), { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0.2)
                .to(q('.pre-inner'), { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.15')
                // curtain lifts — the hero intro is released as it starts moving
                .to(root, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: 'power4.inOut',
                    onStart: releaseIntro,
                }, '-=0.1');
        }, root);

        return () => ctx.revert();
    }, []);

    if (done) return null;

    return (
        <div className="preloader" ref={rootRef}>
            <div className="pre-inner">
                <div className="pre-mark"><span className="pre-dot" />CF</div>
                <div className="pre-bar"><div className="pre-bar-fill" /></div>
                <div className="pre-count">0</div>
            </div>
        </div>
    );
};

export default Preloader;
