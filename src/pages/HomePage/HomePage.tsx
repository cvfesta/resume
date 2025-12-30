import React from 'react';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ExperienceCard from "../../components/ExperienceCard/ExperienceCard";
import EducationCard from "../../components/EducationCard/EducationCard.tsx";
import homepageContent from '../../data/HomePage.json';
import { Data } from '../../interfaces/types';
import "./style.css";
import HeroCardList from "../../components/HeroCard/HeroCard";

const data: Data = homepageContent as Data;

// Dynamically calculate years of professional experience since May 2009
const calculateYearsOfExperience = (): string => {
    const graduationYear = 2009;
    const graduationMonth = 5; // May (Penn State spring commencement)

    const startDate = new Date(graduationYear, graduationMonth - 1); // Months are 0-indexed
    const currentDate = new Date();

    let years = currentDate.getFullYear() - startDate.getFullYear();
    const monthDiff = currentDate.getMonth() - startDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < startDate.getDate())) {
        years--;
    }

    return `${years}+`;
};

const HomePage: React.FC = () => {
    const yearsOfExperience = calculateYearsOfExperience();

    // Replace the {YEARS} placeholder in the JSON subtitle with the dynamic value
    const subTitleWithYears = data.hero.subTitle.replace('{YEARS}', yearsOfExperience);

    return (
        <>
            <div className="flexbox gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col container border-bottom border-start border-end border-secondary">
                    <Header />
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Hero Section */}
            <div className="flexbox gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col py-4 px-lg-5 container border-bottom border-start border-end border-secondary">
                    <section>
                        <h1 className="text-center pb-1 display-2">{data.hero.title}</h1>
                        <p className="fs-5">{subTitleWithYears}</p>
                    </section>
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Hero Card Section */}
            <div className="flexbox-hero-card gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col container px-0 border-bottom border-start border-end border-secondary">
                    <section className="flexbox-hero-card">
                        <HeroCardList />
                    </section>
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Blank Section */}
            <div className="flexbox gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col py-4 px-lg-5 container border-bottom border-start border-end border-secondary">
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Section Title - Experience */}
            <div className="flexbox gx-0 light-green">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col py-3 px-lg-5 container border-bottom border-start border-end border-secondary">
                    <section>
                        <p className="text-center text-dark fs-1 fw-semibold mb-0">Experience</p>
                    </section>
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Experience Section */}
            <div className="flexbox gx-0 bg-dark-subtle" id="Experience">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col container py-5 px-lg-5 border-bottom border-start border-end border-secondary">
                    <section>
                        <ExperienceCard />
                    </section>
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Section Title - Education */}
            <div className="flexbox gx-0 light-green">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col py-3 px-lg-5 container border-bottom border-start border-end border-secondary">
                    <section>
                        <p className="text-center text-dark fs-1 fw-semibold mb-0">Education</p>
                    </section>
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Education Section */}
            <div className="flexbox gx-0 bg-dark-subtle" id="Education">
                <div className="w-100 border-bottom border-secondary"></div>
                <div className="middle-col bg-secondary container px-0 border-bottom border-start border-end border-secondary">
                    <section className="flexbox-edu-card">
                        <EducationCard />
                    </section>
                </div>
                <div className="w-100 border-bottom border-secondary"></div>
            </div>

            {/* Footer */}
            <div className="flexbox gx-0">
                <div className="w-100 border-secondary bg-dark"></div>
                <div className="middle-col container border-start border-end border-secondary bg-dark">
                    <div><Footer /></div>
                </div>
                <div className="w-100 border-secondary bg-dark"></div>
            </div>
        </>
    );
};

export default HomePage;