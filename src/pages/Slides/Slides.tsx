import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Preloader from '../../components/chrome/Preloader';
import Cursor from '../../components/chrome/Cursor';
import SiteNav from '../../components/chrome/SiteNav';
import SiteFooter from '../../components/chrome/SiteFooter';
import Hero from '../../components/sections/Hero';
import Roles from '../../components/sections/Roles';
import Experience from '../../components/sections/Experience';
import Education from '../../components/sections/Education';
import Projects from '../../components/sections/Projects';
import { trackEvent } from '../../utils/mixpanel';
import '../../styles/tokens.css';
import './slides.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const Slides: React.FC = () => {
    const progressRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let smoother: ScrollSmoother | undefined;

        const ctx = gsap.context(() => {
            if (!reduced) {
                // Momentum scrolling — the single biggest "expensive site" tell.
                ScrollSmoother.get()?.kill();
                smoother = ScrollSmoother.create({
                    wrapper: '#smooth-wrapper',
                    content: '#smooth-content',
                    smooth: 1.2,
                    effects: true,
                    // iOS fixes: route scroll through JS so Safari's address bar
                    // can't resize the viewport mid-scroll (which makes the pinned
                    // hero jitter), and ignore the address-bar resize entirely.
                    normalizeScroll: true,
                    ignoreMobileResize: true,
                });
            }

            // Slim scroll-progress bar.
            const bar = progressRef.current;
            if (bar) {
                ScrollTrigger.create({
                    start: 0,
                    end: 'max',
                    onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
                    onRefresh: (self) => gsap.set(bar, { scaleX: self.progress }),
                });
            }

            // Scroll-depth milestones — one "Section Reached" event the first
            // time each section scrolls into view (analytics; see utils/mixpanel).
            [
                { name: 'Roles', selector: '#Roles' },
                { name: 'Experience', selector: '#Experience' },
                { name: 'Education', selector: '#Education' },
                { name: 'Projects', selector: '#Projects' },
                { name: 'Contact', selector: '.sitefooter' },
            ].forEach(({ name, selector }) => {
                const el = document.querySelector(selector);
                if (!el) return;
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 70%',
                    once: true,
                    onEnter: () => trackEvent('Section Reached', { section: name }),
                });
            });
        });

        return () => {
            smoother?.kill();
            ctx.revert();
        };
    }, []);

    return (
        <>
            <Preloader />
            <Cursor />
            <SiteNav />
            <div className="scroll-progress">
                <div className="scroll-progress-bar" ref={progressRef} />
            </div>

            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <Hero />
                    <Roles />
                    <Experience />
                    <Education />
                    <Projects />
                    <SiteFooter />
                </div>
            </div>
        </>
    );
};

export default Slides;
