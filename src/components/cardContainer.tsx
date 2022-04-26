import React from "react";
import { Card, ICardProps } from "./card";
import "./card.scss";

export interface ICardContainerProps
    extends React.HTMLAttributes<HTMLDivElement> {
    children: ICardProps[];
}

export const CardContainer: React.FC<ICardContainerProps> = (props) => {
    const { children, ...restOfProps } = props;
    return (
        <div
            {...restOfProps}
            className={restOfProps?.className + " card-container"}
        >
            {children.map((child) => {
                return <Card {...child} key={child.id}></Card>;
            })}
        </div>
    );
};
