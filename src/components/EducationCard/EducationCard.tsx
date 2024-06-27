// EducationCard.tsx
import React from 'react';
import educationData from '../../data/HomePage.json'; // Import JSON
import { Data, Education } from '../../interfaces/types'; // Import JSON types
import "./style.css";

// Ensure the imported JSON conforms to the Data type
const data: Data = educationData as Data;

const Card: React.FC<Education> = ({ title, institution, location, icon, date }) => {
    return (
        <div className="eduCard d-flex gap-4 bg-dark-subtle border border-black py-3 px-3 px-lg-5">
            <div dangerouslySetInnerHTML={{ __html: icon }} />
            <div>
            <p className="fs-5 fw-semibold mb-1">{title}</p>
            {institution && <p className="mb-0">{institution}</p>}
            {location && <p className="">{location}</p>}
            <p className="mb-0">{date}</p>
            </div>
        </div>
    );
};

const EducationCard: React.FC = () => {
    return (
        <>
            {data.education.map((edu, index) => (
                <Card
                    key={index}
                    title={edu.title}
                    institution={edu.institution}
                    location={edu.location}
                    date={edu.date}
                    icon={edu.icon}
                />
            ))}
        </>
    );
};

export default EducationCard;