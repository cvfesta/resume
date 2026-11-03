import React from 'react';
import { Link } from 'react-router-dom';
import { calculateYearsOfExperience } from '../../utils/calculateYearsOfExperience';
import { trackEvent } from '../../utils/mixpanel';
import qrInteractiveResume from '../../assets/qr-interactive-resume.svg';
import walkoutDark from '../../assets/walkout-dark.svg';
import ghostyIcon from '../../assets/ghosty.svg';
import shotWalkout from '../../assets/shots/walkout-stage-live.jpg';
import shotGhosty from '../../assets/shots/ghosty-home.jpg';
import { GoogleLogo, PmiLogo, PsuLogo } from '../../components/icons/icons';
import YearMark from '../../components/icons/YearMark';
import { Audience, data, resumeSummary } from './printContent';
import './printable.css';
import './designed.css';

/** Each hat carries the skill groups it uses, so the hats are the skills section. */
const HAT_SKILLS: Record<string, string[]> = {
    'AI Engineering': ['AI & Cloud', 'Engineering'],
    'Engineering Leadership': ['Delivery', 'Domain'],
    'UX & Design Systems': ['Design'],
};

const appIcon: Record<string, string> = {
    'walkout-intros': walkoutDark,
    'ghosty': ghostyIcon,
};

const appShot: Record<string, string> = {
    'walkout-stage-live': shotWalkout,
    'ghosty-home': shotGhosty,
};

const credentialLogo: Record<string, React.ReactNode> = {
    psu: <PsuLogo size={38} />,
    pmi: <PmiLogo size={38} />,
    google: <GoogleLogo size={38} />,
};

const BASE_PATH: Record<Audience, string> = {
    corporate: '/print',
    contract: '/print/independent-contractor-gj3cva',
};

interface DesignedResumeProps {
    audience: Audience;
    /** Adds what the condensed resume leaves out; the design is the same. */
    full?: boolean;
}

/** The resume people see, in condensed and full form. Everything is real text
 * in reading order; job portals get the plain version (PrintablePage). */
