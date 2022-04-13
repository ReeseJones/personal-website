import * as React from "react";
import "../styles.scss";
import headShotPicture from "../images/headshot5.jpg";

const IndexPage = () => {
    return (
        <section className="article-body">
            <img src={headShotPicture} alt="Reese Jones head shot" width={200} height={200} />
            <p className="hero-title">Reese Jones</p>
            <p className="hero-body">Software Engineer, Gamer & Climber</p>
        </section>
    );
};

export default IndexPage;
