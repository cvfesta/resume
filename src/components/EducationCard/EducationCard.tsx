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



// import React from 'react';
// import educationData from '../../data/HomePage.json'; // Import Json
// import { Data, Education } from '../../interfaces/types'; // Import Json types
// // import "./style.css";
//
// // Ensure the imported JSON conforms to the Data type
// const data: Data = educationData as Data;
//
// const Card: React.FC<Education> = ({ title, icon, date }) => {
//     return (
//         <div className=" border-bottom border-black py-lg-5 px-lg-5">
//             {/*<div>{icon}</div>*/}
//             <div dangerouslySetInnerHTML={{__html: icon}}/>
//             <p className="fs-2 fw-semibold mb-0 lh-1">{title}</p>
//             <p>{date}</p>
//         </div>
//     );
// };
//
// const EducationCard: React.FC = () => {
//     return (
//         <div>
//             {data.education.map((edu, index) => (
//                 <Card
//                     key={index}
//                     title={edu.title}
//                     date={edu.date}
//                     icon={edu.icon}
//                 />
//             ))}
//         </div>
//     );
// };
//
// export default EducationCard;