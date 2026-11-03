// types.ts
export interface Hero {
    title: string;
    eyebrow: string;
    statLabel: string;
    /** The intro, shared by the site and every resume. `{YEARS}` is replaced
     *  with the computed years of experience. The site's title card shows its
     *  first sentence, with the rest beneath. */
    summary: string;
    /** Label on the site's intro card. */
    summaryLabel: string;
    /** Proof wall tiles, shared by the site and every resume. */
    proofWall: ProofTile[];
}

/** One proof-wall tile: a label, a big claim, and a line of explanation. */
export interface ProofTile {
    kicker: string;
    title: string;
    text: string;
    /** "wide" takes twice the width of a standard tile. */
    size?: string;
    /** "accent" = lime fill. */
    tone?: string;
    /** "flow" = automation → AI → person mark; "apps" = linked app icons. */
    visual?: string;
}

/** Contact block rendered as the ATS-parseable header on the print page. */
export interface Contact {
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
    /** One-line opener, shared by the site and every resume. */
    lead: string;
    date: string;
    link: string;
    engagementType: string;
    /** In display order. Shown on the site and every resume, except that
     *  `fullOnly` bullets are left off the condensed and plain resumes. */
    bullets: { text: string; fullOnly?: boolean }[];
    /** Engagement label on the main resumes and the site in place of
     *  `engagementType`; "" hides it. The contract resumes always show
     *  `engagementType`. */
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
    /** A coming-soon line shown in place of the screenshot on the site; a
     *  project with one shows no tagline or description there. */
    teaser?: string;
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
