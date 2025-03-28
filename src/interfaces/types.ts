// types.ts
export interface Hero {
    title: string;
    subTitle: string;
}

export interface HeroCard {
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
}

export interface Education {
    title: string;
    institution: string,
    location: string,
    date: string;
    icon: string;
    description: string;
}

export interface Data {
    hero: Hero;
    heroCard: HeroCard[];
    experience: Experience[];
    education: Education[];
}
