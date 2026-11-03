const RESUME_URL = `${import.meta.env.BASE_URL}print`;
const LOAD_TIMEOUT_MS = 8000;

let printing = false;

/** Opens the browser's print window for the condensed resume without leaving
 * the page, by printing it from a hidden frame. Phones can't reliably print a
 * frame, and a frame that doesn't load can't print at all, so both fall back to
 * opening the resume page. */
export const printResume = (): void => {
    if (printing) return;
    if (window.matchMedia('(hover: none)').matches) {
        window.open(RESUME_URL, '_blank', 'noopener');
        return;
    }

    printing = true;
    const frame = document.createElement('iframe');
    frame.title = 'Resume for printing';
    frame.src = RESUME_URL;
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(frame);

    const siteTitle = document.title;
    const cleanUp = () => {
        printing = false;
        document.title = siteTitle;
        frame.remove();
    };

    const startedAt = Date.now();
    const whenReady = () => {
        const doc = frame.contentDocument;
        const images = doc ? Array.from(doc.images) : [];
        if (doc?.querySelector('.dr-page') && images.every((image) => image.complete)) {
            doc.fonts.ready.then(() => {
                frame.contentWindow?.addEventListener('afterprint', cleanUp);
                // The browser names the PDF after this page, not the frame.
                document.title = doc.title;
                frame.contentWindow?.print();
            });
        } else if (Date.now() - startedAt > LOAD_TIMEOUT_MS) {
            cleanUp();
            window.open(RESUME_URL, '_blank', 'noopener');
        } else {
            window.setTimeout(whenReady, 100);
        }
    };
    whenReady();
};
