import React from "react";
import { Card, ICardProps } from "./card";
import "./card.scss";

export interface ICardContainerProps {
    children: ICardProps[];
}

export const CardContainer: React.FC<ICardContainerProps> = (props) => {
    return (
        <div className="card-container">
            {props.children.map((child) => {
                return <Card {...child} key={child.id}></Card>;
            })}
        </div>
    );
};
