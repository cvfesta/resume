import React, { useEffect, useState } from 'react';
import data from "./data.json";

interface Link {
    id: number;
    name: string;
    href: string;
}

const Footer: React.FC = () => {
    const [links, setLinks] = useState<Link[]>([]);

    useEffect(() => {
        // Assuming 'data' has a 'Links' property that is an array of link objects
        setLinks(data.Links);
    }, []);


    return (
        <>
            <footer
                className="d-flex flex-wrap justify-content-center align-items-center py-3 my-2 gap-3">
                {/*<p className="mb-0">© <span className="date" id="date"></span> Christian Festa</p>*/}
                    {links.map((link) => (
                        <a type="button" className="btn btn-outline-light text-decoration-none border-0" target="_blank"
                           key={link.id} href={link.href}>
                            {link.name}<i className="bi bi-arrow-up-right ps-2"></i>
                        </a>
                    ))}
            </footer>
        </>
    );
}

export default Footer;
