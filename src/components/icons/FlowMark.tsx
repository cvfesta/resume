import React from 'react';

/** Decorative automation → AI → person mark for the "how I decide" tile.
 * Stroke and dot colors come from the caller's stylesheet. */
const FlowMark: React.FC<{ className: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 220 70" aria-hidden="true">
        <path d="M44 35 H90 M130 35 H172" strokeOpacity="0.5" />
        <rect x="8" y="17" width="36" height="36" rx="8" />
        <circle className="flow-mark-dot" cx="110" cy="35" r="20" />
        <circle cx="196" cy="24" r="10" />
        <path d="M176 58 C176 42 216 42 216 58" />
    </svg>
);

export default FlowMark;
