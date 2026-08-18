import React from 'react';
import { Link } from 'react-router-dom';
import homepageContent from '../../content/resume.json';
import { Data, Experience } from '../../types/content';
import { calculateYearsOfExperience } from '../../utils/calculateYearsOfExperience';
import { trackEvent } from '../../utils/mixpanel';
import qrInteractiveResume from '../../assets/qr-interactive-resume.svg';
import './printable.css';

// No `as` cast: assigning the JSON module directly lets TypeScript verify the
// file actually has every key this page renders (a hand-edited resume.json
// missing `contact`/`skills` crashed this page to a blank screen once).
const data: Data = homepageContent;

/** "https://ca-path.com/" → "ca-path.com" */
const hostnameOf = (url: string): string => {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
};

/** Bullets each entry keeps on the condensed variant, keyed by
 * "organization|date" (falling back to organization alone). All trimming
 * lives here in the render layer — the data stays complete for /print/full. */
const CONDENSED_BULLET_COUNTS: Record<string, number> = {
    'Christian Festa LLC': 0,
    'Aloha Fitness': 0,
    'Public Consulting Group': Infinity,
    'Unisys|2018 - 2022': 2,
    'County Welfare Directors Association of California': 1,
    // DCJS + LEADER named-engagement bullets (the first two)
    'Unisys|2009 - 2016': 2,
};

const condensedBullets = (exp: Experience): string[] => {
    const bullets = exp.bullets ?? [];
    const count = CONDENSED_BULLET_COUNTS[`${exp.organization}|${exp.date}`]
        ?? CONDENSED_BULLET_COUNTS[exp.organization]
        ?? Infinity;
    return bullets.slice(0, count === Infinity ? bullets.length : count);
};

interface PrintablePageProps {
    /** "condensed" (/print, ~2 pages, the version submitted to jobs) or
     *  "full" (/print/full, every section and bullet). */
    variant?: 'condensed' | 'full';
}

