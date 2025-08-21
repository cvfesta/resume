// EducationCard.tsx
import React from "react";
import educationData from "../../data/HomePage.json"; // Adjust path if needed
import { Data, Education } from "../../interfaces/types";
import { PsuLogo, GoogleLogo, PmiLogo } from "../icons/icons";
import "./style.css";

const data = educationData as Data;

const iconMap: Record<string, React.ReactNode> = {
    psu: <PsuLogo size={64} />,
    award: <i className="bi bi-award display-5"></i>,
    google: <GoogleLogo size={64} />,
    pmi: <PmiLogo size={64} />,
    // Add more mappings as needed
};

const Card: React.FC<Education> = ({
                                       title,
                                       institution,
                                       location,
                                       date,
                                       icon,
                                   }) => {
    return (
        <div className="eduCard d-flex gap-3 bg-dark-subtle border border-secondary py-3 px-3">
            <div className="icon-container">
                {iconMap[icon] || null}
            </div>
            <div>
                <p className="fs-5 fw-semibold mb-1">{title}</p>
                {institution && <p className="mb-0">{institution}</p>}
                {location && <p className="">{location}</p>}
                <p className="mb-0">{date}</p>
            </div>
        </div>
    );
};

const EducationCard: React.FC = () => (
    <>
        {data.education.map((edu, index) => (
            <Card key={index} {...edu} />
        ))}
    </>
);

export default EducationCard;