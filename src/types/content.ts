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
    date: string;
    link: string;
    engagementType: string;
    bullets?: string[];
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
}

export interface Data {
    hero: Hero;
    contact: Contact;
    skills: SkillGroup[];
    sections: Sections;
    roles: Role[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
}
