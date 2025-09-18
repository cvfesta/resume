import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN; // Load token from environment variable

// Initialize once, ideally at app startup
export const initMixpanel = () => {
    mixpanel.init(MIXPANEL_TOKEN, {
        debug: false, // Set to true for development
        track_pageview: false, // Disable auto-tracking to avoid duplicates
        persistence: 'localStorage', // Persist user data
        // Add other options as needed: https://docs.mixpanel.com/docs/quickstart/javascript
    });
};

// Example tracking functions (expand as needed)
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    mixpanel.track(eventName, properties);
};

export const identifyUser = (userId: string) => {
    mixpanel.identify(userId);
};

export const setUserProperties = (properties: Record<string, any>) => {
    mixpanel.people.set(properties);
};