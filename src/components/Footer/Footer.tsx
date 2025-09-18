import React, { useEffect, useState } from 'react';
import data from "./data.json";
import { trackEvent } from '../../utils/mixpanel.ts';

interface Link {
    id: number;
    name: string;
    href: string;
    display: boolean;
}

const Footer: React.FC = () => {
    const [links, setLinks] = useState<Link[]>([]);

    useEffect(() => {
        setLinks(data.Links);
    }, []);

    const handleLinkClick = (linkName: string, href: string) => {
        trackEvent('Footer Link Clicked', { linkName, href });
    };

    return (
        <>
            <footer
                className="d-flex flex-wrap justify-content-center align-items-center py-3 my-2 gap-3">
                {links.filter(link => link.display).map((link) => (
                    <a
                        type="button"
                        className="btn btn-outline-light text-decoration-none border-0"
                        target="_blank"
                        key={link.id}
                        href={link.href}
                        onClick={() => handleLinkClick(link.name, link.href)}
                    >
                        {link.name}<i className="bi bi-arrow-up-right ps-2"></i>
                    </a>
                ))}
            </footer>
        </>
    );
}

export default Footer;