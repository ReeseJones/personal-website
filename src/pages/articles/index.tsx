import * as React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Query } from "../../../graphql-types";
import { ICardProps } from "../../components/card";
import { CardContainer } from "../../components/cardContainer";

const ArticlesPage = ({ data }: { data: Query }) => {
    const cardBanner = (
        <div style={{ background: "#DDD", height: "64px" }}></div>
    );

    const dummyContent = (
        <ul>
            <li>This is a thing</li>
            <li>details</li>
            <li>Reese Jones</li>
            <li>Date: {new Date().toString()}</li>
        </ul>
    );

    const cards: ICardProps[] = data.allMdx.nodes.map((node) => {
        return {
            id: node?.id,
            title: <h2>{node?.frontmatter?.title}</h2>,
            backgroundElement: cardBanner,
            children: <MDXRenderer>{node.body}</MDXRenderer>
        };
    });

    return (
        <>
            <p>Articles Page!</p>
            <CardContainer>{cards}</CardContainer>
        </>
    );
};

export const query = graphql`
    query MyQuery {
        allMdx(sort: { fields: frontmatter___date, order: DESC }) {
            nodes {
                frontmatter {
                    date(formatString: "MMMM D, YYYY")
                    title
                }
                id
                body
            }
        }
    }
`;

export default ArticlesPage;
