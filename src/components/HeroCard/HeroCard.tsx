// HeroCard.tsx
import React from 'react';
import { HeroCard as HeroCardType } from '../../interfaces/types';
import "./style.css";
import data from '../../data/HomePage.json';

interface HeroCardProps extends HeroCardType {}

const Card: React.FC<HeroCardProps> = ({ title, level, subTitle, badges }) => {
    return (
        <div className="card hero-card rounded-5 border-bottom border-black py-4 py-lg-5 px-4 px-lg-5">
            {level && <p className="fs-4 fw-semibold mb-0 text-body-tertiary lh-1">{level}</p>}
            <p className="fs-2 fw-semibold lh-1">{title}</p>
            <p>{subTitle}</p>
            <div className="badge-container">
                {badges.map((badge, index) => (
                    <span key={index} className="badge rounded-pill light-green text-dark border border-dark">
                        {badge}
                    </span>
                ))}
            </div>
        </div>
    );
};

const HeroCardList: React.FC = () => {
    const { heroCard } = data;

    return (
        <>
            {heroCard.map((card: HeroCardType, index: number) => (
                <Card
                    key={index}
                    title={card.title}
                    level={card.level}
                    subTitle={card.subTitle}
                    badges={card.badges}
                />
            ))}
        </>
    );
};

export default HeroCardList;





// import React from 'react';
// import "./style.css"
//
// interface HeroCardProps {
//     title: string;
//     level: string;
//     subTitle: string;
//     badges: string[];
// }
//
// const Card: React.FC<HeroCardProps> = ({ title, level, subTitle, badges }) => {
//     return (
//         <div className="card rounded-5 border-bottom border-black py-lg-5 px-lg-5">
//             {level && <p className="fs-4 fw-semibold mb-0 text-body-tertiary lh-1">{level}</p>}
//             <p className="fs-2 fw-semibold lh-1">{title}</p>
//             <p>{subTitle}</p>
//             <span className="badge rounded-pill light-green text-body border border-dark">{badges}</span>
//         </div>
//     );
// };
//
// export default Card;
