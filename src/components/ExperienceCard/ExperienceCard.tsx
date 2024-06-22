import React from 'react';
import experienceData from '../../data/HomePage.json'; // Import Json
import { Data, Experience } from '../../interfaces/types'; // Import Json types
import './style.css';

// Ensure the imported JSON conforms to the Data type
const data: Data = experienceData as Data;

const Card: React.FC<Experience> = ({ title, organization, description, date, link }) => {
    return (
        <>
            <div className="flexbox gap-2 gap-lg-4">
                <div>
                    <p className="date-size">{date}</p>
                </div>

                <div className="timeline text-center mb-3">
                    <div className="circle rounded-circle border border-dark w-5 h-5"></div>
                    <div className="vr opacity-100 h-100"></div>
                </div>

                <div className="card rounded-5 border-bottom border-black py-4 py-lg-5 px-4 px-lg-5 mb-3">
                    <p className="fs-2 fw-semibold mb-0 lh-1">{title}</p>
                    {organization && <p className="fs-4 pt-1 lh-1 fw-semibold text-body-tertiary">{organization}</p>}
                    <p>{description}</p>
                    {link && <a className="btn btn-outline-dark exp-button rounded-5" target="_blank" href={link}>View ca-path.com</a>}
                </div>
            </div>
        </>
    );
};

const ExperienceCard: React.FC = () => {
    return (
        <div>
            {data.experience.map((exp, index) => (
                <Card
                    key={index}
                    title={exp.title}
                    organization={exp.organization}
                    description={exp.description}
                    date={exp.date}
                    link={exp.link}
                />
            ))}
        </div>
    );
};

export default ExperienceCard;