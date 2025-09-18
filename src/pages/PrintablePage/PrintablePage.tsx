// src/pages/PrintablePage.tsx
import React from 'react';
import homepageContent from '../../data/HomePage.json';
import { Data } from '../../interfaces/types';
import './style.css';

const data: Data = homepageContent as Data;

const PrintablePage: React.FC = () => {
    return (
        <div className="container py-5">
            {/* Hero Section */}
            <section className="mb-4">
                <h1 className="text-center display-2">{data.hero.title}</h1>
                <p className="lead">{data.hero.subTitle}</p>
            </section>

            {/* Skills Section */}
            <section className="mb-0">
                <div className="row">
                    {data.heroCard.map((card, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 border rounded-4">
                                <div className="card-body">
                                    <h5 className="text-body-secondary mb-0">{card.level}</h5>
                                    <h5 className="card-title mb-2">{card.title} ({card.level})</h5>
                                    <p className="card-text text-body-secondary mb-3">{card.subTitle}</p>
                                    <div className="d-flex flex-wrap">
                                        {card.badges.map((badge, badgeIndex) => (
                                            <span key={badgeIndex} className="badge rounded-pill text-bg-light border me-1 mb-1">{badge}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience Section */}
            <section className="mb-4">
                <h2 className="fs-5 fw-medium mb-2">Experience</h2>
                {data.experience.map((exp, index) => (
                    <div key={index} className="row mb-4 experience-item"> {/* Added class for targeting */}
                        <div className="col-2">
                            <p className="text-body-secondary">{exp.date}</p>
                        </div>
                        <div className="col-10">
                            <p className="mb-1">{exp.title}</p>
                            <span className="text-body-secondary pe-2"> {exp.organization}</span>
                            <span className="badge rounded-pill text-bg-light border me-1 mb-2">{exp.engagementType}</span>
                            <p>{exp.description}</p>
                            {exp.bullets && (
                                <ul>
                                    {exp.bullets.map((bullet, bulletIndex) => (
                                        <li key={bulletIndex}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                            {exp.link && (
                                <p><a href={exp.link} target="_blank" rel="noopener noreferrer">{exp.link}</a></p>
                            )}
                            {exp.badges && (
                                <div>
                                    {exp.badges.map((badge, badgeIndex) => (
                                        <span key={badgeIndex} className="badge rounded-pill text-bg-light border me-1">{badge}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* Education Section */}
            <section className="mb-5">
                <p className="fs-5 fw-medium mb-2">Education</p>
                {data.education.map((edu, index) => (
                    <div key={index} className="row mb-4 experience-item"> {/* Reuse class if needed */}
                        <div className="col-2">
                            <p className="text-body-secondary">{edu.date}</p>
                        </div>
                        <div className="col-10">
                            <p className="mb-1">{edu.title}</p>
                            <p className="text-body-secondary mb-0">{edu.institution}</p>
                            <p className="text-body-secondary mb-0">{edu.location}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default PrintablePage;