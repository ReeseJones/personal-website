import * as React from "react"
import "./footer.scss";

export const Footer: React.FC<React.ReactNode> = () => {
    return <aside className="footer">
        <section>
            <h2>Contact</h2>
            <ul>
                <li>
                    <span>Email:</span> reesedrjones@gmail.com
                </li>
                <li>
                    <span>Phone: </span> 425-591-2419
                </li>
                <li>
                    <span>LinkedIn: </span> <a href="www.linkedin.com/in/reesedrjones">www.linkedin.com/in/reesedrjones</a>
                </li>
            </ul>
        </section>

    </aside>;
}