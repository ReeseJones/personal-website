import * as React from "react";
import { graphql } from "gatsby";
import { ICardProps } from "../components/card";
import { CardContainer } from "../components/cardContainer";
import { Query } from "../../graphql-types";

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
            title: <h2>{node?.frontmatter?.title}</h2>,
            backgroundElement: cardBanner,
            children: dummyContent
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
        allMdx {
            nodes {
                frontmatter {
                    date
                    title
                }
            }
        }
    }
`;

export default ArticlesPage;
