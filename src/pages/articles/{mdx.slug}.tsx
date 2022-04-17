import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Query } from "../../../graphql-types";

const ArticlePage = ({ data }: { data: Query }) => {
    return (
        <>
            <article>
                <h1>{data?.mdx?.frontmatter?.title}</h1>
                <p>{data?.mdx?.frontmatter?.date}</p>
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
            }
            body
        }
    }
`;

export default ArticlePage;
