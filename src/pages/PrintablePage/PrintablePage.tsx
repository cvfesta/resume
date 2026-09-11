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

/** Bullets each entry keeps on the condensed variants, keyed by
 * "organization|date" (falling back to organization alone). All trimming
 * lives here in the render layer — the data stays complete for the full variants. */
const CONDENSED_BULLET_COUNTS: Record<string, number> = {
    'Public Consulting Group': 6,
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

/** Entries with more bullets than this may continue onto the next page,
 * splitting only between bullets (heading, org line, description, and each
 * bullet stay intact). Shorter entries stay atomic. Without this the PCG
 * entry, too tall for the space under Technical Skills, jumps whole to
 * page 2 and leaves a quarter of page 1 blank. */
const FLOW_BULLET_THRESHOLD = 5;

/** The four print routes: a condensed and a full-detail resume per audience.
 * The condensed ones are what actually gets submitted; each links to the
 * full version of its *own* audience, so a reader of the C2C resume lands
 * straight on the C2C full resume. `audience` picks the headline/summary
 * copy from `resume.json`'s `print` block and decides whether the
 * contract-only header lines show. */
export type PrintVariant = 'corporate' | 'contract' | 'corporateFull' | 'contractFull';
type PrintAudience = 'corporate' | 'contract';

interface VariantMeta {
    path: string;
    label: string;
    audience: PrintAudience;
    condensed: boolean;
}

const VARIANTS: Record<PrintVariant, VariantMeta> = {
    corporate: { path: '/print', label: 'corporate (W-2)', audience: 'corporate', condensed: true },
    contract: { path: '/print/c2c', label: 'contract (C2C)', audience: 'contract', condensed: true },
    corporateFull: { path: '/print/full', label: 'corporate (W-2)', audience: 'corporate', condensed: false },
    contractFull: { path: '/print/c2c/full', label: 'contract (C2C)', audience: 'contract', condensed: false },
};

/** The variant at the other detail level for the same audience. */
const counterpartOf = (variant: PrintVariant): PrintVariant => {
    const { audience, condensed } = VARIANTS[variant];
    return (Object.keys(VARIANTS) as PrintVariant[]).find(
        (v) => VARIANTS[v].audience === audience && VARIANTS[v].condensed !== condensed,
    )!;
};

/** The variant for the other audience at the same detail level. */
const siblingOf = (variant: PrintVariant): PrintVariant => {
    const { audience, condensed } = VARIANTS[variant];
    return (Object.keys(VARIANTS) as PrintVariant[]).find(
        (v) => VARIANTS[v].audience !== audience && VARIANTS[v].condensed === condensed,
    )!;
};

interface PrintablePageProps {
    variant?: PrintVariant;
}

const PrintablePage: React.FC<PrintablePageProps> = ({ variant = 'contractFull' }) => {
    const { condensed, audience, label } = VARIANTS[variant];
    const fullVariant = condensed ? counterpartOf(variant) : variant;
    const fullPath = VARIANTS[fullVariant].path;
    const corporate = audience === 'corporate';
    const years = calculateYearsOfExperience();
    const { contact } = data;
    const copy = data.print[audience];
    const headline = copy.headline || data.hero.eyebrow;

    // Condensed variants carry a purpose-written summary per audience; the
    // full version keeps the site's complete hero statement.
    const summaryParagraphs = (condensed ? copy.summary : data.hero.subTitle)
        .split('{YEARS}').join(years)
        .split(/\n+/)
        .filter(Boolean);
    const highlights = data.print.highlights ?? [];
    const ventures = data.experience.filter((exp) => exp.section === 'ventures');
    const experience = data.experience.filter((exp) => exp.section !== 'ventures');

    const variantLink = (target: PrintVariant, className: string, text?: string) => (
        <Link
            key={target}
            to={VARIANTS[target].path}
            className={className}
            onClick={() => trackEvent('Résumé Variant Toggled', { from: variant, to: target })}
        >
            {text ?? `View ${VARIANTS[target].label} version`}
        </Link>
    );

    return (
        <div className="pp-screen">
            {/* toolbar — screen only, hidden when printing */}
            <div className="pp-toolbar">
                <Link to="/" className="pp-back">← Back to the site</Link>
                <div className="pp-variant-links">
                    {variantLink(siblingOf(variant), 'pp-variant-link')}
                    {variantLink(
                        counterpartOf(variant),
                        'pp-variant-link',
                        condensed ? 'View full-detail version' : 'View condensed version',
                    )}
                </div>
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

            {/* Context banner — condensed screen view only, hidden in print */}
            {condensed && (
                <div className="pp-banner">
                    <div className="pp-banner-text">
                        <strong>You're reading the condensed {label} resume.</strong>
                        <span>The full version adds areas of expertise, every engagement detail, and shipped products.</span>
                    </div>
                    <Link
                        to={fullPath}
                        className="pp-banner-btn"
                        onClick={() => trackEvent('Full Résumé CTA Clicked', { source: 'banner', variant })}
                    >
                        Read the full resume
                    </Link>
                </div>
            )}

            <article className={condensed ? 'pp-sheet pp-sheet--condensed' : 'pp-sheet'}>
                {/* ATS contact header — plain semantic text, URLs spelled out visibly.
                  * Parsers key on this block to file the resume; keep it text-only.
                  * The QR block on the right is print-only and sits beside the
                  * contact lines so it costs no vertical space on page one. */}
                <header className="pp-head">
                    <div className="pp-head-main">
                        <h1 className="pp-name">{data.hero.title}</h1>
                        <p className="pp-role">{headline} · {contact.credential}</p>
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
                        {!corporate && (
                            <p className="pp-availability">
                                {[contact.availability, ...contact.contractDetails].map((line, i) => (
                                    <React.Fragment key={line}>
                                        {i > 0 && <span className="pp-sep" aria-hidden="true">·</span>}
                                        {line}
                                    </React.Fragment>
                                ))}
                            </p>
                        )}
                    </div>
                    <div className="pp-head-site">
                        <img
                            className="pp-head-qr"
                            src={qrInteractiveResume}
                            alt={`QR code: ${contact.website}`}
                        />
                        <p className="pp-head-site-text">
                            Interactive version<br />
                            <a href={`https://${contact.website}`}>{contact.website}</a>
                        </p>
                    </div>
                </header>

                <section className="pp-section">
                    <h2 className="pp-section-label">Summary</h2>
                    {summaryParagraphs.map((paragraph, i) => (
                        <p className="pp-summary" key={i}>{paragraph}</p>
                    ))}
                </section>

                {highlights.length > 0 && (
                    <section className="pp-section">
                        <h2 className="pp-section-label">Highlights</h2>
                        <ul className="pp-bullets pp-highlights">
                            {highlights.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}

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
                  * link → dates → bullets. The date is right-aligned visually but stays
                  * in the org line's DOM flow — never a structurally separate column. */}
                <section className="pp-section">
                    <h2 className="pp-section-label">Experience</h2>
                    {experience.map((exp) => {
                        const bullets = condensed ? condensedBullets(exp) : (exp.bullets ?? []);
                        const entryClass = bullets.length > FLOW_BULLET_THRESHOLD
                            ? 'pp-entry pp-entry--flow'
                            : 'pp-entry';
                        // Corporate readers assume "employee"; the pill only earns
                        // its space there when the engagement was something else.
                        const showType = !!exp.engagementType
                            && !(corporate && exp.engagementType === 'Employee');
                        return (
                        <div className={entryClass} key={exp.title + exp.organization}>
                            <h3 className="pp-entry-title">{exp.title}</h3>
                            <p className="pp-entry-org">
                                <span className="pp-entry-org-name">{exp.organization}</span>
                                {exp.link && (
                                    <a
                                        className="pp-entry-org-link"
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
                                )}
                                {showType && (
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
                        </div>
                        );
                    })}
                </section>

                {/* Founder roles, kept out of the Experience narrative: one compact
                  * block each — org, then role + dates, then a short prose summary. */}
                {ventures.length > 0 && (
                    <section className="pp-section pp-section--ventures">
                        <h2 className="pp-section-label">Independent Ventures</h2>
                        {ventures.map((exp) => (
                            <div className="pp-venture" key={exp.title + exp.organization}>
                                <h3 className="pp-venture-org">{exp.organization}</h3>
                                <p className="pp-venture-role">
                                    <span>{exp.title}</span>
                                    <span className="pp-entry-date">{exp.date}</span>
                                </p>
                                <p className="pp-venture-summary">{exp.ventureSummary ?? exp.description}</p>
                            </div>
                        ))}
                    </section>
                )}

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

                {/* End-of-resume card — condensed screen view only */}
                {condensed && (
                    <aside className="pp-more">
                        <p className="pp-more-title">There's more to the story</p>
                        <p className="pp-more-sub">
                            The full resume adds four areas of expertise, every engagement
                            in complete detail, and the products I've designed, built, and shipped.
                        </p>
                        <Link
                            to={fullPath}
                            className="pp-more-btn"
                            onClick={() => trackEvent('Full Résumé CTA Clicked', { source: 'end-card', variant })}
                        >
                            <span>View the full resume</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </aside>
                )}

                {/* Printed/PDF-only closing line: points readers at the full version. */}
                {condensed && (
                    <p className="pp-print-footer">
                        This is the condensed {label} resume. Full detail — areas of expertise, every
                        engagement, and shipped products:{' '}
                        <a href={`https://${contact.website}${fullPath}`}>{contact.website}{fullPath}</a>
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