const DesignedResume: React.FC<DesignedResumeProps> = ({ audience, full = false }) => {
    const corporate = audience === 'corporate';
    const { contact, hero, roles, sections, skills, education, experience, projects } = data;
    const summary = resumeSummary(calculateYearsOfExperience()).split(/\n+/);
    const liveApps = projects.filter((project) => project.available);

    return (
        <div className="pp-screen dr-screen">
            <div className="pp-toolbar">
                <Link to="/" className="pp-back">← Back to the site</Link>
                <div className="pp-variant-links">
                    <Link
                        to={full ? BASE_PATH[audience] : `${BASE_PATH[audience]}/full`}
                        className="pp-variant-link"
                        onClick={() => trackEvent('Résumé Variant Toggled', { audience, toFull: !full })}
                    >
                        {full ? 'View condensed version' : 'View full version'}
                    </Link>
                </div>
                <button
                    type="button"
                    className="pp-print-btn"
                    onClick={() => {
                        trackEvent('Résumé Printed', { variant: audience, full });
                        window.print();
                    }}
                >
                    Print / Save as PDF
                </button>
            </div>

            <article className="dr-page">
                <header className="dr-band">
                    <div className="dr-band-main">
                        <h1 className="dr-name">{hero.title}</h1>
                        <p className="dr-eyebrow">{hero.eyebrow}</p>
                        <p className="dr-contact">
                            {contact.location} · {contact.email} · {contact.phone}
                        </p>
                        <p className="dr-contact">
                            <a href={`https://www.${contact.linkedin}`}>{contact.linkedin}</a>
                            {' · '}
                            <a href={`https://${contact.website}`}>{contact.website}</a>
                        </p>
                        {!corporate && <p className="dr-contact dr-availability">{contact.availability}</p>}
                    </div>
                    <div className="dr-qr">
                        <div className="dr-qr-plate">
                            <img src={qrInteractiveResume} alt={`QR code: ${contact.website}`} />
                        </div>
                        <p>Scan the live site</p>
                    </div>
                </header>

                <div className="dr-body">
                    <h2 className="dr-heading">Summary</h2>
                    <div className="dr-summary">
                        {summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>

                    <h2 className="dr-heading dr-heading--section">Experience</h2>
                    <div className="dr-timeline">
                        {experience.map((exp) => {
                            const label = corporate
                                ? (exp.corporateEngagementLabel ?? exp.engagementType)
                                : exp.engagementType;
                            const bullets = exp.bullets.filter((bullet) => full || !bullet.fullOnly);
                            return (
                                <section className="dr-job" key={exp.title + exp.organization}>
                                    <div>
                                        <YearMark className="dr-year" year={exp.date.split(/[-–]/)[0].trim()} />
                                    </div>
                                    <div className="dr-job-card">
                                        <h3 className="dr-job-title">{exp.title}</h3>
                                        <p className="dr-job-org">
                                            <span>{exp.organization} · {exp.date}</span>
                                            {label && label !== 'Employee' && <span className="dr-chip">{label}</span>}
                                        </p>
                                        <p className="dr-job-lead">{exp.lead}</p>
                                        <ul className="dr-lines">
                                            {bullets.map((bullet) => <li key={bullet.text}>{bullet.text}</li>)}
                                        </ul>
                                        {full && exp.badges && (
                                            <p className="dr-chips">
                                                {exp.badges
                                                    .filter((badge) => corporate ? !/corp-to-corp/i.test(badge) : true)
                                                    .join(' · ')}
                                            </p>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    <h2 className="dr-heading dr-heading--section">Technical Skills</h2>
                    {roles.map((role) => (
                        <section className="dr-hat" key={role.title}>
                            <div>
                                <h3 className="dr-hat-title">{role.title}</h3>
                            </div>
                            <div>
                                {full && <p className="dr-hat-text">{role.subTitle}</p>}
                                {skills
                                    .filter((group) => HAT_SKILLS[role.title]?.includes(group.category))
                                    .map((group) => (
                                        <p className="dr-hat-skills" key={group.category}>
                                            <strong>{group.category}:</strong> {group.items.join(', ')}
                                        </p>
                                    ))}
                                {full && <p className="dr-chips">{role.badges.join(' · ')}</p>}
                            </div>
                        </section>
                    ))}

                    <h2 className="dr-heading dr-heading--section">Apps</h2>
                    <p className="dr-intro">{sections.projects.intro}</p>
                    {liveApps.map((project) => (
                        <section className="dr-project" key={project.name}>
                            <div className="dr-project-icon">
                                <img src={project.icon ? appIcon[project.icon] : undefined} alt="" />
                            </div>
                            <div className="dr-project-copy">
                                <h3 className="dr-job-title">
                                    <a href={project.link}>{project.name}</a>
                                    {project.meta && <span className="dr-chip dr-chip--live">{project.meta}</span>}
                                </h3>
                                <p className="dr-project-category">{project.category}</p>
                                <p className="dr-project-text">{project.description}</p>
                            </div>
                            {project.shot && (
                                <div className="dr-project-shot">
                                    <img src={appShot[project.shot]} alt={`${project.name} screenshot`} />
                                </div>
                            )}
                        </section>
                    ))}

                    <h2 className="dr-heading dr-heading--section">Education &amp; Certifications</h2>
                    <div className="dr-education">
                        {education.map((edu) => (
                            <section key={edu.title}>
                                <div className="dr-edu-logo">{credentialLogo[edu.icon]}</div>
                                <h3>{edu.title}</h3>
                                <p>{edu.institution} · {edu.date}</p>
                                {full && edu.description && <p className="dr-edu-text">{edu.description}</p>}
                            </section>
                        ))}
                    </div>
                </div>

                {/* Someone on the site has already arrived, so ask them to get in touch. */}
                <div className="dr-strip dr-strip--screen">
                    <span>Interested? Let's talk.</span>
                    <span className="dr-strip-url">
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                        {' · '}
                        <a href={`tel:+1${contact.phone.replace(/\D/g, '')}`}>{contact.phone}</a>
                    </span>
                </div>
            </article>
        </div>
    );
};

export default DesignedResume;
