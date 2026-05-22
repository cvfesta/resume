import { gsap } from 'gsap';

/**
 * Makes an element drift toward the cursor while hovered and spring back on
 * leave. Returns a cleanup function. No-op on touch / reduced-motion.
 *
 * @param el        the element to magnetize
 * @param strength  0–1, how far it follows the cursor (default 0.4)
 */
export const makeMagnetic = (el: HTMLElement, strength = 0.4): (() => void) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduced || !fine) return () => {};

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

    const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const reset = () => {
        xTo(0);
        yTo(0);
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
    return () => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', reset);
        gsap.killTweensOf(el);
        gsap.set(el, { x: 0, y: 0 });
    };
};
