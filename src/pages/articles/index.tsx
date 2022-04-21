import * as React from "react";
import { graphql, Link } from "gatsby";
import { Query } from "../../../graphql-types";
import { ICardProps } from "../../components/card";
import { CardContainer } from "../../components/cardContainer";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";

const ArticlesPage = ({ data }: { data: Query }) => {
    const cards: ICardProps[] = data.allMdx.nodes.map((node) => {
        const image = getImage(node.frontmatter?.hero_image as any);
        return {
            id: node?.id,
            title: (
                <Link to={`/articles/${node.slug}`}>
                    {<h2>{node?.frontmatter?.title}</h2>}
                </Link>
            ),
            backgroundElement: (
                <GatsbyImage
                    style={{ borderRadius: "0.25rem", maxHeight: "400px" }}
                    image={image as IGatsbyImageData}
                    alt={node.frontmatter?.hero_image_alt as string}
                />
            ),
            children: (
                <>
                    <ul>
                        <li>This is a thing</li>
                        <li>details</li>
                        <li>Reese Jones</li>
                    </ul>
                    <p>{node?.frontmatter?.date}</p>
                </>
            )
        };
    });

    return (
        <div className="article-page">
            <h1>Articles</h1>
            <CardContainer>{cards}</CardContainer>
        </div>
    );
};

export const query = graphql`
    query {
        allMdx(sort: { fields: frontmatter___date, order: DESC }) {
            nodes {
                frontmatter {
                    date(formatString: "MMMM D, YYYY")
                    title
                    hero_image_alt
                    hero_image {
                        childImageSharp {
                            gatsbyImageData(width: 400)
                        }
                    }
                }
                id
                slug
            }
        }
    }
`;

export default ArticlesPage;
