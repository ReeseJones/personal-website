import React from "react";
import { navbarPages } from "./siteMap";
import { Link } from "gatsby"

export const Navbar: React.FC<React.ReactNode> = () => {

    return <nav>
        {navbarPages.map((page) => {
            return <Link to={page.path}>{page.name}</Link>
        })}
    </nav>;
}