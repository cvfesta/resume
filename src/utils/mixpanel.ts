import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '9fe0a45051663a4fa5d964c6d3eb3183'; // Your token

// Initialize once, ideally at app startup
export const initMixpanel = () => {
    mixpanel.init(MIXPANEL_TOKEN, {
        debug: false, // Set to true for development
        track_pageview: true, // Auto-track page views (but handle SPA navigation separately)
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