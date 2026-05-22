import React from 'react';
import { Link } from 'react-router-dom';
import homepageContent from '../../content/resume.json';
import { Data } from '../../types/content';
import { calculateYearsOfExperience } from '../../utils/calculateYearsOfExperience';
import footerData from '../../content/links.json';
import { trackEvent } from '../../utils/mixpanel';
import './printable.css';

const data: Data = homepageContent as Data;

/** "https://ca-path.com/" → "ca-path.com" */
const hostnameOf = (url: string): string => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
};

const PrintablePage: React.FC = () => {
    const years = calculateYearsOfExperience();
    const summary = data.hero.subTitle.replace('{YEARS}', years);
    const links = footerData.Links.filter((link) => link.display);

    return (
        <div className="pp-screen">
            {/* toolbar — screen only, hidden when printing */}
            <div className="pp-toolbar">
                <Link to="/" className="pp-back">← Back to the site</Link>
                <button
                    type="button"
                    className="pp-print-btn"
                    onClick={() => {
                        trackEvent('Résumé Printed');
                        window.print();
                    }}
                >
                    Print / Save as PDF
                </button>
            </div>

            <article className="pp-sheet">
                <header className="pp-head">
                    <h1 className="pp-name">{data.hero.title}</h1>
                    <p className="pp-role">Technology Executive · {years} years of experience</p>
                    <p className="pp-contact">
                        {links.map((link, i) => (
                            <React.Fragment key={link.id}>
                                {i > 0 && <span className="pp-sep" aria-hidden="true">·</span>}
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => trackEvent('Outbound Link Clicked', {
                                        label: link.name, url: link.href, location: 'print',
                                    })}
                                >
                                    {link.name}
                                </a>
                            </React.Fragment>
                        ))}
                    </p>
                </header>

                <section className="pp-section">
                    <h2 className="pp-section-label">Summary</h2>
                    <p className="pp-summary">{summary}</p>
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Areas of Expertise</h2>
                    {data.roles.map((card) => (
                        <div className="pp-expertise" key={card.title}>
                            <h3 className="pp-expertise-title">
                                {card.title}
                                <span className="pp-expertise-level">{card.level}</span>
                            </h3>
                            <div className="pp-skills">
                                {card.badges.map((badge) => (
                                    <span className="pp-skill" key={badge}>{badge}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Experience</h2>
                    {data.experience.map((exp) => (
                        <div className="pp-entry" key={exp.title + exp.organization}>
                            <div className="pp-entry-date">{exp.date}</div>
                            <div className="pp-entry-main">
                                <h3 className="pp-entry-title">{exp.title}</h3>
                                <p className="pp-entry-org">
                                    <span>{exp.organization}</span>
                                    {exp.engagementType && (
                                        <span className="pp-entry-type">{exp.engagementType}</span>
                                    )}
                                </p>
                                <p className="pp-entry-desc">{exp.description}</p>
                                {exp.bullets && exp.bullets.length > 0 && (
                                    <ul className="pp-bullets">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i}>{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                                {exp.link && (
                                    <p className="pp-entry-link">
                                        <a
                                            href={exp.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => trackEvent('Experience Link Clicked', {
                                                company: exp.organization, role: exp.title,
                                                url: exp.link, location: 'print',
                                            })}
                                        >
                                            {hostnameOf(exp.link)}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Education &amp; Certifications</h2>
                    {data.education.map((edu) => (
                        <div className="pp-entry" key={edu.title}>
                            <div className="pp-entry-date">{edu.date}</div>
                            <div className="pp-entry-main">
                                <h3 className="pp-entry-title">{edu.title}</h3>
                                <p className="pp-entry-org">
                                    <span>{edu.institution}</span>
                                    {edu.location && (
                                        <span className="pp-entry-place">{edu.location}</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            </article>
        </div>
    );
};

export default PrintablePage;
