import React, { useEffect, useState } from 'react';
import data from "./data.json";
import Logo from '../../assets/logo.svg';
import ContactModal from '../../components/Contact/Contact'; // Import the ContactModal component

const Header: React.FC = () => {
    const [links, setLinks] = useState<string[]>([]);

    useEffect(() => {
        // Assuming 'data' has a 'Links' property that is an array of strings
        setLinks(data.Links);
    }, []);

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg px-lg-5">
                    <a className="navbar-brand" href="#">
                        <img className="img-fluid justify-content-center" src={Logo} alt="Interlaced c and f letters logo" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse justify-content-end navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            {links.map((link) => {
                                if (link === "Contact") {
                                    return (
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark text-decoration-none border-0"
                                            key={link}
                                            data-bs-toggle="modal"
                                            data-bs-target="#contactModal"
                                        >
                                            {link}
                                        </button>
                                    );
                                }
                                return (
                                    <a className="btn btn-outline-dark text-decoration-none border-0" key={link} href={`#${link}`}>
                                        {link}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            </header>
            <ContactModal /> {/* Include the ContactModal component */}
        </>
    );
}

export default Header;



// import React, { useEffect, useState } from 'react';
// import data from "./data.json";
// import Logo from '../../assets/logo.svg';
//
// const Header: React.FC = () => {
//     const [links, setLinks] = useState<string[]>([]);
//
//     useEffect(() => {
//         // Assuming 'data' has a 'Links' property that is an array of strings
//         setLinks(data.Links);
//     }, []);
//
//     return (
//         <>
//             <header>
//                 <nav className="navbar navbar-expand-lg px-lg-5">
//                     <a className="navbar-brand" href="#">
//                         <img className="img-fluid justify-content-center" src={Logo} alt="Interlaced c and f letters logo" />
//                     </a>
//                     <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
//                             data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
//                             aria-expanded="false" aria-label="Toggle navigation">
//                         <span className="navbar-toggler-icon"></span>
//                     </button>
//                     <div className="collapse justify-content-end navbar-collapse" id="navbarNavAltMarkup">
//                         <div className="navbar-nav">
//                             {links.map((link) => (
//                                 <a className=" btn btn-outline-dark text-decoration-none border-0" key={link} href={`#${link}`}>
//                                     {link}
//                                 </a>
//                             ))}
//                         </div>
//                     </div>
//                 </nav>
//             </header>
//         </>
//     );
// }
//
// export default Header;
