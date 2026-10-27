// types.ts
export interface Hero {
    title: string;
    eyebrow: string;
    statLabel: string;
    /** Lime kicker labels over the hero statement's paragraphs, paired by
     *  index with subTitle's \n\n-separated paragraphs (site only). */
    statementKickers?: string[];
    subTitle: string;
}

/** Contact block rendered as the ATS-parseable header on the print page. */
export interface Contact {
    /** Credential appended to the title line, e.g. "PMP". */
    credential: string;
    location: string;
    email: string;
    phone: string;
    /** Display-form URLs (no scheme) — rendered as visible text so parsers can read them. */
    linkedin: string;
    website: string;
    availability: string;
    /** Extra header lines for the contract/C2C print variants (entity,
     *  availability date, location/remote posture, work authorization). */
    contractDetails: string[];
}

/** One entry in the condensed contract print's "Selected AI & Build Work" block. */
export interface SelectedProject {
    /** Bold lead-in, written with its own closing period. */
    title: string;
    text: string;
}

/** Audience-specific copy for the condensed print variants.
 *  `{YEARS}` is replaced with the computed years of experience. Every
 *  optional field is omitted (or falls back) when absent. */
export interface PrintAudienceCopy {
    headline: string;
    summary: string;
    /** One-line skills list rendered directly under the summary. */
    skillsLead?: string;
    /** Rendered after the skills, before Experience. */
    selectedProjects?: SelectedProject[];
    /** Replaces `PrintContent.highlights` for this audience. */
    highlights?: string[];
}

/** Print-only content: per-audience copy plus the Highlights block. */
export interface PrintContent {
    corporate: PrintAudienceCopy;
    contract: PrintAudienceCopy;
    /** Default Highlights, used when an audience has none of its own. */
    highlights: string[];
}

/** One "Category: item, item, …" line in the print page's Technical Skills section. */
export interface SkillGroup {
    category: string;
    items: string[];
}

/** Heading block (kicker + title, plus optional intro) shared by every section. */
export interface SectionHead {
    kicker: string;
    title: string;
    intro?: string;
    /** Optional outbound link rendered beside the heading (e.g. the studio site). */
    cta?: { label: string; href: string };
}

export interface Sections {
    roles: SectionHead;
    experience: SectionHead;
    education: SectionHead;
    projects: SectionHead;
}

export interface Role {
    title: string;
    level: string;
    subTitle: string;
    badges: string[];
}

export interface Experience {
    title: string;
    organization: string;
    /** One-line outcome shown as the card opener on the interactive site.
     *  When present, the site shows it instead of `description` (print
     *  always uses the full description). */
    lead?: string;
    description: string;
    /** `description` without the contracting detail, for the corporate
     *  prints; falls back to `description`. */
    corporateDescription?: string;
    date: string;
    link: string;
    engagementType: string;
    bullets?: string[];
    /** Audience rewrites of `bullets` (same facts) for the condensed
     *  contract / corporate prints; each falls back to `bullets`. */
    contractBullets?: string[];
    corporateBullets?: string[];
    /** Engagement label on the corporate prints and the interactive site
     *  in place of `engagementType`; "" hides it. The contract prints
     *  always show `engagementType`. */
    corporateEngagementLabel?: string;
    badges?: string[];
}

export interface Education {
    title: string;
    institution: string,
    location: string,
    date: string;
    icon: string;
    description?: string;
}

export interface Project {
    name: string;
    tagline: string;
    description: string;
    category: string;
    /** Small status/footnote label, e.g. "Coming soon" or "Free · In-app purchases". */
    meta?: string;
    /** Whether the app is live on the App Store. Drives the link/CTA vs. coming-soon switch. */
    available?: boolean;
    link: string;
    /** Slug into the SVG logo map (see Projects.tsx `logoFor`). */
    icon?: string;
    /** Bootstrap-icon class used as a fallback glyph until a real logo is added. */
    glyph?: string;
    /** Slug into the screenshot map (see Projects.tsx `shotFor`). */
    shot?: string;
    /** The product's own brand accent; drives its status chip. The studio
     *  site uses the same value so the two read as one system. */
    brandColor?: string;
    /** Small footnote under the card's CTA, e.g. "Free · Pro subscription". */
    note?: string;
    /** One-sentence version for the condensed corporate print's Independent
     *  Projects block; projects without one are left out there. */
    printLine?: string;
}

export interface Data {
    hero: Hero;
    contact: Contact;
    print: PrintContent;
    skills: SkillGroup[];
    sections: Sections;
    roles: Role[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
}
