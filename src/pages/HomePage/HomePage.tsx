import React from 'react';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ExperienceCard from "../../components/ExperienceCard/ExperienceCard";
import EducationCard from "../../components/EducationCard/EducationCard.tsx";
import homepageContent from '../../data/HomePage.json';
import { Data } from '../../interfaces/types'; // Import Json types
import "./style.css";
import HeroCardList from "../../components/HeroCard/HeroCard"; // Import local page styles

// Ensure the imported JSON conforms to the Data type
const data: Data = homepageContent as Data;

const HomePage: React.FC = () => {
    return (
        <>
            <div className="flexbox gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col container border-bottom border-start border-end border-black">
                    <Header />
                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Hero Section */}
            <div className="flexbox gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col py-4 px-lg-5 container border-bottom border-start border-end border-black">
                    <section>
                        <h1 className="text-center pb-1 display-3 fw-semibold">{data.hero.title}</h1>
                        <p className="fs-5">{data.hero.subTitle}</p>
                    </section>
                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Hero Card Section */}
            <div className="flexbox-hero-card gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col container px-0 border-bottom border-start border-end border-black">
                    {/*<section className="flexbox-hero-card">*/}
                    {/*    {data.heroCard.map((card, index) => (*/}
                    {/*        <Card key={index} title={card.title} level={card.level} subTitle={card.subTitle} />*/}
                    {/*    ))}*/}
                    {/*</section>*/}
                    <section className="flexbox-hero-card">
                        <HeroCardList/>
                    </section>
                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Blank Section */}
            <div className="flexbox gx-0 bg-dark-subtle">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col py-4 px-lg-5 container border-bottom border-start border-end border-black">

                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Section Title */}
            <div className="flexbox gx-0 light-green">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col py-3 px-lg-5 container border-bottom border-start border-end border-black">
                    <section>
                        <p className="text-center text-dark fs-1 fw-semibold mb-0">Experience</p>
                    </section>
                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Experience Section */}
            <div className="flexbox gx-0 bg-dark-subtle" id="Experience">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col container py-5 px-lg-5 border-bottom border-start border-end border-black">
                    <section>
                        <ExperienceCard />
                    </section>
                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Section Title */}
            <div className="flexbox gx-0 light-green">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col py-3 px-lg-5 container border-bottom border-start border-end border-black">
                    <section>
                        <p className="text-center text-dark fs-1 fw-semibold mb-0">Education</p>
                    </section>
                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Education Section */}
            <div className="flexbox gx-0 bg-dark-subtle" id="Education">
                <div className="w-100 border-bottom border-black"></div>
                <div className="middle-col bg-secondary container px-0 border-bottom border-start border-end border-black">
                    <section className="flexbox-edu-card">
                        <EducationCard/>
                    </section>
                </div>
                <div className="w-100 border-bottom border-black"></div>
            </div>

            {/* Footer row */}
            <div className="flexbox gx-0">
                <div className="w-100 border-black"></div>
                <div className="middle-col container border-start border-end border-black">
                    <div><Footer /></div>
                </div>
                <div className="w-100 border-black"></div>
            </div>
        </>
    );
};

export default HomePage;
