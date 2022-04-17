import * as React from "react";
import { graphql } from "gatsby";
import { Query } from "../../graphql-types";
import { MDXRenderer } from "gatsby-plugin-mdx";

const ArticlePage = ({ data }: { data: Query }) => {
    return (
        <>
            <article>
                <h1>Cool Article Title</h1>
                <p>I used to know a person named lorem ipsum</p>
            </article>
        </>
    );
};

export default ArticlePage;
