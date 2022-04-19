import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Query } from "../../../graphql-types";
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image";
import "./article.scss";

const ArticlePage = ({ data }: { data: Query }) => {
    const image = getImage(data.mdx?.frontmatter?.hero_image as any);
    return (
        <>
            <article>
                <h1>{data?.mdx?.frontmatter?.title}</h1>
                <p>{data?.mdx?.frontmatter?.date}</p>
                <GatsbyImage
                    className="hero-image"
                    image={image as IGatsbyImageData}
                    alt={data.mdx?.frontmatter?.hero_image_alt as string}
                />
                {data?.mdx?.body ? (
                    <MDXRenderer>{data.mdx.body}</MDXRenderer>
                ) : null}
            </article>
        </>
    );
};

export const query = graphql`
    query ($id: String) {
        mdx(id: { eq: $id }) {
            frontmatter {
                title
                date(formatString: "MMMM D, YYYY")
                hero_image_alt
                hero_image {
                    childImageSharp {
                        gatsbyImageData
                    }
                }
            }
            body
        }
    }
`;

export default ArticlePage;
