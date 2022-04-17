import * as React from "react";
import "../styles.scss";
import { StaticImage } from "gatsby-plugin-image";

const IndexPage = () => {
    return (
        <section className="article-body">
            <StaticImage
                src={"../images/headshot5.jpg"}
                alt="Reese Jones head shot"
                width={200}
                height={200}
            ></StaticImage>
            <p className="hero-title">Reese Jones</p>
            <p className="hero-body">Software Engineer, Gamer & Climber</p>
        </section>
    );
};

export default IndexPage;
