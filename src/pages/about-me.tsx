import * as React from "react";
import { getImage, IGatsbyImageData, StaticImage } from "gatsby-plugin-image";
import { GatsbyImageGallery } from "../components/gatsby-image-gallery";
import { graphql } from "gatsby";
import { Query } from "../../graphql-types";

const IndexPage = ({ data }: { data: Query }) => {
    const imageData = data.allFile.edges
        .map((fileEdge) => {
            if (fileEdge.node.childImageSharp) {
                return getImage(fileEdge.node.childImageSharp.gatsbyImageData);
            }
            return undefined;
        })
        .filter((val) => {
            return val != undefined;
        }) as IGatsbyImageData[];

    return (
        <div className="page-content grid">
            <div className="col col-12">
                <h1>A little about me</h1>
            </div>
            <div className="grid col col-lg col-6 justify-center">
                <StaticImage
                    className="border"
                    src={"../images/makin-bacon.jpg"}
                    alt="Reese Jones making bacon while at a camping trip"
                    height={612}
                ></StaticImage>
            </div>
            <div className="col col-lg col-6">
                <p>
                    My passion for developing games started in middle school,
                    and I have been constantly learning new skills ever since in
                    order to increase scope and complexity of games I can
                    develop. To further this aim I attended Digipen Institute of
                    Technology and graduated in 2016.
                </p>
                <p>
                    Playing games is fun, but making them is where it's really
                    at! I love learning new languages, technology, and design
                    concepts. I have made a point during my time at DigiPen to
                    learn as many different things as I could. I have now made
                    games in my own engine, Unreal, and Unity.
                </p>
                <p>
                    I enjoy working on programs that I get to see other people
                    use, whether its a small app, engine tools, completed game,
                    or just a small library used in someone else's project, it's
                    really fulfilling to see my work in action.
                </p>
                <p>Thanks for taking the time to check out my website!</p>
            </div>
            <div className="col col-12">
                <h2>Programming Interests</h2>
            </div>
            <div className="col col-lg col-6">
                <p>
                    Games got me into programming, but my first job in the
                    industry had me working on realtime web applications which
                    had a lot of the same challenges as video games! The app I
                    worked on featured detailed indoor maps of buildings which
                    showed realtime information about the occupancy of the rooms
                    in the building, as well as detailed descriptions of each of
                    the spaces in the building. You could use the app to
                    navigate from area of the building to any other space and
                    the whole experience had to run on low powered kiosks, and
                    mobile web browsers at a steady 60 FPS.
                </p>
                <p>
                    That job kicked off my deep dive into the world of web app
                    development and really spurred my interest in developing and
                    designing performant UI. A problem I find my self
                    encountering every time a human has to interface with
                    someones program. Which is just about every program.
                </p>
            </div>
            <div className="grid col col-lg col-6 justify-center">
                <StaticImage
                    className="border"
                    src={"../images/playing_beatsaber.JPG"}
                    alt="Reese Jones setting up Beatsaber at his computer."
                    width={384}
                    height={512}
                    quality={100}
                ></StaticImage>
            </div>
            <div className="col col-12">
                <h2>Hobbies</h2>
            </div>
            <div className="col col-12">
                <p>
                    Its probably just easier if I show you. The below image
                    gallery comes from this example of{" "}
                    <a href="https://css-tricks.com/adaptive-photo-layout-with-flexbox/">
                        Adaptive Photo Layout With Flexbox
                    </a>
                    . It features photos from various hobbies of mine from
                    pottery, boards and bikes to puzzles and dogs.
                </p>
            </div>
            <div className="col col-12">
                <GatsbyImageGallery imageData={imageData}></GatsbyImageGallery>
            </div>
        </div>
    );
};

export const pageQuery = graphql`
    query aboutMeImageQuery {
        allFile(
            filter: { relativePath: { glob: "about-me-gallery**/*" } }
            sort: { fields: relativePath, order: ASC }
        ) {
            edges {
                node {
                    childImageSharp {
                        gatsbyImageData(
                            layout: FIXED
                            height: 300
                            width: null
                            transformOptions: { fit: INSIDE }
                        )
                    }
                    relativePath
                }
            }
        }
    }
`;

export default IndexPage;
