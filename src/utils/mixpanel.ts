import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

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
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (!MIXPANEL_TOKEN) return;
    mixpanel.track(eventName, properties);
};

// Update other functions similarly if needed