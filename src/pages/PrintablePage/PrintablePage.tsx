import React from 'react';
import { Link } from 'react-router-dom';
import { calculateYearsOfExperience } from '../../utils/calculateYearsOfExperience';
import { trackEvent } from '../../utils/mixpanel';
import qrInteractiveResume from '../../assets/qr-interactive-resume.svg';
import { data, resumeSummary, type Audience } from './printContent';
import './printable.css';

/** Parsers can garble an arrow, so this version spells it out. */
const plainTitle = (title: string): string => title.replace(' → ', ' to ');

/** Entries with more bullets than this may continue onto the next page,
 * splitting only between bullets (heading, org line, and each bullet stay
 * intact). Shorter entries stay atomic. */
const FLOW_BULLET_THRESHOLD = 5;

interface PrintablePageProps {
    audience: Audience;
}

/** The plain, parser-safe resume for job portals: an unlisted page with the
 * condensed resume's words in one simple column. People get DesignedResume. */
const PrintablePage: React.FC<PrintablePageProps> = ({ audience }) => {
    const corporate = audience === 'corporate';
    const { contact, hero, projects, sections, skills, experience, education } = data;
    const years = calculateYearsOfExperience();
    const paragraphs = resumeSummary(years).split(/\n+/);

    return (
        <div className="pp-screen">
            {/* toolbar — screen only, hidden when printing */}
            <div className="pp-toolbar">
                <Link to="/" className="pp-back">← Back to the site</Link>
                <button
                    type="button"
                    className="pp-print-btn"
                    onClick={() => {
                        trackEvent('Résumé Printed', { variant: `${audience}-plain` });
                        window.print();
                    }}
                >
                    Print / Save as PDF
                </button>
            </div>

            <article className="pp-sheet pp-sheet--condensed">
                {/* ATS contact header — plain semantic text, URLs spelled out visibly.
                  * Parsers key on this block to file the resume; keep it text-only.
                  * The QR block on the right is print-only and sits beside the
                  * contact lines so it costs no vertical space on page one. */}
                <header className="pp-head">
                    <div className="pp-head-main">
                        <h1 className="pp-name">{hero.title}</h1>
                        <p className="pp-role">{hero.eyebrow}</p>
                        <p className="pp-contact-line">
                            {contact.location}
                            <span className="pp-sep" aria-hidden="true">·</span>
                            {contact.email}
                            <span className="pp-sep" aria-hidden="true">·</span>
                            {contact.phone}
                        </p>
                        <p className="pp-contact-line">
                            <a href={`https://www.${contact.linkedin}`}>{contact.linkedin}</a>
                            <span className="pp-sep" aria-hidden="true">·</span>
                            <a href={`https://${contact.website}`}>{contact.website}</a>
                        </p>
                        {!corporate && <p className="pp-availability">{contact.availability}</p>}
                    </div>
                    <div className="pp-head-site">
                        <img className="pp-head-qr" src={qrInteractiveResume} alt={`QR code: ${contact.website}`} />
                        <p className="pp-head-site-text">
                            Interactive version<br />
                            <a href={`https://${contact.website}`}>{contact.website}</a>
                        </p>
                    </div>
                </header>

                <section className="pp-section">
                    <h2 className="pp-section-label">Summary</h2>
                    {paragraphs.map((paragraph) => (
                        <p className="pp-summary" key={paragraph}>{paragraph}</p>
                    ))}
                </section>

                {/* Entries read linearly for text extraction: title → organization →
                  * dates → bullets. The date is right-aligned visually but stays
                  * in the org line's DOM flow — never a structurally separate column. */}
                <section className="pp-section">
                    <h2 className="pp-section-label">Experience</h2>
                    {experience.map((exp) => {
                        const label = corporate
                            ? (exp.corporateEngagementLabel ?? exp.engagementType)
                            : exp.engagementType;
                        const bullets = exp.bullets.filter((bullet) => !bullet.fullOnly);
                        const entryClass = bullets.length > FLOW_BULLET_THRESHOLD
                            ? 'pp-entry pp-entry--flow'
                            : 'pp-entry';
                        return (
                            <div className={entryClass} key={exp.title + exp.organization}>
                                <h3 className="pp-entry-title">{exp.title}</h3>
                                <p className="pp-entry-org">
                                    <span className="pp-entry-org-name">{exp.organization}</span>
                                    {label && label !== 'Employee' && <span className="pp-entry-type">{plainTitle(label)}</span>}
                                    <span className="pp-entry-date">{exp.date}</span>
                                </p>
                                <p className="pp-entry-desc">{exp.lead}</p>
                                <ul className="pp-bullets">
                                    {bullets.map((bullet) => <li key={bullet.text}>{bullet.text}</li>)}
                                </ul>
                            </div>
                        );
                    })}
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Technical Skills</h2>
                    {skills.map((group) => (
                        <p className="pp-skill-line" key={group.category}>
                            <strong>{group.category}:</strong> {group.items.join(', ')}
                        </p>
                    ))}
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Apps</h2>
                    <p className="pp-summary pp-apps-intro">{sections.projects.intro}</p>
                    {projects.filter((project) => project.available).map((project) => (
                        <div className="pp-entry" key={project.name}>
                            <h3 className="pp-entry-title"><a href={project.link}>{project.name}</a></h3>
                            <p className="pp-entry-org"><span>{project.category}</span></p>
                            <p className="pp-entry-desc">{project.description}</p>
                        </div>
                    ))}
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Education &amp; Certifications</h2>
                    {education.map((edu) => (
                        <div className="pp-entry" key={edu.title}>
                            <h3 className="pp-entry-title">{edu.title}</h3>
                            <p className="pp-entry-org">
                                <span>{edu.institution} · {edu.date}</span>
                                {edu.location && <span className="pp-entry-place">{edu.location}</span>}
                            </p>
                        </div>
                    ))}
                </section>
            </article>
        </div>
    );
};

export default PrintablePage;
