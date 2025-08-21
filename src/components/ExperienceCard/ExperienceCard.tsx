import React from 'react';
import experienceData from '../../data/HomePage.json';
import { Data, Experience } from '../../interfaces/types';
import './style.css';

const data: Data = experienceData as Data;

// Keep Card props as Experience, but add isLast as an additional prop
const Card: React.FC<Experience & { isLast?: boolean }> = ({ title, organization, description, date, link, engagementType, bullets, badges, isLast }) => {
    return (
        <>
            <div className="flexbox gap-2 gap-lg-4">
                <div>
                    <p className="date-size">{date}</p>
                </div>
                <div className="timeline text-center mb-3">
                    <div className="circle rounded-circle border border-secondary w-5 h-5"></div>
                    {!isLast && <div className="vr opacity-100 h-100"></div>}
                </div>
                <div className="card rounded-5 border-bottom border-secondary py-4 py-lg-5 px-4 px-lg-5 mb-3">
                    <p className="fs-2 fw-semibold mb-1 lh-1">{title}</p>
                    {organization && (
                        <div className="mb-2 d-flex align-items-center">
                            <span className="fs-4 pt-1 lh-1 fw-semibold text-body-tertiary mb-1 me-2">{organization}</span>
                            <span className="badge rounded-pill text-bg-light border mb-0">{engagementType}</span>
                        </div>
                    )}
                    <p>{description}</p>
                    {bullets && bullets.length > 0 && (
                        <ul className="">
                            {bullets.map((bullet, index) => (
                                <li key={index} className="">{bullet}</li>
                            ))}
                        </ul>
                    )}
                    {badges && badges.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-3">
                            {badges.map((badge, index) => (
                                <span key={index} className="badge rounded-pill text-bg-light border">{badge}</span>
                            ))}
                        </div>
                    )}
                    {link && <a className="btn btn-outline-dark exp-button rounded-5 mt-3" target="_blank" href={link}>View ca-path.com</a>}
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
                    engagementType={exp.engagementType}
                    bullets={exp.bullets}
                    badges={exp.badges}
                    isLast={index === data.experience.length - 1} // Dynamically determine if last
                />
            ))}
        </div>
    );
};

export default ExperienceCard;