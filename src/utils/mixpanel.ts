import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

/** Coarse device bucket from viewport width — enough to segment events on. */
const deviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
};

/** utm_* params off the current URL, if the visit carried any. */
const utmParams = (): Record<string, string> => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
        const value = params.get(key);
        if (value) utm[key] = value;
    });
    return utm;
};

/**
 * Context registered as super-properties — merged into every event so any
 * metric can be segmented by device, traffic source, or motion preference.
 * utm_* reflects the most recent campaign params the visitor arrived with.
 */
const superProperties = (): Record<string, unknown> => ({
    device: deviceType(),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    referrer: document.referrer || 'direct',
    reduced_motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    ...utmParams(),
});

export const initMixpanel = () => {
    if (!MIXPANEL_TOKEN) {
        console.warn('Mixpanel token not set. Analytics disabled.');
        return;
    }
    mixpanel.init(MIXPANEL_TOKEN, {
        debug: false,
        track_pageview: false,
        persistence: 'localStorage',
    });
    // Registered once — merged into the properties of every subsequent event.
    mixpanel.register(superProperties());
};

type TrackOptions = {
    /** Send via navigator.sendBeacon so the event survives a page navigation. */
    sendBeacon?: boolean;
};

export const trackEvent = (
    eventName: string,
    properties?: Record<string, any>,
    options?: TrackOptions,
) => {
    if (!MIXPANEL_TOKEN) return;
    if (options?.sendBeacon) {
        // For events fired right before a navigation (e.g. the contact form's
        // POST to Formspree) — a beacon still delivers as the page unloads.
        mixpanel.track(eventName, properties, { transport: 'sendBeacon', send_immediately: true });
    } else {
        mixpanel.track(eventName, properties);
    }
};
