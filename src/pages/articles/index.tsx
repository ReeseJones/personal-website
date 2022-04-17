import * as React from "react";
import { Card, ICardProps } from "../../components/card";
import { CardContainer } from "../../components/cardContainer";
import { Layout } from "../../layouts";

const IndexPage = () => {
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

    const cards: ICardProps[] = [
        {
            title: <h2>Card Example Title</h2>,
            backgroundElement: cardBanner,
            children: dummyContent
        }
    ];

    for (let i = 0; i < 15; i += 1) {
        cards.push(cards[0]);
    }

    return (
        <>
            <p>Articles Page!</p>
            <CardContainer>{cards}</CardContainer>
        </>
    );
};

export default IndexPage;