const PrintablePage: React.FC<PrintablePageProps> = ({ variant = 'full' }) => {
    const condensed = variant === 'condensed';
    const years = calculateYearsOfExperience();
    const summaryParagraphs = data.hero.subTitle
        .replace('{YEARS}', years)
        .split(/\n+/)
        .filter(Boolean);
    const summaryShown = condensed ? summaryParagraphs.slice(0, 1) : summaryParagraphs;
    const { contact } = data;

    return (
        <div className="pp-screen">
            {/* toolbar — screen only, hidden when printing */}
            <div className="pp-toolbar">
                <Link to="/" className="pp-back">← Back to the site</Link>
                {!condensed && (
                    <Link
                        to="/print"
                        className="pp-variant-link"
                        onClick={() => trackEvent('Résumé Variant Toggled', {
                            from: variant, to: 'condensed',
                        })}
                    >
                        View condensed version
                    </Link>
                )}
                <button
                    type="button"
                    className="pp-print-btn"
                    onClick={() => {
                        trackEvent('Résumé Printed', { variant });
                        window.print();
                    }}
                >
                    Print / Save as PDF
                </button>
            </div>

            {/* Context banner (Option B) — condensed screen view only, hidden in print */}
            {condensed && (
                <div className="pp-banner">
                    <div className="pp-banner-text">
                        <strong>You're reading the condensed resume — 3 pages.</strong>
                        <span>The full version adds areas of expertise, every engagement detail, and shipped products.</span>
                    </div>
                    <Link
                        to="/print/full"
                        className="pp-banner-btn"
                        onClick={() => trackEvent('Full Résumé CTA Clicked', { source: 'banner' })}
                    >
                        Read the full resume
                    </Link>
                </div>
            )}

            <article className={condensed ? 'pp-sheet pp-sheet--condensed' : 'pp-sheet'}>
                {/* ATS contact header — plain semantic text, URLs spelled out visibly.
                  * Parsers key on this block to file the resume; keep it text-only. */}
                <header className="pp-head">
                    <h1 className="pp-name">{data.hero.title}</h1>
                    <p className="pp-role">{data.hero.eyebrow} · {contact.credential}</p>
                    <p className="pp-contact-line">
                        {contact.location}
                        <span className="pp-sep" aria-hidden="true">·</span>
                        {contact.email}
                        <span className="pp-sep" aria-hidden="true">·</span>
                        {contact.phone}
                    </p>
                    <p className="pp-contact-line">
                        <a
                            href={`https://www.${contact.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('Outbound Link Clicked', {
                                label: 'LinkedIn', url: contact.linkedin, location: 'print',
                            })}
                        >
                            {contact.linkedin}
                        </a>
                        <span className="pp-sep" aria-hidden="true">·</span>
                        <a
                            href={`https://${contact.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('Outbound Link Clicked', {
                                label: 'Website', url: contact.website, location: 'print',
                            })}
                        >
                            {contact.website}
                        </a>
                    </p>
                    <p className="pp-availability">{contact.availability}</p>
                </header>

                {/* Page-one strip — print/PDF only. Pitches the interactive site as
                  * a work sample and carries a scannable QR for paper readers. */}
                <div className="pp-site-strip">
                    <div className="pp-site-strip-text">
                        <p className="pp-site-strip-title">Prefer the live version?</p>
                        <p className="pp-site-strip-sub">
                            This document is a static export of an interactive resume
                            I designed and built —{' '}
                            <a href={`https://${contact.website}`}>{contact.website}</a>
                        </p>
                    </div>
                    <img
                        className="pp-site-strip-qr"
                        src={qrInteractiveResume}
                        alt={`QR code: ${contact.website}`}
                    />
                </div>

                <section className="pp-section">
                    <h2 className="pp-section-label">Summary</h2>
                    {summaryShown.map((paragraph, i) => (
                        <p className="pp-summary" key={i}>{paragraph}</p>
                    ))}
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Technical Skills</h2>
                    {data.skills.map((group) => (
                        <p className="pp-skill-line" key={group.category}>
                            <strong>{group.category}:</strong> {group.items.join(', ')}
                        </p>
                    ))}
                </section>

                {!condensed && <section className="pp-section">
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
                </section>}

                {/* Entries read linearly for text extraction: title → organization →
                  * dates → bullets. The date is right-aligned visually but stays in
                  * the org line's DOM flow — never a structurally separate column. */}
                <section className="pp-section">
                    <h2 className="pp-section-label">Experience</h2>
                    {data.experience.map((exp) => {
                        const bullets = condensed ? condensedBullets(exp) : (exp.bullets ?? []);
                        return (
                        <div className="pp-entry" key={exp.title + exp.organization}>
                            <h3 className="pp-entry-title">{exp.title}</h3>
                            <p className="pp-entry-org">
                                <span>{exp.organization}</span>
                                {exp.engagementType && (
                                    <span className="pp-entry-type">{exp.engagementType}</span>
                                )}
                                <span className="pp-entry-date">{exp.date}</span>
                            </p>
                            <p className="pp-entry-desc">{exp.description}</p>
                            {bullets.length > 0 && (
                                <ul className="pp-bullets">
                                    {bullets.map((bullet, i) => (
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
                        );
                    })}
                </section>

                <section className="pp-section">
                    <h2 className="pp-section-label">Education &amp; Certifications</h2>
                    {data.education.map((edu) => (
                        <div className="pp-entry" key={edu.title}>
                            <h3 className="pp-entry-title">{edu.title}</h3>
                            <p className="pp-entry-org">
                                <span>{edu.institution}</span>
                                {edu.location && (
                                    <span className="pp-entry-place">{edu.location}</span>
                                )}
                                <span className="pp-entry-date">{edu.date}</span>
                            </p>
                        </div>
                    ))}
                </section>

                {/* End-of-resume card (Option C) — condensed screen view only */}
                {condensed && (
                    <aside className="pp-more">
                        <p className="pp-more-title">There's more to the story</p>
                        <p className="pp-more-sub">
                            The full resume adds four areas of expertise, every engagement
                            in complete detail, and the products I've designed, built, and shipped.
                        </p>
                        <Link
                            to="/print/full"
                            className="pp-more-btn"
                            onClick={() => trackEvent('Full Résumé CTA Clicked', { source: 'end-card' })}
                        >
                            <span>View the full resume</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </aside>
                )}

                {/* Printed/PDF-only closing line: points readers at the full version
                  * (the page-one strip already carries the interactive-site pitch). */}
                {condensed && (
                    <p className="pp-print-footer">
                        This is the condensed resume. Full detail — areas of expertise, every
                        engagement, and shipped products:{' '}
                        <a href={`https://${contact.website}/print/full`}>{contact.website}/print/full</a>
                    </p>
                )}

                {!condensed && <section className="pp-section">
                    <h2 className="pp-section-label">Projects</h2>
                    {data.projects.map((project) => (
                        <div className="pp-entry" key={project.name}>
                            <h3 className="pp-entry-title">{project.name}</h3>
                            <p className="pp-entry-org">
                                <span>{project.tagline}</span>
                                {project.meta && (
                                    <span className="pp-entry-type">{project.meta}</span>
                                )}
                                <span className="pp-entry-date">{project.category}</span>
                            </p>
                            <p className="pp-entry-desc">{project.description}</p>
                            {project.link && (
                                <p className="pp-entry-link">
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackEvent('Project Link Clicked', {
                                            project: project.name, url: project.link, location: 'print',
                                        })}
                                    >
                                        {hostnameOf(project.link)}
                                    </a>
                                </p>
                            )}
                        </div>
                    ))}
                </section>}
            </article>
        </div>
    );
};

export default PrintablePage;
