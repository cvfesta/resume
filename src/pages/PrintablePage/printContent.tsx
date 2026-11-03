import homepageContent from '../../content/resume.json';
import { Data } from '../../types/content';

// No `as` cast: assigning the JSON module directly lets TypeScript verify the
// file actually has every key these pages render (a hand-edited resume.json
// missing `contact`/`skills` crashed the print page to a blank screen once).
export const data: Data = homepageContent;

export type Audience = 'corporate' | 'contract';

/** The shared intro, with the years filled in. */
export const resumeSummary = (years: string): string =>
    data.hero.summary.split('{YEARS}').join(years);
