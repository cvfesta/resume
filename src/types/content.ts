// types.ts
export interface Hero {
    title: string;
    subTitle: string;
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
    meta?: string;
    link: string;
    icon?: string;
}

export interface Data {
    hero: Hero;
    roles: Role[];
    experience: Experience[];
    education: Education[];
    projects: Project[];
}