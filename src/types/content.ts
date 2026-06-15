// types.ts
export interface Hero {
    title: string;
    eyebrow: string;
    statLabel: string;
    subTitle: string;
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
    sections: Sections;
    roles: Role[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
}
