/* introGate — a one-shot gate the preloader opens once its reveal finishes,
 * so the hero holds its intro until the page is actually visible. */

let open: () => void = () => {};

/** Resolves when the preloader has handed off (or immediately, if there is none). */
export const introGate: Promise<void> = new Promise<void>((resolve) => {
    open = resolve;
});

/** Called by the preloader as its curtain lifts. */
export const releaseIntro = (): void => open();
