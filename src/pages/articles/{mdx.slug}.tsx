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
            <article className="page-content blog-article">
                <div className="grid">
                    <div className="col col-12">
                        <h1>{data?.mdx?.frontmatter?.title}</h1>
                        <p>{data?.mdx?.frontmatter?.date}</p>
                    </div>
                    <div className="col col-12 justify-center">
                        <GatsbyImage
                            className="hero-image"
                            image={image as IGatsbyImageData}
                            alt={
                                data.mdx?.frontmatter?.hero_image_alt as string
                            }
                        />
                    </div>
                    <div className="col col-12">
                        {data?.mdx?.body ? (
                            <MDXRenderer>{data.mdx.body}</MDXRenderer>
                        ) : null}
                    </div>
                </div>
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
                        gatsbyImageData(
                            width: 928
                            transformOptions: { cropFocus: NORTH }
                        )
                    }
                }
            }
            body
        }
    }
`;

export default ArticlePage;
