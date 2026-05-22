import React from "react";

export interface IconSvgProps extends React.SVGProps<SVGSVGElement> {
    size?: number;   // shorthand for width & height
    height?: number; // optional explicit height override
    fill?: string;   // optional fill color override for the icon
}